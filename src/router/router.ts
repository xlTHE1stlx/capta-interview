import { Router } from "express";
import { handleCalculate} from "../controller/controller"

export const router: Router = Router();
router.get("/api/", handleCalculate);


export default router;