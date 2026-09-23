import dotenv from "dotenv";

// Loaded first of all (side effect): the modules imported afterwards
// (database.ts, JWT, TURN...) read process.env at import time.
dotenv.config();
