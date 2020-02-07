import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";

import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as User from "./resolvers/User";
import * as Link from "./resolvers/Link";
import * as Poem from "./resolvers/Poem";
import * as Author from "./resolvers/Author";

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Poem,
  Author
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
