import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { APP_SECRET, getUserId } from "../utils";

export const signup = async (parent, args, context, info) => {
  const password = await hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = sign({ userId: user.id }, APP_SECRET);

  return { token, user };
};

export const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = sign({ userId: user.id }, APP_SECRET);

  return { token, user };
};

export const post = (parent, args, context, info) => {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
};

export const vote = async (parent, args, context, info) => {
  const userId = getUserId(context);
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });

  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
};
