import * as yenv from "yenv";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../utils/helpers";

const { DATA_PATH } = yenv();

export const feed = async (parent, args, context, info) => {
  const where = args.filter
    ? {
        description_contains: args.filter,
        url_contains: args.filter
      }
    : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });

  const count = await context.prisma
    .linksConnection({ where })
    .aggregate()
    .count();

  return {
    links,
    count
  };
};

export const allAuthors = async () =>
  Promise.all(
    (await fs.readdir(`${DATA_PATH}/authors`)).map(fileName =>
      getJSONFromFile(`${DATA_PATH}/authors/${fileName}`)
    )
  );

export const author = async (parent, { id }) =>
  getJSONFromFile(`${DATA_PATH}/authors/${id}.json`);

export const poem = async (parent, { id }) =>
  getJSONFromFile(`${DATA_PATH}/poems/${id}.json`);
