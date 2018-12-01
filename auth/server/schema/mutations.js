const grapql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
} = grapql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString},
      },
      resolve(parentValue, args, request) {
        return AuthService.signup({
          email: args.email,
          password: args.password,
          req: request,
        });
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, request) {
        const {user} = request;
        request.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString},
      },
      resolve(parentValue, {email, password}, request) {
        return AuthService.login({email, password, req: request});
      }
    }
  },
});

module.exports = mutation;