'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipContentProps,
  TooltipIndex,
} from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Jan',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Feb',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Mar',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Apr',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'May',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'June',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Jul',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Sep',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Oct',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Nov',
    uv: 0,
    Data: 0,
    amt: 0,
  },
  {
    name: 'Dec',
    uv: 0,
    Data: 0,
    amt: 0,
  },
];

// #endregion
const getIntroOfPage = (label: string | number | undefined) => {
  if (label === 'Jan') {
    return "Jan Revenue";
  }
  if (label === 'Feb') {
    return "Feb Revenue";
  }
  if (label === 'Mar') {
    return "Mar Revenue";
  }
  if (label === 'Apr') {
    return 'Apr Revenue';
  }
  if (label === 'May') {
    return 'May Revenue';
  }
  if (label === 'June') {
    return 'June Revenue';
  }
  if (label === 'July') {
    return 'July Revenue';
  }
  if (label === 'Aug') {
    return 'Aug Revenue';
  }
  if (label === 'Sep') {
    return 'Sep Revenue';
  }
  if (label === 'Oct') {
    return 'Oct Revenue';
  }
  if (label === 'Nov') {
    return 'Nov Revenue';
  }
  if (label === 'Dec') {
    return 'Dec Revenue';
  }
  return '';
};

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const isVisible = active && payload && payload.length;
  return (
    <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <>
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
        </>
      )}
    </div>
  );
};

const BarChartView = ({
  isAnimationActive,
  defaultIndex,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) => {
  return (
    <BarChart
      style={{ width: '90%', maxWidth: '90%', maxHeight: '90vh', aspectRatio: 1.3 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" niceTicks="snap125" />
      <YAxis width="auto" niceTicks="snap125" />
      <Tooltip content={CustomTooltip} isAnimationActive={isAnimationActive} defaultIndex={defaultIndex} />
      <Legend />
      <Bar dataKey="Data"  barSize={20} fill="#49A5EF" isAnimationActive={isAnimationActive} />
    </BarChart>
  );
};

export default BarChartView;