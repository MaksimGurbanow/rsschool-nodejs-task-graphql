import { GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const MemberTypeQueryType = new GraphQLObjectType({
  name: 'memberType',
  description: 'type of member',
  fields: () => ({
    id: { type: UUIDType },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export { MemberTypeQueryType };
