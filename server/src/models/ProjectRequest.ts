import { Schema, model, Document, Types } from 'mongoose';

export const REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'in-progress', 'completed'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_PRIORITIES = ['low', 'medium', 'high'] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export interface IProjectRequest extends Document<Types.ObjectId> {
  title: string;
  description: string;
  department: string;
  requesterId: Types.ObjectId;
  approverId: Types.ObjectId | null;
  budget: number;
  startDate: Date;
  endDate: Date;
  priority: RequestPriority;
  status: RequestStatus;
  decisionNote: string;
  decidedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const projectRequestSchema = new Schema<IProjectRequest>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', trim: true, maxlength: 4000 },
    department: { type: String, required: true, trim: true },
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    approverId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    budget: {
      type: Number,
      required: true,
      validate: { validator: (value: number) => value > 0, message: 'Budget must be greater than 0' },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, enum: REQUEST_PRIORITIES, required: true, default: 'medium' },
    status: { type: String, enum: REQUEST_STATUSES, required: true, default: 'pending', index: true },
    decisionNote: { type: String, default: '', trim: true, maxlength: 1000 },
    decidedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

projectRequestSchema.pre('validate', function () {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date', this.endDate);
  }
});

export const ProjectRequest = model<IProjectRequest>('ProjectRequest', projectRequestSchema);

export default ProjectRequest;
