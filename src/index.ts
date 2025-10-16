import { Request, Response } from "express";
import app from "./app";
import "dotenv/config";

// const PORT: number = parseInt(process.env["PORT"] as string, 10) || 3000;

app.get("/", (_req: Request, res: Response): void => {
	res.json({ message: "API activa 🚀" });
});

// app.listen(PORT, (): void => {
// 	console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

export default app;
