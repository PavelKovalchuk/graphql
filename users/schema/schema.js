const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

// fake data
const users = [
    {id: '23', firstName: 'Bill', age: 33},
    {id: '47', firstName: 'Samantha', age: 22},
    {id: '44', firstName: 'Jon', age: 23},
];

// Type of data (properties)
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
          type: UserType,
          args: {id: {type: GraphQLString}},
          resolve(parentValue, args) {
              return _.find(users, {id: args.id});
          },
      }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});