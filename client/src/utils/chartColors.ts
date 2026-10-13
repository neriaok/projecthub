import type { RequestStatus } from '../types/models';

/** Validated categorical slots (adjacent CVD ΔE ≥ 9). Text never uses these colors. */
export const BUDGET_SERIES_COLORS = {
  approved: '#2a78d6',
  pending: '#eb6834',
} as const;

/** Status hues in donut order: pending → approved → in progress → completed → rejected. */
export const STATUS_COLORS: Record<RequestStatus, string> = {
  pending: '#eda100',
  approved: '#1baf7a',
  'in-progress': '#2a78d6',
  completed: '#4a3aa7',
  rejected: '#e34948',
};

export const STATUS_ORDER: RequestStatus[] = ['pending', 'approved', 'in-progress', 'completed', 'rejected'];

export const CHART_SURFACE = '#ffffff';
export const CHART_GRID = '#e6eaf0';
export const CHART_TEXT_SECONDARY = '#5b6475';
