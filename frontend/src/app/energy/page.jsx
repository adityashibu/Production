"use client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
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
import SetEnergyGoalDialog from "../ui/setEnergyGoalDialogue";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  Legend as RechartLegend,
} from "recharts";

import { Edit } from "@mui/icons-material";

const Energy = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [energyGoal, setEnergyGoal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMdUp = useMediaQuery("(min-width: 960px)");
  const theme = useTheme();
  const COLORS =
    theme.palette.mode === "dark"
      ? ["#8253D7", "#9B6BE6", "#A97DFF", "#6A3BCC", "#5C2FB3"]
      : ["#1F99FC", "#1A84D9", "#187BB0", "#155C8D", "#134C6A"];

  const chartColors = {
    usage: theme.palette.mode === "dark" ? "#8B5CF6" : "#1D4ED8",
    goal: theme.palette.mode === "dark" ? "#D8B8FF" : "#93C5FD",
  };

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

    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/energy_usage/monthly"
        );
        const data = await response.json();

        const formattedMonthlyData = data.map((item) => ({
          month: new Date(item.timestamp).toLocaleString("default", {
            month: "short",
          }),
          usage: item.power_usage,
        }));

        setMonthlyData(formattedMonthlyData);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    const fetchEnergyGoal = async () => {
      try {
        const response = await fetch("http://localhost:8000/energy_goal");
        const data = await response.json();
        setEnergyGoal(data.goal_value);
      } catch (error) {
        console.error("Error fetching energy goal:", error);
      }
    };

    fetchDeviceData();
    fetchMonthlyData();
    fetchEnergyGoal();

    const interval = setInterval(() => {
      fetchDeviceData();
      fetchMonthlyData();
      fetchEnergyGoal();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const monthlyDataWithGoal = monthlyData.map((data) => ({
    ...data,
    goal: energyGoal,
  }));

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

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
              height: { xs: "auto", md: "100%" },
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
                <IconButton
                  onClick={handleDialogOpen}
                  sx={{ marginLeft: 1 }}
                  color="primary"
                  size="small"
                >
                  <Edit />
                </IconButton>
              </Typography>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "80%",
                    height: isMobile ? "450px" : "90%",
                  }}
                >
                  <ResponsiveContainer>
                    <AreaChart data={monthlyDataWithGoal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      {!isMobile && <YAxis stroke="#9CA3AF" />}
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
                        dataKey="goal"
                        stroke={chartColors.goal}
                        fill={chartColors.goal}
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="usage"
                        stroke={chartColors.usage}
                        fill={chartColors.usage}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <SetEnergyGoalDialog open={openDialog} onClose={handleDialogClose} />
    </div>
  );
};

export default Energy;
