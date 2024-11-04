import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull, ThunkObjMap } from 'graphql';
import { MemberTypeIdEnum, MemberTypeType } from '../types.js';

const MemberTypeResolverObject: ThunkObjMap<GraphQLFieldConfig<any, any, any>> = {
  memberTypes: {
    type: new GraphQLList(MemberTypeType),
    description: 'Fetch all member types',
    resolve: async (_, __, context) => {
      const { prisma } = context;
      return prisma.memberType.findMany({ include: { profiles: true } });
    },
  },
  memberType: {
    type: MemberTypeType,
    description: 'Fetch profile by id',
    args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
    resolve: async (_, args, context) => {
      const { prisma } = context;
      return prisma.memberType.findUnique({
        where: { id: args.id },
        include: { profiles: true },
      });
    },
  },
};

export { MemberTypeResolverObject };
