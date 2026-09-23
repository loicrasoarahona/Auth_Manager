import express from "express";
import cors from "cors";
import { initDB, insertInitialData } from "./config/init.js";
import "./config/env.js";
import { setupRelations } from "./models/setupRelations.js";
import AuthRoute from "./routes/auth.route.js";

async function main() {
  try {
    const PORT = process.env.PORT || 3000;
    const app = express();
    app.use(cors());
    app.use(express.json());

    setupRelations();
    await initDB();
    await insertInitialData();

    app.get("/", (req, res) => {
      res.json({
        message: "API OK",
      });
    });

    app.get("/hello", (req, res) => {
      res.send("Hello, world !!");
    });

    app.use("/auth", AuthRoute);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
