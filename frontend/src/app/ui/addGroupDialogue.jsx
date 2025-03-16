import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IOSSwitch from "../ui/iosButton";

const AddGroupDialog = ({ open, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupStatus, setGroupStatus] = useState(false); // false = "off", true = "on"
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceList, setDeviceList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/devices")
      .then((res) => res.json())
      .then((data) => setDeviceList(data.devices || []))
      .catch((err) => console.error("Error fetching devices:", err));
  }, []);

  const handleDeviceChange = (event) => {
    setSelectedDevices(event.target.value);
  };

  const handleRemoveChip = (deviceId) => {
    setSelectedDevices(selectedDevices.filter((id) => id !== deviceId));
  };

  const handleSubmit = () => {
    if (!groupName.trim()) {
      alert("Group name cannot be empty");
      return;
    }

    const newGroup = {
      name: groupName,
      status: groupStatus ? "on" : "off",
      devices: selectedDevices,
    };

    fetch("http://localhost:8000/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGroup),
    })
      .then((res) => res.json())
      .then(() => {
        onClose();
        setGroupName("");
        setGroupStatus(false);
        setSelectedDevices([]);
      })
      .catch((err) => console.error("Error adding group:", err));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}>
        Add New Group
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        {/* Group Name Field */}
        <TextField
          variant="outlined"
          label="Group Name"
          fullWidth
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          InputLabelProps={{ sx: { fontFamily: "JetBrains Mono" } }}
        />

        {/* iOS Switch for Status */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontFamily: "JetBrains Mono" }}>
            Group Status:
          </Typography>
          <IOSSwitch
            checked={groupStatus}
            onChange={() => setGroupStatus((prev) => !prev)}
          />
        </Box>

        {/* Multiple Device Selection */}
        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: "JetBrains Mono" }}>
            Select Devices
          </InputLabel>
          <Select
            multiple
            value={selectedDevices}
            onChange={handleDeviceChange}
            renderValue={(selected) =>
              selected
                .map(
                  (id) => deviceList.find((device) => device.id === id)?.name
                )
                .join(", ")
            }
          >
            {deviceList.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                <Checkbox checked={selectedDevices.includes(device.id)} />
                <ListItemText primary={device.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selected Devices as Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedDevices.map((deviceId) => {
            const device = deviceList.find((d) => d.id === deviceId);
            return (
              <Chip
                key={deviceId}
                label={device?.name}
                onDelete={() => handleRemoveChip(deviceId)}
                deleteIcon={<CloseIcon />}
                sx={{ fontSize: 14 }}
              />
            );
          })}
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ fontFamily: "JetBrains Mono", color: "white" }}
        >
          Add Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupDialog;
