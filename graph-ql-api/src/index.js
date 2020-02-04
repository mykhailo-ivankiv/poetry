import yenv from "yenv";
import express from "express";
import graphqlHTTP from "express-graphql";
import graphql from "graphql";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../../api-rest/src/utils/helpers.js";

const { buildSchema } = graphql;

const { DATA_PATH } = yenv();
const schema = buildSchema(`
  type Query {
    allAuthors(last: Int): [Author!]!
  }
  
  type Author {
    id: ID!
    name: String!
    link: String!
    poems: [Poem!]!
  }
  
  type Poem {
    author: Author!
    id: ID!
    title: String!
    link: String!
    html: String!
  }
`);

const root = {
  hello: async () => "Hello world!",
  allAuthors: async () => {
    const fileList = await fs.readdir(`${DATA_PATH}/authors`);

    const authors = await Promise.all(
      fileList.map(fileName =>
        getJSONFromFile(`${DATA_PATH}/authors/${fileName}`)
      )
    );

    return authors;
  },

  Author: {
    id: parent => parent.id,
    name: parent => parent.name
  }
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
