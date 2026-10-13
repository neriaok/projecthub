import type { FC } from 'react';
import { Badge } from '@fluentui/react-components';
import type { BadgeProps } from '@fluentui/react-components';
import type { RequestStatus } from '../../types/models';
import { STATUS_LABELS } from '../../utils/labels';

interface StatusBadgeProps {
  status: RequestStatus;
}

const STATUS_COLORS: Record<RequestStatus, BadgeProps['color']> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  'in-progress': 'brand',
  completed: 'informative',
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <Badge appearance="tint" color={STATUS_COLORS[status]} shape="rounded">
    {STATUS_LABELS[status]}
  </Badge>
);

export default StatusBadge;
