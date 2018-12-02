const grapql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = grapql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    id: {type: GraphQLID},
    email: {type: GraphQLString},
  }
});

module.exports = UserType;