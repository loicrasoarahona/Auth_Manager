import sequelize from "./database.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { UserRole } from "../models/userRole.model.js";

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

  const adminEmail = "auptitprecoolify@gmail.com";
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const password = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!password) {
      throw new Error(
        "ADMIN_DEFAULT_PASSWORD doit être défini dans .env pour créer le compte admin initial.",
      );
    }
    admin = await User.create({
      email: adminEmail,
      password,
      name: "Rindra",
      surname: "Ramahefa",
    });
  }

  const adminRole = await Role.findOne({ where: { name: "admin" } });
  if (adminRole) {
    await UserRole.findOrCreate({
      where: { user_id: admin.id, role_id: adminRole.id },
    });
  }
}
