const user = (sequalize, DataTypes) => {
  const User = sequalize.define("user", {
    name: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Car, { onDelete: "CASCADE" }); //delete user and it's car associations
  };

  return User;
};

module.exports = user;
