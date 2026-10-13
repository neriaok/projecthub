import { useMemo } from 'react';
import type { FC } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RequestStatus } from '../../types/models';
import { CHART_SURFACE, STATUS_COLORS, STATUS_ORDER } from '../../utils/chartColors';
import { STATUS_LABELS } from '../../utils/labels';
import styles from './StatusDonut.module.css';

interface StatusDonutProps {
  counts: Record<RequestStatus, number>;
}

interface Slice {
  status: RequestStatus;
  label: string;
  value: number;
  share: number;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Slice }>;
}

const formatShare = (share: number) => `${Math.round(share * 100)}%`;

const DonutTooltip: FC<DonutTooltipProps> = ({ active, payload }) => {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;
  return (
    <div className={styles.tooltip} dir="rtl">
      <span className={styles.swatch} style={{ background: STATUS_COLORS[slice.status] }} />
      <span>{slice.label}</span>
      <strong>
        {slice.value} · {formatShare(slice.share)}
      </strong>
    </div>
  );
};

/** Requests by status. The legend doubles as the data table, so color is never the only cue. */
const StatusDonut: FC<StatusDonutProps> = ({ counts }) => {
  const { slices, total } = useMemo(() => {
    const sum = STATUS_ORDER.reduce((acc, status) => acc + counts[status], 0);
    return {
      total: sum,
      slices: STATUS_ORDER.map((status) => ({
        status,
        label: STATUS_LABELS[status],
        value: counts[status],
        share: sum ? counts[status] / sum : 0,
      })),
    };
  }, [counts]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.chart} dir="ltr">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={slices.filter((slice) => slice.value > 0)}
              dataKey="value"
              nameKey="label"
              innerRadius={66}
              outerRadius={98}
              startAngle={90}
              endAngle={-270}
              stroke={CHART_SURFACE}
              strokeWidth={2}
              isAnimationActive
            >
              {slices
                .filter((slice) => slice.value > 0)
                .map((slice) => (
                  <Cell key={slice.status} fill={STATUS_COLORS[slice.status]} />
                ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.center}>
          <span className={styles.total}>{total}</span>
          <span className={styles.totalLabel}>בקשות</span>
        </div>
      </div>

      <ul className={styles.legend}>
        {slices.map((slice) => (
          <li key={slice.status} className={styles.legendRow}>
            <span className={styles.swatch} style={{ background: STATUS_COLORS[slice.status] }} />
            <span className={styles.legendLabel}>{slice.label}</span>
            <span className={styles.legendValue}>{slice.value}</span>
            <span className={styles.legendShare}>{formatShare(slice.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusDonut;
