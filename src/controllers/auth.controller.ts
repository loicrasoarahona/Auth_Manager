import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { UserRole } from "../models/userRole.model.js";
import { signToken } from "../config/jwt.js";

const ASSIGNABLE_ROLES = ["enseignant", "surveillant"] as const;

export async function register(req: Request, res: Response) {
  const { email, password, name, surname, role } = req.body;
  if (!email || !password || !name || !surname || !role) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({
      message: `Le champ role doit être l'un des suivants : ${ASSIGNABLE_ROLES.join(", ")}`,
    });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Cet email est déjà utilisé" });
  }

  const targetRole = await Role.findOne({ where: { name: role } });
  if (!targetRole) {
    return res.status(500).json({ message: "Rôle introuvable en base" });
  }

  const user = await User.create({ email, password, name, surname });
  await UserRole.create({ user_id: user.id, role_id: targetRole.id });

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
    role: targetRole.name,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  const user = await User.findOne({
    where: { email },
    include: { model: Role, as: "roles" },
  });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const roles = (user.roles ?? []).map((role) => role.name);
  const token = signToken({ sub: user.id, email: user.email, roles });

  return res.json({ token });
}

export async function me(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.sub, {
    attributes: { exclude: ["password"] },
    include: { model: Role, as: "roles" },
  });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  return res.json(user);
}
