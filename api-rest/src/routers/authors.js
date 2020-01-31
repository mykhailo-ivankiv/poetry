import yenv from "yenv";
import express from "express";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../utils/helpers.js";

const { DATA_PATH } = yenv();

const { Router } = express;
const authorRoute = Router();

authorRoute.get("/", async (req, res) => {
  const fileList = await fs.readdir(`${DATA_PATH}/authors`);
  const data = {
    authors: await Promise.all(
      fileList.map(fileName =>
        getJSONFromFile(`${DATA_PATH}/authors/${fileName}`)
      )
    )
  };

  res.send(data);
});

authorRoute.get("/:id", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const author = await getJSONFromFile(`${DATA_PATH}/authors/${fileName}`);
  res.send(author);
});

authorRoute.get("/:id/poems", async (req, res) => {
  const fileName = `${req.params.id}.json`;
  const author = await getJSONFromFile(`${DATA_PATH}/authors/${fileName}`);
  const poems = await Promise.all(
    author.poems.map(poemID =>
      getJSONFromFile(`${DATA_PATH}/poems/${poemID}.json`)
    )
  );

  res.send(poems);
});

export default authorRoute;
