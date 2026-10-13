import type { FC } from 'react';
import { Badge } from '@fluentui/react-components';
import type { BadgeProps } from '@fluentui/react-components';
import type { RequestPriority } from '../../types/models';
import { PRIORITY_LABELS } from '../../utils/labels';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

const PRIORITY_COLORS: Record<RequestPriority, BadgeProps['color']> = {
  low: 'informative',
  medium: 'warning',
  high: 'danger',
};

const PriorityBadge: FC<PriorityBadgeProps> = ({ priority }) => (
  <Badge appearance="outline" color={PRIORITY_COLORS[priority]} shape="circular">
    {PRIORITY_LABELS[priority]}
  </Badge>
);

export default PriorityBadge;
