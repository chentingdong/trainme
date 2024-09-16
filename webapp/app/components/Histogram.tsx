'use client';
import { getZoneColor } from '@/utils/helper';
import { RefObject } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from 'recharts';

type Props = {
  chartData: any[];
  chartRef: RefObject<HTMLDivElement>;
  height: number;
};

const ConnectedHistogram = ({ chartData, chartRef, height = 400 }: Props) => {
  // xScale function to convert time values to pixel positions
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const xScale = (time: number) => {
    const d = chartData.map((d) => Number(d.time));
    const domain = [Math.min(...d), Math.max(...d)];
    const width = chartRef?.current?.getBoundingClientRect().width || 1;
    const range = [margin.left, width - margin.right];
    return (time - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]);
  };

  return (
    <ResponsiveContainer width='100%' height={height} ref={chartRef}>
      <BarChart data={chartData} margin={margin} barGap={0} barCategoryGap={0}>
        <CartesianGrid strokeDasharray='3 3' syncWithTicks />
        <XAxis type='number' dataKey='time' domain={['minData', 'maxData']} ticks={[]} />
        <YAxis
          type='number'
          dataKey='zone' domain={[0, 5]}
          ticks={[1, 2, 3, 4, 5]}
          label={{ value: 'Zone', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Bar
          dataKey='zone'
          isAnimationActive={false}
          width={0}
          shape={<CustomizedBar data={chartData} xScale={xScale} />}
        >
          <LabelList dataKey='time' position='bottom' />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// CustomizedBar component to calculate the bar width dynamically
const CustomizedBar = (props: any) => {
  const { x, y, height, index, data, xScale } = props;
  const currentTime = Number(data[index].time);
  const nextTime = data[index + 1]
    ? Number(data[index + 1].time)
    : Number(currentTime);
  const barWidth = xScale(nextTime) - xScale(currentTime) - 2;
  const fill = getZoneColor(data[index].zone);
  return (
    <rect x={x} y={y} width={barWidth} height={height} fill={fill} />
  );
};

export default ConnectedHistogram;
