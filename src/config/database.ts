import { Sequelize } from "sequelize";
import "./env.js";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "auth_manager",
  process.env.DB_USER ?? "postgres",
  process.env.DB_PASSWORD ?? "anjomakely",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    dialect: "postgres",
    logging: false,
  },
);

export default sequelize;
