import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import type { RoleAttributes } from "../types/interfaces.js";

export class Role extends Model<RoleAttributes> {
  declare id: number;
  declare name: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "role",
    timestamps: false,
  },
);
