export const links = (parent, args, context) =>
  context.prisma.user({ id: parent.id }).links();
