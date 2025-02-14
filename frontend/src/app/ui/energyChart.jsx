import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useTheme } from "@emotion/react";

const EnergyUsageChart = ({ data }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [buffer, setBuffer] = useState([]); // Store data for averaging
  const chartRef = useRef(null);

  const theme = useTheme();
  const strokeColor = theme.palette.mode === "dark" ? "#8253d7" : "#1F99FC";

  // Function to get current power usage
  const getCurrentPowerUsage = () => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, device) => acc + (device.power_usage || 0), 0);
  };

  // Initialize with first data point
  useEffect(() => {
    const initialPower = getCurrentPowerUsage();
    setDataPoints([{ time: new Date(), power: initialPower }]);
  }, []); // Runs only on first render

  // Update buffer every second with new power usage
  useEffect(() => {
    if (!data || data.length === 0) return;

    const currentPower = getCurrentPowerUsage();
    setBuffer((prevBuffer) => {
      const newBuffer = [...prevBuffer, currentPower];

      // Keep only the last 5 minutes (assuming data updates every second)
      return newBuffer.length > 300 ? newBuffer.slice(-300) : newBuffer;
    });
  }, [data]);

  // Every 5 minutes, plot the average power usage
  useEffect(() => {
    const interval = setInterval(() => {
      if (buffer.length === 0) return;

      const averagePower =
        buffer.reduce((acc, val) => acc + val, 0) / buffer.length || 0;
      const timestamp = new Date();

      if (!isNaN(averagePower) && averagePower !== undefined) {
        setDataPoints((prevData) => {
          const newData = [
            ...prevData,
            { time: timestamp, power: averagePower },
          ];
          return newData.length > 10 ? newData.slice(1) : newData;
        });
      }

      setBuffer([]);
    }, 1000);

    return () => clearInterval(interval);
  }, [buffer]);

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: 20, md: 30 },
          fontWeight: 800,
          fontFamily: "JetBrains Mono",
          marginBottom: 2,
          marginLeft: 2,
          marginTop: 2,
          color: "primary.main",
        }}
      >
        Energy Usage Trend
      </Typography>

      {/* Ensure chart only renders with valid data */}
      {dataPoints.length > 0 ? (
        <ResponsiveContainer width="100%" height={300} className="mt-10">
          <LineChart data={dataPoints}>
            <XAxis
              dataKey="time"
              tickFormatter={(time) => dayjs(time).format("HH:mm")}
            />
            <YAxis
              label={{ value: "Power (W)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              labelFormatter={(label) =>
                `Time: ${dayjs(label).format("HH:mm:ss")}`
              }
              formatter={(value) => [`${value} W`, "Power Usage"]}
            />
            <Line
              type="monotone"
              dataKey="power"
              stroke={strokeColor}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography
          sx={{ fontSize: 16, fontStyle: "italic", textAlign: "center" }}
        >
          No data available yet...
        </Typography>
      )}
    </>
  );
};

export default EnergyUsageChart;
