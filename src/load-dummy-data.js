import { sequalize } from "./models/database";
import models from "./models/index";

const createData = async () => {
  await models.User.create(
    {
      name: "Iulia",
      cars: [
        { brand: "Audi", color: "red" },
        { brand: "Lambourghini", color: "yellow" },
      ],
    },
    {
      include: [models.Car],
    }
  );

  await models.User.create(
    { name: "Vlad", cars: [{ brand: "Volvo", color: "silver" }] },
    {
      include: [models.Car],
    }
  );

  await models.User.create({ name: "Coco" });
};

sequalize.sync().then(async () => {
  try {
    await createData();
    process.exit;
  } catch (error) {
    console.error(error);
  }
});
