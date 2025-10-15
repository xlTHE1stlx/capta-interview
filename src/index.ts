import { Request, Response } from "express";
import app from "./app";
import "dotenv/config";

app.get("/", (_req: Request, res: Response): void => {
	res.json({ message: "API activa 🚀" });
});

export default app;
