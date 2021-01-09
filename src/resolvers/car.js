const resolvers = {
  Query: {
    cars: (_, args, { models }) => models.Car.findAll(),
    car: (_, { id }, { models }) => models.Car.findByPk(id),
  },
  Mutation: {
    createCar: (_, { brand, color }, { models, me }) => {
      if (!me) {
        throw new Error("Not authenticated!");
      }

      const car = { brand, color, userId: me.id };

      return models.Car.create(car);
    },
    removeCar: (_, { id }, { models }) => {
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
