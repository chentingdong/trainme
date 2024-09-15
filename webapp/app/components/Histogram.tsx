"use client";
import { RefObject } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

type Props = {
  chartData: any[];
  chartRef: RefObject<HTMLDivElement>;
};

const ConnectedHistogram = ({ chartData, chartRef }: Props) => {
  // xScale function to convert time values to pixel positions
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const xScale = (time: number) => {
    const d = chartData.map(d => Number(d.time));
    const domain = [Math.min(...d), Math.max(...d)];
    const range = [0, (chartRef?.current?.getBoundingClientRect().width || 1000)];
    return (time - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + 2 * (margin.left + margin.right);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={500} ref={chartRef}>
        <BarChart data={chartData} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            domain={['dataMin', 'dataMax']}
            scale="linear"
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="zone"
            domain={[0, 'dataMax']}
            label={{ value: 'Zone', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Bar dataKey="zone" shape={<CustomizedBar data={chartData} xScale={xScale} />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// CustomizedBar component to calculate the bar width dynamically
const CustomizedBar = (props: any) => {
  const { x, y, height, index, data, xScale } = props;
  const currentTime = Number(data[index].time);
  const nextTime = data[index + 1] ? Number(data[index + 1].time) : Number(currentTime);
  const barWidth = xScale(nextTime) - xScale(currentTime);

  let fill = '#8884d8';
  switch (data[index].zone) {
    case 1:
      fill = '#8884d8';
      break;
    case 2:
      fill = '#82ca9d';
      break;
    case 3:
      fill = '#ffc658';
      break;
    case 4:
      fill = '#ff7300';
      break;
  };
  return (
    <rect
      x={xScale(currentTime)}
      y={y}
      width={barWidth}
      height={height}
      fill={fill}
    />
  );
};

export default ConnectedHistogram;
