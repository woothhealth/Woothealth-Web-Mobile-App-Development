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
    uv: 4000,
    Data: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    Data: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    Data: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    Data: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    uv: 1890,
    Data: 4800,
    amt: 2181,
  },
  {
    name: 'June',
    uv: 2390,
    Data: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    uv: 3490,
    Data: 4300,
    amt: 2100,
  },
  {
    name: 'Sep',
    uv: 3490,
    Data: 4300,
    amt: 2100,
  },
  {
    name: 'Oct',
    uv: 3490,
    Data: 4300,
    amt: 2100,
  },
  {
    name: 'Nov',
    uv: 3490,
    Data: 4300,
    amt: 2100,
  },
  {
    name: 'Dec',
    uv: 3490,
    Data: 4300,
    amt: 2100,
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
      style={{ width: '90%', maxWidth: '450px', maxHeight: '80vh', aspectRatio: 1.3 }}
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