import { Request } from "express";
import { isInteger, isPositive, validDate } from "./utils";
import { ValidationResult, QueryParams } from "../types/types";

function validateQueryNotEmpty(query: QueryParams): ValidationResult {
	if (Object.keys(query).length === 0) {
		return {
			isValid: false,
			statusCode: 400,
			errorType: "InvalidParameters"
		};
	}
	return { isValid: true };
}

function validateRequiredParams(query: QueryParams): ValidationResult {
	if (!query.hours && !query.days) {
		return {
			isValid: false,
			statusCode: 400,
			errorType: "InvalidParameters"
		};
	}
	return { isValid: true };
}

function validateDateFormat(query: QueryParams): ValidationResult {
	if (query.date && !validDate(query.date)) {
		return {
			isValid: false,
			statusCode: 400,
			errorType: "InvalidDateFormat"
		};
	}
	return { isValid: true };
}

function validateDaysParam(query: QueryParams): ValidationResult {
	if (query.days !== undefined) {
		if (query.days === "0") {
			if (!query.hours || query.hours === "0") {
				return {
					isValid: false,
					statusCode: 400,
					errorType: "InvalidValues"
				};
			}
			if (query.hours && (!isInteger(query.hours) || !isPositive(query.hours))) {
				return {
					isValid: false,
					statusCode: 400,
					errorType: "InvalidValues"
				};
			}
			return { isValid: true };
		}

		if (!isInteger(query.days) || !isPositive(query.days)) {
			return {
				isValid: false,
				statusCode: 400,
				errorType: "InvalidValues"
			};
		}
	}
	return { isValid: true };
}

function validateHoursParam(query: QueryParams): ValidationResult {
	if (query.hours !== undefined) {
		if (query.hours === "0") {
			if (!query.days || query.days === "0") {
				return {
					isValid: false,
					statusCode: 400,
					errorType: "InvalidValues"
				};
			}
			return { isValid: true };
		}

		if (!isInteger(query.hours) || !isPositive(query.hours)) {
			return {
				isValid: false,
				statusCode: 400,
				errorType: "InvalidValues"
			};
		}
	}
	return { isValid: true };
}

export function validateRequest(req: Request): ValidationResult {
	const query: QueryParams = req.query as QueryParams;

	const validators: Array<(q: QueryParams) => ValidationResult> = [
		validateQueryNotEmpty,
		validateRequiredParams,
		validateDateFormat,
		validateDaysParam,
		validateHoursParam
	];

	for (const validator of validators) {
		const result: ValidationResult = validator(query);
		if (!result.isValid) {
			return result;
		}
	}

	return { isValid: true };
}
