import { Request, Response } from "express";
import { sendErrorResponse } from "./errorHandler";
import { validateRequest } from "./paramValidators";
import { Temporal } from "@js-temporal/polyfill";
import { ValidationResult, SuccessResponse, ValidatedParams } from "../types/types";
import { calculateWorkingDate } from "./calculateWorkingValidDates"; // Asegúrate de tener esta función implementada

export async function handleCalculate(req: Request, res: Response): Promise<void> {
	const validation: ValidationResult = validateRequest(req);

	if (!validation.isValid && validation.statusCode && validation.errorType) {
		sendErrorResponse(res, validation.statusCode, validation.errorType);
		return;
	}

	try {
		const params: ValidatedParams = {
			days: req.query["days"] ? Number(req.query["days"]) : 0,
			hours: req.query["hours"] ? Number(req.query["hours"]) : 0,
			startDate: (req.query["date"] as string | undefined)
				? (req.query["date"] as string | undefined)
				: undefined
		};

		const days: number = params.days;
		const hours: number = params.hours;
		const startDate: string | undefined = params.startDate;

		const result: Temporal.ZonedDateTime | undefined = await calculateWorkingDate(
			startDate,
			days,
			hours
		);

		// Respuesta de ejemplo (reemplazar con tu cálculo real)
		const response: SuccessResponse = {
			date: result ? result.toString() : "Invalid date"
		};

		res.status(200).json(response);
	} catch (error) {
		console.error("Error calculating date:", error);
		sendErrorResponse(res, 500, "InternalError");
	}
}
