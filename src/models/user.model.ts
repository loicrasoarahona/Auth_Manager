import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
import type { UserAttributes } from "../types/interfaces.js";
import type { Role } from "./role.model.js";

export class User extends Model<UserAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string;
  declare surname: string;
  declare roles?: Role[];

  comparePassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    timestamps: false,
    hooks: {
      async beforeSave(user) {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);
