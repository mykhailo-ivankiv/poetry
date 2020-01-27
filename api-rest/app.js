import express from "express";
import authorRoute from "./routers/authors.js";
import poemsRoute from "./routers/poems.js";
import cors from "cors";

const app = express();
const API_PORT = 3001;
app.use(cors());
app.use("/api/authors", authorRoute);
app.use("/api/poems", poemsRoute);
app.listen(API_PORT, () => {
  console.log(`API is running on http://localhost:${API_PORT}`);
});
