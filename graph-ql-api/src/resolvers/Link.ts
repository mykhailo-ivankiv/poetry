export const postedBy = (parent, args, context) =>
  context.prisma.link({ id: parent.id }).postedBy();

export const votes = (parent, args, context) =>
  context.prisma.link({ id: parent.id }).votes();
