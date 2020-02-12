import { promises as fs } from "fs";

export const getJSONFromFile
  : (path: string) => Promise<string>
  = async path => JSON.parse(await fs.readFile(path, "utf8"));
