import { Response } from "express";
import { responseQuery } from "../types/types";

const errorType: Record<number, Record<string, string>> = {
	400: {
		InvalidParameters: "Se debe proporcionar al menos uno de los parámetros: days o hours",
		InvalidValues: "Los parámetros days y hours deben ser enteros positivos",
		InvalidDateFormat: "El parámetro date debe estar en formato ISO 8601 con sufijo Z"
	},
	404: {
		NotFound: "Ruta no encontrada"
	},
	500: {
		InternalError: "Error interno del servidor",
		CalculationError: "Error al calcular la fecha resultante"
	},
	503: {
		ServiceUnavailable: "No se pudieron cargar los días festivos"
	}
};

export function getError(code: number, type: string): responseQuery {
	return {
		error: type,
		message: errorType[code]?.[type] ?? "Error desconocido"
	};
}

export function sendErrorResponse(res: Response, statusCode: number, errorType: string): void {
	const error: responseQuery = getError(statusCode, errorType);
	res.status(statusCode).json(error);
}
