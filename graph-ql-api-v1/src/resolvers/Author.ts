import * as yenv from "yenv";
import { getJSONFromFile } from "../utils/helpers";

const { DATA_PATH } = yenv();

export const poems = async parent => {
  const { poems } = await parent;

  return Promise.all(
    poems.map(poemId => getJSONFromFile(`${DATA_PATH}/poems/${poemId}.json`))
  );
};
