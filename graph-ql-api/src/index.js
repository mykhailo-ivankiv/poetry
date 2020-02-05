import yenv from "yenv";
import yoda from "graphql-yoga";
import { promises as fs } from "fs";
import { getJSONFromFile } from "../../api-rest/src/utils/helpers.js";

const { DATA_PATH } = yenv();
const { GraphQLServer } = yoda;

const resolvers = {
  Query: {
    allAuthors: async () => {
      const fileList = await fs.readdir(`${DATA_PATH}/authors`);

      return await Promise.all(
        fileList.map(fileName =>
          getJSONFromFile(`${DATA_PATH}/authors/${fileName}`)
        )
      );
    },
    author: async (parent, { id }) =>
      getJSONFromFile(`${DATA_PATH}/authors/${id}.json`),
    poem: async (parent, { id }) =>
      getJSONFromFile(`${DATA_PATH}/poems/${id}.json`)
  },

  Poem: {
    author: async parent => {
      const { author } = await parent;
      return getJSONFromFile(`${DATA_PATH}/authors/${author}.json`);
    }
  },

  Author: {
    poems: async parent => {
      const { poems } = await parent;

      return Promise.all(
        poems.map(poemId =>
          getJSONFromFile(`${DATA_PATH}/poems/${poemId}.json`)
        )
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/poetry.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
