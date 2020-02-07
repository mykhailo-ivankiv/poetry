import * as yenv from "yenv";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../utils/helpers";

const { DATA_PATH } = yenv();

export const feed = (parent, args, context, info) => context.prisma.links();

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
