import "dotenv/config";
import { sequalize } from "../models/database";
import models from "../models/index";
import faker from "faker/locale/en";

const createData = async () => {
  await models.User.create(
    {
      name: "Iulia",
      cars: [
        { brand: "Audi", color: "red" },
        { brand: "Lambourghini", color: "yellow" },
      ],
      username: faker.unique(faker.internet.email, [null, null, "iulia.com"]),
      password: faker.internet.password(16),
    },
    {
      include: [models.Car],
    }
  );

  await models.User.create(
    {
      name: "Vlad",
      cars: [{ brand: "Volvo", color: "silver" }],
      username: faker.unique(faker.internet.email, [null, null, "vlad.com"]),
      password: faker.internet.password(16),
    },
    {
      include: [models.Car],
    }
  );

  await models.User.create({
    name: "Coco",
    username: faker.unique(faker.internet.email, [null, null, "coco.com"]),
    password: faker.internet.password(16),
  });
};

sequalize.sync({ force: true }).then(async () => {
  try {
    await createData();
    process.exit;
  } catch (error) {
    console.error(error);
  }
});
