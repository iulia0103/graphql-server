const resolvers = {
  Query: {
    cars: (_, args, { models }) => models.Car.findAll(),
    car: (_, { id }, { models }) => models.Car.findByPk(id),
  },
  Mutation: {
    createCar: (_, { brand, color }, { models, authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Not authenticated!");
      }

      const car = { brand, color, userId: authenticatedUser.id };

      return models.Car.create(car);
    },
    removeCar: (_, { id }, { models, authenticatedUser }) => {
      if (!authenticatedUser) {
        throw new Error("Not authenticated!");
      }

      return models.Car.destroy({ where: { id } });
    },
  },
  Car: {
    owner: (parent, _, { models }) => {
      return models.User.findByPk(parent.userId);
    },
  },
};

export default resolvers;
