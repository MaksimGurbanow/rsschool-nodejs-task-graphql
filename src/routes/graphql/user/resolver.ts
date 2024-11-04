import { GraphQLFieldConfig, GraphQLList, ThunkObjMap } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types.js';

const UserResolverObject: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {
  users: {
    type: new GraphQLList(UserType),
    description: 'Fetch all users',
    resolve: async (_, __, ctx) =>
      await ctx.prisma.user.findMany({
        include: {
          posts: true,
          subscribedToUser: { select: { subscriber: true } },
          userSubscribedTo: { select: { author: true } },
          profile: true,
        },
      }),
  },
  user: {
    type: UserType,
    description: 'Fetch user by id',
    args: { id: { type: UUIDType } },
    resolve: async (_, args, ctx) =>
      await ctx.prisma.user.findUnique({
        where: { id: args.id },
        include: {
          posts: true,
          subscribedToUser: { select: { subscriber: true } },
          userSubscribedTo: { select: { author: true } },
          profile: true,
        },
      }),
  },
};

export { UserResolverObject };
