"use client";
import React from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";

import { Box, Button } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";


const Automations = () => {
  return (
    <div>
      <Breadcrumb />
      <Box sx={{ paddingTop: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            // onClick={handleAddDeviceClick}
            sx={{
              fontFamily: "JetBrains Mono",
              fontWeight: 600,
              textTransform: "none",
              color: "white",
            }}
          >
            Add Automation Schedule
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Automations;
