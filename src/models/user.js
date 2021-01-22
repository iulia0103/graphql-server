import bcrypt from "bcrypt";

const user = (sequalize, DataTypes) => {
  const User = sequalize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 128],
      },
    },
    photo: { type: DataTypes.STRING },
  });

  User.prototype.hashPassword = async function () {
    return await bcrypt.hash(this.password, 10);
  };

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Car, { onDelete: "CASCADE" }); //delete user and it's car associations
  };

  User.beforeCreate(async (user) => {
    user.password = await user.hashPassword(user.password);
  });

  return User;
};

export default user;
