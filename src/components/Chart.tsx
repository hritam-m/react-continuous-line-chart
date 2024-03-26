import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

const generateSinusoidalData = (
  numPoints: number,
  amplitude: number,
  frequency: number
): { x: number; y: number }[] => {
  const data: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = i;
    const y = amplitude * Math.sin(frequency * x);
    data.push({ x, y });
  }
  return data;
};

const numPoints = 500;
const amplitude = 10;

const Chart: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [dataIndex, setDataIndex] = useState(0);
  const [isDrawingCompleted, setIsDrawingCompleted] = useState(false);
  const [frequency, setFrequency] = useState(Math.random() * (0.15 - 0.1) + 0.1);
  const [data, setData] = useState<{ x: number; y: number }[]>(
    generateSinusoidalData(numPoints, amplitude, frequency)
  );

  const xLabels = useMemo(
    () => data.map((_, index) => `Point ${index + 1}`),
    [data]
  );

  const intervalCallback = useCallback(() => {
    if (dataIndex < data.length) {
      setChartData((prevChartData) => {
        let newChartData;
        if (prevChartData.length < numPoints) {
          newChartData = [...prevChartData, data[dataIndex].y];
        } else {
          newChartData = [...prevChartData];
          newChartData.splice(dataIndex, 1, data[dataIndex].y);
        }
        return newChartData;
      });
      setDataIndex(dataIndex + 1);

      if (dataIndex === data.length - 1) {
        setIsDrawingCompleted(true);
      }
    }
  }, [dataIndex, data]);

  useEffect(() => {
    const interval = setInterval(intervalCallback, 10);
    return () => clearInterval(interval);
  }, [intervalCallback]);

  useEffect(() => {
    if (isDrawingCompleted) {
      setDataIndex(0);
      const newFrequency = Math.random() * (0.15 - 0.1) + 0.1;
      setFrequency(newFrequency);
      setData(generateSinusoidalData(numPoints, amplitude, newFrequency));
      setIsDrawingCompleted(false);
    }
  }, [isDrawingCompleted]);

  return xLabels.length > 0 ? (
    <LineChart
      width={1000}
      height={300}
      series={[{ type: 'line', data: chartData, showMark: false }]}
      xAxis={[
        {
          scaleType: 'point',
          data: xLabels,
          tickInterval: (_value, index) => index % 10 === 0,
          tickLabelInterval: (_value, index) => index % 10 === 0,
        },
      ]}
      yAxis={[{ min: -amplitude - 2, max: amplitude + 2 }]}
      sx={{
        '.MuiLineElement-root': {
          stroke: '#8884d8',
          strokeWidth: 3,
        },
        '.MuiMarkElement-root': {
          stroke: '#8884d8',
          scale: '0.6',
          fill: '#fff',
          strokeWidth: 3,
        },
      }}
      disableAxisListener
    >
      {(dataIndex > 0) &&
      <ChartsReferenceLine
        x={`Point ${dataIndex}`}
        lineStyle={{ stroke: 'grey', strokeWidth: '2px' }}
      />}
    </LineChart>
  ) : null;
};

export default Chart;