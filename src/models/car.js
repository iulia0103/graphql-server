const car = (sequalize, DataTypes) => {
  const Car = sequalize.define("car", {
    brand: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
  });

  Car.associate = (models) => {
    Car.belongsTo(models.User);
  };

  return Car;
};

export default car;
