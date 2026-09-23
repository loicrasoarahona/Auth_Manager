import sequelize from "./database.js";
import { Role } from "../models/role.model.js";

export async function initDB() {
  await sequelize.authenticate();
  console.log("Connexion PostgreSQL OK");

  await sequelize.sync({ alter: true });
}

export async function insertInitialData() {
  await Role.bulkCreate(
    [{ name: "admin" }, { name: "enseignant" }, { name: "surveillant" }],
    { ignoreDuplicates: true },
  );
}
