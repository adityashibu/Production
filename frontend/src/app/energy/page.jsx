"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

const Energy = () => {
  const [energyData, setEnergyData] = useState([]);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await fetch("http://localhost:8000/device_info");
        const data = await response.json();

        if (data.smart_home_devices) {
          // Transform data into PieChart format
          const chartData = data.smart_home_devices.map((device, index) => ({
            id: index,
            value: device.power_usage, // Using power_usage field
            label: device.name,
          }));

          setEnergyData(chartData);
        }
      } catch (error) {
        console.error("Error fetching energy data:", error);
      }
    };

    fetchEnergyData();
  }, []);

  return (
    <div>
      <Breadcrumb />
      <div className="p-4">
        <Grid container spacing={3}>
          {/* Card Component */}
          <Grid item xs={12} sm={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  {/* Pie Chart on Left */}
                  <Grid item xs={12} md={6}>
                    <PieChart
                      series={[{ data: energyData }]}
                      width={300}
                      height={200}
                    />
                  </Grid>

                  {/* Device Power Usage Details on Right */}
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Device Power Usage Details:
                      </Typography>
                      <ul>
                        {energyData.length > 0 ? (
                          energyData.map((device) => (
                            <li key={device.id}>
                              <Typography variant="body2">
                                <strong>{device.label}</strong>: {device.value}W
                              </Typography>
                            </li>
                          ))
                        ) : (
                          <Typography variant="body2">
                            Loading data...
                          </Typography>
                        )}
                      </ul>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Energy;
