const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user);
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new Error("user not found");
    },
  },
  Mutation: {
    login: async (parent, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("user not found");
      }
      const isCorrectPassword = await user.isCorrectPassword(args.password);
      console.log(!isCorrectPassword);
      if (!isCorrectPassword) {
        throw new Error("incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { newBook }, context) => {
      console.log("save book");
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: newBook } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error("user not found");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error("user not found");
    },
  },
};

module.exports = resolvers;
