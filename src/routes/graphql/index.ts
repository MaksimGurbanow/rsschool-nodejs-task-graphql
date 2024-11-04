import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, parse, validate } from 'graphql';
import { UserResolverObject } from './user/resolver.js';
import { ProfileResolverObject } from './profile/resolver.js';
import depthLimit from 'graphql-depth-limit';
import { MemberTypeResolverObject } from './memberType/resolver.js';
import { initializeDataLoaders } from './dataLoaders.js';
import { PostResolverObject } from './post/resolver.js';

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...UserResolverObject,
    ...ProfileResolverObject,
    ...MemberTypeResolverObject,
    ...PostResolverObject,
  },
});
const schema = new GraphQLSchema({ query: RootQuery });
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const depthFiveDepthError = validate(schema, parse(query), [depthLimit(5)]);

      if (depthFiveDepthError.length) {
        return { data: null, errors: depthFiveDepthError };
      }
      const { prisma } = fastify;
      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, ...initializeDataLoaders(prisma) },
      });
    },
  });
};

export default plugin;
