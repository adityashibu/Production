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

const EnergyUsageChart = ({ data, timeRange }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const chartRef = useRef(null);

  const theme = useTheme();
  const strokeColor = theme.palette.mode === "dark" ? "#8253d7" : "#1F99FC";

  const getCurrentPowerUsage = () => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, device) => acc + (device.power_usage || 0), 0);
  };

  useEffect(() => {
    if (timeRange === "realtime") {
      const fetchRealTimeData = () => {
        const currentPower = getCurrentPowerUsage();
        setDataPoints((prevData) => {
          const newData = [
            ...prevData,
            { time: new Date(), power: currentPower },
          ];
          return newData.length > 10 ? newData.slice(1) : newData;
        });
      };

      const interval = setInterval(fetchRealTimeData, 1000);
      return () => clearInterval(interval);
    }
  }, [data, timeRange]);

  useEffect(() => {
    if (timeRange === "daily" || timeRange === "monthly") {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/energy_usage?range=${timeRange}`
          );
          const result = await response.json();
          if (Array.isArray(result)) {
            setDataPoints(
              result.map((entry) => ({
                time: new Date(entry.timestamp),
                power: entry.power_usage,
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching historical energy data:", error);
        }
      };

      fetchHistoricalData();
    }
  }, [timeRange]);

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
        {timeRange === "realtime"
          ? "Real-time Energy Usage"
          : timeRange === "daily"
          ? "Daily Energy Usage"
          : "Monthly Energy Usage"}
      </Typography>

      {dataPoints.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataPoints}>
            <XAxis
              dataKey="time"
              tickFormatter={(time) =>
                timeRange === "monthly"
                  ? dayjs(time).format("MMM DD")
                  : timeRange === "daily"
                  ? dayjs(time).format("MMM DD")
                  : dayjs(time).format("HH:mm")
              }
            />
            <YAxis
              label={{ value: "Power (W)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              labelFormatter={(label) =>
                `Time: ${
                  timeRange === "monthly"
                    ? dayjs(label).format("MMM DD")
                    : dayjs(label).format("HH:mm")
                }`
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
