import { promises as fs } from "fs";
import axios from "axios";
import iconv from "iconv-lite";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

export const getHTML = url =>
  axios
    .get(url, { responseType: "arraybuffer" })
    .then(response => iconv.decode(response.data, "win1251"))
    .catch(error => console.log(error));

export const queryDocument = (html, query) => [
  ...new JSDOM(html).window.document.querySelectorAll(query)
];

export const getJSONFromFile = async path => {
  const text = await fs.readFile(path, "utf8");
  return JSON.parse(text);
};

export const writeJsonToFile = async (filePath, data) =>
  fs.writeFile(filePath, JSON.stringify(data, null, 2));

export async function* getAsyncGenerator(data, fn) {
  for (const item of data) yield fn(item);
}

export const asyncMap = async (iterator, fn) => {
  let counter = 0;
  const result = [];
  for await (let data of iterator) result.push(await fn(data, counter++));
  return result;
};
