import yenv from "yenv";
import express from "express";
import authorRoute from "./routers/authors.js";
import poemsRoute from "./routers/poems.js";
import cors from "cors";

const env = yenv();
console.log(env.MONGO_URI);

const app = express();
const API_PORT = 8080;
app.use(cors());
app.use("/api/authors", authorRoute);
app.use("/api/poems", poemsRoute);
app.listen(API_PORT, () => {
  console.log(`API is running on http://localhost:${API_PORT}`);
});
