import { GraphQLFloat, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../types/uuid.js";

const UserQueryType = new GraphQLObjectType({
    name: "user",
    description: "User type",
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat }
    })
})

export { UserQueryType }
