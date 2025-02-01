"use client";

import * as React from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Box } from "@mui/material";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
          <Stack spacing={2} direction={{ sm: "column", md: "row" }}>
            <Card sx={{ maxWidth: 49 + "%", height: 140 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>

            <Card sx={{ maxWidth: 49 + "%", height: 140 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
          </Stack>
        </Grid>

        <Grid size={4}>
          <Stack spacing={2} direction="column">
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Stack spacing={2} direction="row">
                  <div className="mt-[50px] ml-[20px]">
                    <CalendarMonthIcon />
                  </div>
                  <div className="pl-[10px] pr-[10px] pt-[10px] pb-[10px]">
                    {/* <span className="">230 KwH</span>
                    <span>Monthly Usage</span> */}
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
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>

            <Card sx={{ maxWidth: 345 }}>
              <CardContent></CardContent>
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
          </Stack>
        </Grid>

        <Grid size={8}>
          <Stack spacing={2} direction="column">
            <Card sx={{ height: 60 + "vh" }}>
              <CardContent></CardContent>
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2} direction="column">
            <Card sx={{ height: 60 + "vh" }}>
              <CardContent></CardContent>
              {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
