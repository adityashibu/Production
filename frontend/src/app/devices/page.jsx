"use client";

import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material";
import Breadcrumb from "@/app/ui/dashboard/breadcrumbs";
import IOSSwitch from "../ui/iosButton";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [checked, setChecked] = useState([]); // Stores IDs of "on" devices

  useEffect(() => {
    fetch("http://localhost:8000/device_info")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Debugging
        setDevices(data.smart_home_devices || []);

        setChecked(
          (data.smart_home_devices || [])
            .filter((device) => device.status === "on")
            .map((device) => device.id)
        );
      })
      .catch((err) => {
        console.error("Error fetching devices:", err);
        setDevices([]);
      });
  }, []);

  const handleToggle = async (id) => {
    try {
      await fetch(`http://localhost:8000/device/${id}/status`, {
        method: "POST",
      });

      setChecked((prevChecked) =>
        prevChecked.includes(id)
          ? prevChecked.filter((deviceId) => deviceId !== id)
          : [...prevChecked, id]
      );

      setDevices((prev) =>
        prev.map((device) =>
          device.id === id
            ? { ...device, status: device.status === "on" ? "off" : "on" }
            : device
        )
      );
    } catch (error) {
      console.error("Error toggling device:", error);
    }
  };

  return (
    <div>
      <Breadcrumb />
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={device.id}>
              <Card
                sx={{
                  height: "15vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80%",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <IOSSwitch
                      edge="end"
                      onChange={() => handleToggle(device.id)}
                      checked={checked.includes(device.id)}
                    />

                    {/* Device Name + IP */}
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: 16, md: 20 },
                          fontWeight: 600,
                          fontFamily: "JetBrains Mono",
                          color: "primary.main",
                        }}
                      >
                        {device.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily={"JetBrains Mono"}
                        sx={{ fontSize: { xs: 12, md: 16 } }}
                      >
                        {device.ip}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Devices;
