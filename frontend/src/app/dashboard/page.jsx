"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SsidChartIcon from "@mui/icons-material/SsidChart";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/smart_home_devices"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching smart home devices:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPowerUsage = data.reduce(
    (acc, device) => acc + (device.power_usage || 0),
    0
  );

  return (
    <div className="font-jetBrainsExtraBold text-main-light-blue-dark">
      <Breadcrumb />
      <Box height={30} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
            <Card
              sx={{
                flex: 1,
                height: 140,
                boxShadow: "0px 4px 10px rgba(31, 153, 252, 0.5)",

                /* Uncomment if we need dynamic shadows according to usage */
                // boxShadow:
                //   totalPowerUsage > 500
                //     ? "0px 4px 10px rgba(255, 0, 0, 0.7)" // Red shadow for high usage
                //     : totalPowerUsage < 400
                //     ? "0px 4px 10px rgba(0, 255, 0, 0.7)" // Green shadow for low usage
                //     : "0px 4px 10px rgba(204, 119, 34, 0.7)", // Orche shadow for moderate usage
              }}
              variant="outlined"
            >
              <CardContent className="flex flex-col items-start">
                <div className="flex items-center">
                  <ElectricBoltIcon
                    sx={{ color: "#1F99FC", fontSize: { xs: 20, md: 22 } }}
                  />
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      fontFamily: "JetBrains Mono",
                      fontWeight: 600,
                      fontSize: { xs: 20, md: 22 },
                    }}
                    className="text-main-light-blue-dark pl-3"
                  >
                    Energy Usage
                  </Typography>
                </div>

                {/* Total Power Usage Below */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: 30, md: 45 },
                    fontWeight: 800,
                    fontFamily: "JetBrains Mono",
                  }}
                  className="text-main-light-blue-dark"
                >
                  {totalPowerUsage} W
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, height: 140 }}>
              <CardContent className="flex">
                <DevicesOtherIcon
                  sx={{ color: "#1F99FC", fontSize: { xs: 20, md: 22 } }}
                  className="mt-1"
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "JetBrains Mono",
                    fontWeight: 600,
                    fontSize: { xs: 20, md: 22 },
                  }}
                  className="text-main-light-blue-dark pl-3"
                >
                  Devices Connected
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                ></Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, height: 140 }}>
              <CardContent className="flex">
                <PrecisionManufacturingIcon
                  sx={{ color: "#1F99FC", fontSize: { xs: 20, md: 22 } }}
                  className="mt-1"
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "JetBrains Mono",
                    fontWeight: 600,
                    fontSize: { xs: 20, md: 22 },
                  }}
                  className="text-main-light-blue-dark pl-3"
                >
                  Automation Schedules
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                ></Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, height: 140 }}>
              <CardContent className="flex">
                <SsidChartIcon
                  sx={{ color: "#1F99FC", fontSize: { xs: 20, md: 22 } }}
                  className="mt-1"
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    fontFamily: "JetBrains Mono",
                    fontWeight: 600,
                    fontSize: { xs: 20, md: 22 },
                  }}
                  className="text-main-light-blue-dark pl-3"
                >
                  Usage Breakdown
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                ></Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column */}
        {/* <Grid item xs={12} md={4}>
          <Stack spacing={2} direction="column">
            <Card>
              <CardContent>
                <Stack spacing={2} direction="row">
                  <div className="mt-[50px] ml-[20px]">
                    <CalendarMonthIcon />
                  </div>
                  <div className="pl-[10px] pr-[10px] pt-[10px] pb-[10px]">
                    <Typography
                      sx={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}
                    >
                      230 KwH
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "JetBrains Mono", fontWeight: 400 }}
                    >
                      Monthly Usage
                    </Typography>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent></CardContent>
            </Card>
          </Stack>
        </Grid> */}

        {/* Large Cards Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "60vh" }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "60vh" }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
