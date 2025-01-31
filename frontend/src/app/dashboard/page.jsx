"use client";

import * as React from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";

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
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Grid size={4}>
          <Item>size=4</Item>
        </Grid>
        <Grid size={8}>
          <Item>size=8</Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
