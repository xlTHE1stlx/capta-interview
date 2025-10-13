import { Request, Response } from 'express';
import { validateRequest } from './paramValidators';
import { sendErrorResponse } from './errorHandler';
import { ValidationResult, SuccessResponse } from '../types/types';

export async function handleCalculate(req: Request, res: Response): Promise<void> {
  const validation: ValidationResult = validateRequest(req);
  
  if (!validation.isValid && validation.statusCode && validation.errorType) {
    sendErrorResponse(res, validation.statusCode, validation.errorType);
    return;
  }
  
  try {
    // TODO: Aquí va tu lógica de cálculo de fechas hábiles
    // Ejemplo de cómo obtener los parámetros validados:
    const days: number = req.query["days"] ? Number(req.query["days"]) : 0;
    const hours: number = req.query["hours"] ? Number(req.query["hours"]) : 0;
    const startDate: string | undefined = req.query["date"] as string | undefined;

    // const result = await calculateWorkingDate(startDate, days, hours);
    console.log({ days, hours, startDate });
    
    // Respuesta de ejemplo (reemplazar con tu cálculo real)
    const response: SuccessResponse = {
      date: "2025-01-13T14:00:00.000Z"
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error calculating date:', error);
    sendErrorResponse(res, 500, 'InternalError');
  }
}