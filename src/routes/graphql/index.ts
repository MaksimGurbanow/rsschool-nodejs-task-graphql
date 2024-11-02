import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import { UserQueryType } from './user/query.js';
import { PostQueryType } from './post/query.js';
import { MemberTypeQueryType } from './member-type/query.js';
import { ProfileQueryType } from './user/profile/query.js';
import { UUIDType } from './types/uuid.js';

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserQueryType),
      description: 'Fetch all users',
      resolve: async (_, __, context) => {
        const { prisma } = context;
        return prisma.user.findMany();
      },
    },
    user: {
      type: UserQueryType,
      description: 'Fetch user by id',
      args: { id: { type: UUIDType } },
      resolve: async (_, args, context) => {
        const { prisma } = context;
        return prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostQueryType),
      description: 'Fetch all posts',
      resolve: async (_, __, context) => {
        const { prisma } = context;
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostQueryType,
      description: 'Fetch post by id',
      args: { id: { type: UUIDType } },
      resolve: async (_, args, context) => {
        const { prisma } = context;
        return prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeQueryType),
      description: 'Fetch all member types',
      resolve: async (_, __, context) => {
        const { prisma } = context;
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: ProfileQueryType,
      description: 'Fetch profile by id',
      args: { id: { type: UUIDType } },
      resolve: async (_, args, context) => {
        const { prisma } = context;
        return prisma.memberTye.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileQueryType),
      description: 'Fetch all profiles',
      resolve: async (_, __, context) => {
        const { prisma } = context;
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileQueryType,
      description: 'Fetch profile by id',
      args: { id: { type: UUIDType } },
      resolve: async (_, args, context) => {
        const { prisma } = context;
        return prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
const schema = new GraphQLSchema({ query: RootQuery });
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {},
    },
    async handler(req) {
      try {
        const result = await graphql({
          schema,
          source: req.body.query,
          variableValues: req.body.variables,
          contextValue: { prisma },
        });

        return result;
      } catch (error) {
        console.error(error);
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
