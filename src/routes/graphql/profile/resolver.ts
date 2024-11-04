import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, ThunkObjMap } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../types.js';

const ProfileResolverObject: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {
  profiles: {
    type: new GraphQLList(ProfileType),
    description: 'Fetch all profiles',
    resolve: async (_, __, ctx) =>
      await ctx.prisma.profile.findMany({ include: { memberType: true, user: true } }),
  },
  profile: {
    type: ProfileType,
    description: 'Fetch profile by id',
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_, args, ctx) =>
      await ctx.prisma.profile.findUnique({
        where: { id: args.id },
        include: { memberType: true, user: true },
      }),
  },
};

export { ProfileResolverObject };
