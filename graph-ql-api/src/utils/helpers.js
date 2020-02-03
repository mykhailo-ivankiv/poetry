import { promises as fs } from "fs";

export const getJSONFromFile = async path => {
  const text = await fs.readFile(path, "utf8");
  return JSON.parse(text);
};
