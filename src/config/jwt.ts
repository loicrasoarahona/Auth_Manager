import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import jwt, { type SignOptions } from "jsonwebtoken";
import "./env.js";

const PRIVATE_KEY_PATH =
  process.env.JWT_PRIVATE_KEY_PATH ?? "keys/private.key";
const PUBLIC_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH ?? "keys/public.key";
const ALGORITHM = "RS256";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

function loadOrGenerateKeyPair(): { privateKey: string; publicKey: string } {
  if (existsSync(PRIVATE_KEY_PATH) && existsSync(PUBLIC_KEY_PATH)) {
    return {
      privateKey: readFileSync(PRIVATE_KEY_PATH, "utf8"),
      publicKey: readFileSync(PUBLIC_KEY_PATH, "utf8"),
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Clés JWT introuvables (${PRIVATE_KEY_PATH} / ${PUBLIC_KEY_PATH}). ` +
        "Générez-les au préalable, elles ne sont pas créées automatiquement en production.",
    );
  }

  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });

  mkdirSync(dirname(PRIVATE_KEY_PATH), { recursive: true });
  mkdirSync(dirname(PUBLIC_KEY_PATH), { recursive: true });
  writeFileSync(PRIVATE_KEY_PATH, privateKey);
  writeFileSync(PUBLIC_KEY_PATH, publicKey);
  console.warn(
    `Aucune paire de clés JWT trouvée : une nouvelle paire a été générée dans ${dirname(PRIVATE_KEY_PATH)}/ (usage développement uniquement).`,
  );

  return { privateKey, publicKey };
}

const { privateKey, publicKey } = loadOrGenerateKeyPair();

export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
}

export function signToken(
  payload: JwtPayload,
  options: SignOptions = {},
): string {
  return jwt.sign(payload, privateKey, {
    algorithm: ALGORITHM,
    expiresIn: EXPIRES_IN,
    ...options,
  } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, publicKey, {
    algorithms: [ALGORITHM],
  }) as unknown as JwtPayload;
}
