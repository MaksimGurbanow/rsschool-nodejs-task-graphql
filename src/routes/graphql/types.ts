import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
    author: {
      type: UserType,
      resolve: async (src, _, ctx) =>
        await ctx.prisma.user.findUnique({ where: { id: src.authorId } }),
    },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(UUIDType) },
    user: {
      type: UserType,
      description: 'The user associated with this profile.',
    },
    memberTypeId: { type: MemberTypeIdEnum },
    memberType: {
      type: MemberTypeType,
      resolve: async (src, _, ctx) =>
        await ctx.prisma.memberType.findUnique({ where: { id: src.memberTypeId } }),
    },
  }),
});

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'type of member',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (src, _, ctx) =>
        await ctx.prisma.profile.findMany({ where: { memberTypeId: src.id } }),
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: { type: new GraphQLList(PostType) },
    profile: {
      type: ProfileType,
      description: 'User profile',
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, _, ctx) => ctx.fetchSubscriptionsToUser.load(user.id),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (user, _, ctx) => ctx.fetchUserSubscriptions.load(user.id),
    },
  }),
});

export { UserType, ProfileType, MemberTypeType, PostType };
