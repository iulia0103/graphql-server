const resolvers = {
  Query: {
    users: (_, args, { models }) => models.User.findAll(),
    user: (_, { id }, { models }) => models.User.findByPk(id),
    // me: (_, args, { me }) => me,
  },
  Mutation: {
    makeUser: (_, { name }, { models }) => {
      const user = { name };
      return models.User.create(user);
    },
    removeUser: (_, { id }, { models }) => {
      return models.User.destroy({ where: { id } });
    },
  },

  User: {
    cars: (parent, _, { models }) => {
      return models.Car.findAll({ where: { userId: parent.id } });
    },
  },
};

module.exports = resolvers;
