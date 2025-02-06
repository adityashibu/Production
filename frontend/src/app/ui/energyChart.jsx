import { useEffect, useState, useRef } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const EnergyUsageChart = ({ data }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const totalPowerUsage = data.reduce(
      (acc, device) => acc + (device.power_usage || 0),
      0
    );

    setDataPoints((prevData) => {
      const newData = [
        ...prevData,
        { time: Date.now(), power: totalPowerUsage },
      ];
      return newData.length > 10 ? newData.slice(1) : newData;
    });
  }, [data]);

  // Track container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      setDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      });
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: 20, md: 27 },
          fontWeight: 800,
          fontFamily: "JetBrains Mono",
          marginBottom: 2,
        }}
        className="text-main-light-blue-dark"
      >
        Energy Usage Trend
      </Typography>

      {/* Responsive container */}
      <div ref={chartRef} style={{ flex: 1, width: "100%", height: "100%" }}>
        <LineChart
          xAxis={[
            {
              data: dataPoints.map((dp) => dp.time),
              label: "Time",
              scaleType: "time",
            },
          ]}
          series={[
            {
              data: dataPoints.map((dp) => dp.power),
              label: "Power Usage (W)",
              showMark: true,
              color: "#1F99FC",
              strokeWidth: 2,
            },
          ]}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </>
  );
};

export default EnergyUsageChart;
