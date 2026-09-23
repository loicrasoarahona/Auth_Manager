import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import type { UserRoleAttributes } from "../types/interfaces.js";

export class UserRole extends Model<UserRoleAttributes> {}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "user_role",
    timestamps: false,
    indexes: [{ unique: true, fields: ["user_id", "role_id"] }],
  },
);
