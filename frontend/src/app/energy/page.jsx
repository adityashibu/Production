"use client";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Breadcrumb from "@/app/ui/dashboard/breadcrumbs";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend as RechartLegend,
} from "recharts";

const Energy = () => {
  const [deviceData, setDeviceData] = useState([]);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMdUp = useMediaQuery("(min-width: 960px)");
  const theme = useTheme();
  const COLORS =
    theme.palette.mode === "dark"
      ? ["#8253D7", "#9B6BE6", "#A97DFF", "#6A3BCC", "#5C2FB3"]
      : ["#1F99FC", "#1A84D9", "#187BB0", "#155C8D", "#134C6A"];

  const revenueData = [
    { month: "Jan", revenue: 4000, target: 6500 },
    { month: "Feb", revenue: 3000, target: 6500 },
    { month: "Mar", revenue: 5000, target: 6500 },
    { month: "Apr", revenue: 4500, target: 6500 },
    { month: "May", revenue: 6000, target: 6500 },
    { month: "Jun", revenue: 5500, target: 6500 },
    { month: "Jul", revenue: 7000, target: 6500 },
  ];

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch("http://localhost:8000/device_info");
        const data = await response.json();

        const transformedData = data.smart_home_devices
          .filter((device) => device.power_usage > 0)
          .map((device) => ({
            name: device.name,
            value: device.power_usage,
          }));

        console.log("Transformed data:", transformedData);
        setDeviceData(transformedData);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchDeviceData();

    const interval = setInterval(fetchDeviceData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Breadcrumb />
      <Box height={30} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            component="a"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.01)" },
              boxShadow: 3,
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 20, md: 30 },
                  fontWeight: 800,
                  fontFamily: "JetBrains Mono",
                  marginBottom: 2,
                  marginLeft: 2,
                  marginTop: { xs: 1, md: 2 },
                  color: "primary.main",
                }}
              >
                Device Energy Usage Breakdown
              </Typography>
              <div
                style={{
                  width: "100%",
                  height: isMdUp ? "400px" : "300px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx={isMobile ? "50%" : "50%"}
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMdUp ? 150 : 100}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        borderColor: "#4B5563",
                      }}
                      itemStyle={{ color: "#E5E7EB" }}
                    />
                    {/* Conditionally render Legend based on mobile */}
                    {!isMobile && (
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{
                          fontFamily: "JetBrains Mono",
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "20px",
                        }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
        {/* New card next to the pie chart */}
        <Grid item xs={12} md={8}>
          <Card
            component="a"
            sx={{
              height: { xs: "auto", md: "100%" }, // Auto height for mobile and 100% for desktop
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.01)" },
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 20, md: 30 },
                  fontWeight: 800,
                  fontFamily: "JetBrains Mono",
                  marginBottom: 2,
                  marginLeft: 2,
                  marginTop: { xs: 1, md: 2 },
                  color: "primary.main",
                }}
              >
                Energy Goals
              </Typography>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{ width: "100%", height: isMobile ? "450px" : "100%" }}
                >
                  {" "}
                  {/* Set larger height for mobile */}
                  <ResponsiveContainer>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <RechartTooltip
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.8)",
                          borderColor: "#4B5563",
                        }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <RechartLegend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Energy;
