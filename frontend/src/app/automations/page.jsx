"use client";
import React, { useState } from "react";
import Breadcrumb from "../ui/dashboard/breadcrumbs";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";  // Use TimePicker instead
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Automations = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState(dayjs());
  const [condition, setCondition] = useState("");

  const conditions = ["Temperature > 25°C", "Motion Detected", "Light On", "Door Open"];

  // Open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setName("");
    setTrigger(dayjs());
    setCondition("");
  };

  // Handle form submission
  const handleSave = () => {
    console.log("Saving Automation:", { name, trigger, condition });
    handleCloseDialog();
  };

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
            onClick={handleOpenDialog}
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

      {/* Dialog for Adding Automation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{fontFamily: "JetBrains Mono"}}>Add Automation Schedule</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Name Input */}
          <TextField
            label="Automation Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{fontFamily: "JetBrains Mono"}}
          />

          {/* Trigger Time Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Trigger Time"
              value={trigger}
              onChange={(newValue) => setTrigger(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>

          {/* Condition Dropdown */}
          <TextField
            select
            label="Condition"
            variant="outlined"
            fullWidth
            required
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {conditions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary.main" sx={{fontFamily: "JetBrains Mono"}}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{fontFamily: "JetBrains Mono"}}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Automations;
