import { Schema, model, Document, Types } from 'mongoose';

export const USER_ROLES = ['employee', 'manager', 'pmo'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  managerId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, required: true, default: 'employee' },
    department: { type: String, required: true, trim: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const User = model<IUser>('User', userSchema);

export default User;
