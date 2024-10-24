"use client";
import { getZoneColor } from "@/utils/helper";
import { RefObject } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

type Props = {
  chartData: { time: number; zone: number; }[];
  chartRef: RefObject<HTMLDivElement>;
};

const ConnectedHistogram = ({ chartData = [], chartRef }: Props) => {
  const margin = { top: 0, right: 0, bottom: 0, left: -60 };
  const chartHeight = chartRef?.current?.getBoundingClientRect().height || 100;
  const fontSize = Math.max(10, Math.min(Math.round(chartHeight / 7), 16));

  // xScale function to convert time values to pixel positions
  const xScale = (time: number) => {
    const d = chartData.map((d) => Number(d.time));
    const domain = [Math.min(...d), Math.max(...d)];
    const width =
      (chartRef?.current?.getBoundingClientRect().width || 1) + margin.left - 1;
    const range = [margin.left, width];
    return (
      ((time - domain[0]) / (domain[1] - domain[0])) * (range[1] - range[0])
    );
  }; 

  return (
    <ResponsiveContainer width="100%" height="100%" ref={chartRef}>
      <BarChart data={chartData} margin={margin} barGap={0} barCategoryGap={0}>
        <CartesianGrid strokeDasharray="3 3" syncWithTicks={true} />
        <XAxis
          type="number"
          dataKey="time"
          domain={["minData", "maxData"]}
          ticks={[]}
          fontSize={fontSize} 
        />
        <YAxis
          type="number"
          dataKey="zone"
          domain={["minData", "maxData"]}
          tick={false}
          axisLine={false}
          label={undefined}
        />
        <Bar
          dataKey="zone"
          isAnimationActive={false}
          width={0}
          shape={<CustomizedBar data={chartData} xScale={xScale} />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// CustomizedBar component to calculate the bar width dynamically
/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomizedBar = (props: any) => {
  const { x, y, height, index, data, xScale } = props;
  const currentTime = Number(data[index].time);
  const nextTime = data[index + 1]
    ? Number(data[index + 1].time)
    : Number(currentTime);
  const barWidth = xScale(nextTime) - xScale(currentTime);
  const fill = getZoneColor(data[index].zone);
  const fontSize = Math.max(8, Math.min(Math.round(height / 4), 16));

  return (
    <>
      <rect x={x} y={y} width={barWidth} height={height} fill={fill} />
      <text
        x={x + barWidth / 2 + fontSize / 4}
        y={y + height / 2}
        fontSize={fontSize}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {data[index].zone.toString()}
      </text>
    </>
  );
};

export default ConnectedHistogram;
