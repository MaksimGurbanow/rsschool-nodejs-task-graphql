import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, ThunkObjMap } from 'graphql';
import { PostType } from '../types.js';
import { UUIDType } from '../types/uuid.js';

const PostResolverObject: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {
  posts: {
    type: new GraphQLList(PostType),
    description: 'Fetch all posts',
    resolve: async (_, __, ctx) => await ctx.prisma.post.findMany(),
  },
  post: {
    type: PostType,
    description: 'Fetch post by id',
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_, args, ctx) =>
      await ctx.prisma.post.findUnique({ where: { id: args.id } }),
  },
};

export { PostResolverObject };
