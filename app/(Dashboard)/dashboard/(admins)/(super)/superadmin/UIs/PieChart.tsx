'use client'

import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, Sector } from 'recharts';

// #region Sample data
const data = [
  { name: 'Approved', value: 1248 },
  { name: 'Rejected', value: 218 },
  { name: 'Pending', value: 534 },
];

// #endregion
const RADIAN = Math.PI / 180;
const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function PieChartWithCustomizedLabel({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  return (
    <>
    <PieChart style={{ width: '80%', maxWidth: '400px', maxHeight: '70vh', aspectRatio: 1 }} responsive>
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
    </PieChart>
    <div>
        <ul className="flex flex-col gap-2 mt-4">
            {data.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center gap-2">
                    <div style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-3 h-3 rounded-full" />
                    <span className="text-sm text-gray-700">{entry.name}</span>
                    <span className="text-base">({entry.value} Claims)</span>
                </li>
            ))}
        </ul>
    </div>
    </>
  );
}