export const link = (parent, args, context) =>
  context.prisma.vote({ id: parent.id }).link();

export const user = (parent, args, context) =>
  context.prisma.vote({ id: parent.id }).user();
