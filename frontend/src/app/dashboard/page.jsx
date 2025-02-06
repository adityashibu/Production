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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SsidChartIcon from "@mui/icons-material/SsidChart";

import IOSSwitch from "../ui/iosButton";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [checked, setChecked] = React.useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/smart_home_devices"
        );
        const result = await response.json();
        setData(result);
        // Set initial checked state based on the device status
        const initialChecked = result
          .filter((device) => device.status === "on")
          .map((device) => device.id);
        setChecked(initialChecked);
      } catch (error) {
        console.error("Error fetching smart home devices:", error);
      }
    };

    fetchData();

    // Set up an interval to fetch data every 1 second
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toggle switch based on device ID
  const handleToggle = (deviceId) => () => {
    const currentIndex = checked.indexOf(deviceId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(deviceId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // Calculate total power usage and number of devices
  const totalPowerUsage = data.reduce(
    (acc, device) => acc + (device.power_usage || 0),
    0
  );

  const noOfDevices = data.length || 0;

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
              }}
              variant="outlined"
            >
              <CardContent className="flex flex-row justify-between items-center h-full px-4">
                <ElectricBoltIcon
                  sx={{ color: "#1F99FC", fontSize: { xs: 50, md: 65 } }}
                />

                <div className="flex flex-col text-right mt-4 pr-3">
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "JetBrains Mono",
                      fontWeight: 600,
                      fontSize: { xs: 18, md: 22 },
                    }}
                    className="text-main-light-blue-dark"
                  >
                    Energy Usage
                  </Typography>

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
                </div>
              </CardContent>
            </Card>

            <Card
              sx={{
                flex: 1,
                height: 140,
                boxShadow: "0px 4px 10px rgba(31, 153, 252, 0.5)",
              }}
              variant="outlined"
            >
              <CardContent className="flex flex-row justify-between items-center h-full px-4">
                <DevicesOtherIcon
                  sx={{ color: "#1F99FC", fontSize: { xs: 50, md: 65 } }} // Adjusted size
                />

                <div className="flex flex-col text-right mt-4 pr-3">
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "JetBrains Mono",
                      fontWeight: 600,
                      fontSize: { xs: 18, md: 22 },
                    }}
                    className="text-main-light-blue-dark"
                  >
                    Devices Connected
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: 30, md: 45 },
                      fontWeight: 800,
                      fontFamily: "JetBrains Mono",
                    }}
                    className="text-main-light-blue-dark"
                  >
                    {noOfDevices} Devices
                  </Typography>
                </div>
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

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: { xs: "60vh", md: "40vh" },
              boxShadow: "0px 4px 10px rgba(31, 153, 252, 0.5)",
            }}
            variant="outlined"
          >
            <CardContent>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  maxHeight: "400px",
                  overflowX: "auto",
                }}
                subheader={
                  <ListSubheader
                    sx={{
                      fontFamily: "JetBrains Mono",
                      fontWeight: 800,
                      fontSize: { xs: 20, md: 30 },
                      mt: 1,
                      color: "#1F99FC",
                    }}
                    className="text-main-light-blue-dark"
                  >
                    Device Control
                  </ListSubheader>
                }
              >
                <div className="mt-4">
                  {data.map((device) => (
                    <ListItem
                      key={device.id}
                      sx={{
                        fontFamily: "JetBrains Mono", // Ensure the list item itself uses the font
                      }}
                      className="font-jetBrains"
                    >
                      <ListItemIcon>
                        <IOSSwitch
                          edge="end"
                          onChange={handleToggle(device.id)}
                          checked={checked.includes(device.id)}
                          inputProps={{
                            "aria-labelledby": `switch-list-label-${device.id}`,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={`switch-list-label-${device.id}`}
                        primary={device.name}
                        sx={{
                          fontFamily: "JetBrains Mono",
                          fontWeight: 600,
                          fontSize: { xs: 18, md: 22 },
                        }}
                        className="font-jetBrains"
                      />
                    </ListItem>
                  ))}
                </div>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Large Cards Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "60vh" }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
