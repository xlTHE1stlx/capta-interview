import { Request, Response } from "express";
import app from "./app";
import "dotenv/config";

const PORT: string | number = process.env["PORT"] || 3000;

app.get("/", (_req: Request, res: Response): void => {
	res.send("API activa 🚀");
});

app.listen(PORT, (): void => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
