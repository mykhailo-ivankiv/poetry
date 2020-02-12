import * as yenv from "yenv";
import { getJSONFromFile } from "../utils/helpers";

const { DATA_PATH } = yenv();

export const author = async parent => {
  const { author } = await parent;
  return getJSONFromFile(`${DATA_PATH}/authors/${author}.json`);
};
