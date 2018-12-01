const grapql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
} = grapql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    email: {type: GraphQLString}
  }
});

module.exports = UserType;