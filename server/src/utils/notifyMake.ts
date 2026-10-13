import config from '../config';
import { IProjectRequest, RequestPriority, RequestStatus } from '../models/ProjectRequest';

export type MakeEvent = 'request.created' | 'request.decided';

interface PersonSummary {
  name: string;
  email: string;
}

const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'ממתינה לאישור',
  approved: 'מאושרת',
  rejected: 'נדחתה',
  'in-progress': 'בביצוע',
  completed: 'הושלמה',
};

const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
};

const NOTIFY_TIMEOUT_MS = 3000;

const currency = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

if (!config.makeWebhookUrl) {
  console.log('MAKE_WEBHOOK_URL is not set; automation notifications are disabled.');
}

function toPerson(value: unknown): PersonSummary | null {
  if (!value || typeof value !== 'object') return null;
  const { name, email } = value as Partial<PersonSummary>;
  return typeof name === 'string' && typeof email === 'string' ? { name, email } : null;
}

/** Flat, mail-ready payload so the Make scenario can map fields without extra formatting steps. */
function buildPayload(event: MakeEvent, request: IProjectRequest) {
  const id = request._id.toString();
  const populated = request as IProjectRequest & { requester?: unknown; approver?: unknown };
  return {
    event,
    sentAt: new Date().toISOString(),
    request: {
      id,
      url: `${config.clientOrigin}/requests/${id}`,
      title: request.title,
      description: request.description,
      department: request.department,
      budget: request.budget,
      budgetFormatted: currency.format(request.budget),
      startDate: dateFormat.format(request.startDate),
      endDate: dateFormat.format(request.endDate),
      priority: request.priority,
      priorityLabel: PRIORITY_LABELS[request.priority],
      status: request.status,
      statusLabel: STATUS_LABELS[request.status],
      decisionNote: request.decisionNote,
    },
    requester: toPerson(populated.requester),
    approver: toPerson(populated.approver),
  };
}

/**
 * Posts a request event to the Make webhook. Never throws: a failing or slow automation must not
 * fail the API call. It is awaited (with a short timeout) because serverless functions may be
 * frozen as soon as the response is sent, which would drop a truly fire-and-forget request.
 */
export async function notifyMake(event: MakeEvent, request: IProjectRequest): Promise<void> {
  if (!config.makeWebhookUrl) return;

  try {
    const response = await fetch(config.makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(event, request)),
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`Make webhook responded ${response.status} for ${event} (${request._id.toString()})`);
    }
  } catch (err) {
    console.error(`Make webhook failed for ${event} (${request._id.toString()}):`, err instanceof Error ? err.message : err);
  }
}

export default notifyMake;
