import { useMemo } from 'react';
import type { FC } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RectangleProps } from 'recharts';
import type { DepartmentBudget } from '../../features/dashboard/dashboardApi';
import { BUDGET_SERIES_COLORS, CHART_GRID, CHART_SURFACE, CHART_TEXT_SECONDARY } from '../../utils/chartColors';
import { formatCompactCurrency, formatCurrency } from '../../utils/format';
import styles from './BudgetChart.module.css';

interface BudgetChartProps {
  data: DepartmentBudget[];
}

interface ChartRow extends DepartmentBudget {
  total: number;
  /** The total is labeled on whichever segment ends the bar. */
  approvedLabel: number | null;
  pendingLabel: number | null;
}

interface BudgetTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: ChartRow }>;
}

const BudgetTooltip: FC<BudgetTooltipProps> = ({ active, payload }) => {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className={styles.tooltip} dir="rtl">
      <span className={styles.tooltipTitle}>{row.department}</span>
      <span className={styles.tooltipRow}>
        <span className={styles.swatch} style={{ background: BUDGET_SERIES_COLORS.approved }} />
        מאושר
        <strong>{formatCurrency(row.approvedBudget)}</strong>
      </span>
      <span className={styles.tooltipRow}>
        <span className={styles.swatch} style={{ background: BUDGET_SERIES_COLORS.pending }} />
        ממתין לאישור
        <strong>{formatCurrency(row.pendingBudget)}</strong>
      </span>
      <span className={styles.tooltipMeta}>{row.requests} בקשות במחלקה</span>
    </div>
  );
};

const formatLabel = (value: unknown) => (value == null ? '' : formatCompactCurrency(Number(value)));

/** The approved segment is the bar's end only when nothing is pending, so only then is it rounded. */
const renderApprovedBar = (props: unknown) => {
  const shapeProps = props as RectangleProps & { payload: ChartRow };
  return <Rectangle {...shapeProps} radius={shapeProps.payload.pendingBudget > 0 ? 0 : [4, 0, 0, 4]} />;
};

/** Stacked horizontal bars: approved vs pending budget per department, growing from the right in RTL. */
const BudgetChart: FC<BudgetChartProps> = ({ data }) => {
  const rows = useMemo<ChartRow[]>(
    () =>
      data
        .map((row) => {
          const total = row.approvedBudget + row.pendingBudget;
          return {
            ...row,
            total,
            approvedLabel: row.pendingBudget > 0 ? null : total,
            pendingLabel: row.pendingBudget > 0 ? total : null,
          };
        })
        .filter((row) => row.total > 0)
        .sort((a, b) => b.total - a.total),
    [data],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: BUDGET_SERIES_COLORS.approved }} />
          תקציב מאושר
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: BUDGET_SERIES_COLORS.pending }} />
          ממתין לאישור
        </span>
      </div>
      <div className={styles.chart} dir="ltr">
        <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 52)}>
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 64 }} barSize={20}>
            <CartesianGrid horizontal={false} stroke={CHART_GRID} />
            <XAxis
              type="number"
              reversed
              tickFormatter={formatCompactCurrency}
              tick={{ fill: CHART_TEXT_SECONDARY, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="department"
              orientation="right"
              width={110}
              tick={{ fill: '#1f2a3d', fontSize: 14, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BudgetTooltip />} cursor={{ fill: 'rgba(31, 99, 184, 0.06)' }} />
            <Bar
              dataKey="approvedBudget"
              stackId="budget"
              fill={BUDGET_SERIES_COLORS.approved}
              stroke={CHART_SURFACE}
              strokeWidth={2}
              shape={renderApprovedBar}
            >
              <LabelList
                dataKey="approvedLabel"
                position="right"
                formatter={formatLabel}
                fill="#1f2a3d"
                fontSize={13}
                fontWeight={700}
              />
            </Bar>
            <Bar
              dataKey="pendingBudget"
              stackId="budget"
              fill={BUDGET_SERIES_COLORS.pending}
              stroke={CHART_SURFACE}
              strokeWidth={2}
              radius={[4, 0, 0, 4]}
            >
              <LabelList
                dataKey="pendingLabel"
                position="right"
                formatter={formatLabel}
                fill="#1f2a3d"
                fontSize={13}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetChart;
