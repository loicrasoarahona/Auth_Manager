import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { UserRole } from "./userRole.model.js";

export function setupRelations() {
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles",
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users",
  });

  User.hasMany(UserRole, { foreignKey: "user_id", as: "userRoles" });
  UserRole.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Role.hasMany(UserRole, { foreignKey: "role_id", as: "userRoles" });
  UserRole.belongsTo(Role, { foreignKey: "role_id", as: "role" });
}
