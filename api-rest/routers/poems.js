import express from "express";
const { Router } = express;
import { promises as fs } from "fs";
import { getJSONFromFile } from "../utils/helpers.js";
const poemsRoute = Router();

const DATA_PATH = `../grabber/data`;
poemsRoute.get("/", async (req, res) => {
  const fileList = await fs.readdir(`${DATA_PATH}/poems`);
  const data = {
    authors: await Promise.all(
      fileList.map(fileName =>
        getJSONFromFile(`${DATA_PATH}/poems/${fileName}`)
      )
    )
  };

  res.send(data);
});

poemsRoute.get("/:id", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const poem = await getJSONFromFile(`${DATA_PATH}/poems/${fileName}`);
  res.send(poem);
});

poemsRoute.get("/:id/author", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const poem = await getJSONFromFile(`${DATA_PATH}/poems/${fileName}`);
  const author = await getJSONFromFile(
    `${DATA_PATH}/authors/${poem.author}.json`
  );

  res.send(author);
});

export default poemsRoute;
