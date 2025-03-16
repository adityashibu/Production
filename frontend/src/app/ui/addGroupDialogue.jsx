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

const AddGroupDialog = ({ open, onClose, group, onSave }) => {
  const [groupName, setGroupName] = useState("");
  const [groupStatus, setGroupStatus] = useState(false); // false = "off", true = "on"
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/device_info")
      .then((res) => res.json())
      .then((data) => {
        if (data.smart_home_devices && Array.isArray(data.smart_home_devices)) {
          setDeviceList(data.smart_home_devices || []);
        } else {
          console.error("Unexpected API response:", data);
          setDeviceList([]);
        }
      })
      .catch((err) => console.error("Error fetching device info:", err));

    if (group) {
      setIsEditing(true);
      setGroupName(group.name);
      setGroupStatus(group.status === "on");
      setSelectedDevices(group.devices || []);
    } else {
      setIsEditing(false);
      setGroupName("");
      setGroupStatus(false);
      setSelectedDevices([]);
    }
  }, [group, open]);

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

    if (group) {
      fetch(`http://localhost:8000/groups/${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      })
        .then((res) => res.json())
        .then(() => {
          onSave();
          onClose();
        })
        .catch((err) => console.error("Error editing group:", err));
    } else {
      fetch("http://localhost:8000/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      })
        .then((res) => res.json())
        .then(() => {
          onSave();
          onClose();
        })
        .catch((err) => console.error("Error adding group:", err));
    }

    setGroupName("");
    setGroupStatus(false);
    setSelectedDevices([]);
  };

  const handleCancel = () => {
    setGroupName("");
    setGroupStatus(false);
    setSelectedDevices([]);
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}>
        {group ? "Edit Group" : "Add New Group"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          variant="outlined"
          label="Group Name"
          fullWidth
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          InputLabelProps={{ sx: { fontFamily: "JetBrains Mono" } }}
        />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontFamily: "JetBrains Mono" }}>
            Group Status:
          </Typography>
          <IOSSwitch
            checked={groupStatus}
            onChange={() => setGroupStatus((prev) => !prev)}
          />
        </Box>

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

      <DialogActions>
        <Button
          onClick={handleCancel}
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
          {group ? "Save Changes" : "Add Group"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupDialog;
