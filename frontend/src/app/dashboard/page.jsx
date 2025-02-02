"use client";

import * as React from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SsidChartIcon from "@mui/icons-material/SsidChart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const Dashboard = () => {
  return (
    <div className="font-jetBrainsExtraBold text-main-light-blue-dark">
      <Breadcrumb />
      <Box height={30} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
            <Card sx={{ flex: 1, height: 140 }}>
              <CardContent className="flex">
                <ElectricBoltIcon
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
                  Energy Usage
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                ></Typography>
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
