import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../types/ApiResponse';

interface HealthStatus {
  status: 'ok';
  database: 'connected' | 'disconnected';
  uptime: number;
}

export async function getHealth(_req: Request, res: Response<ApiResponse<HealthStatus>>) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: Math.round(process.uptime()),
    },
  });
}
