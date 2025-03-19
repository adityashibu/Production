import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";

const AllocateDevicesDialog = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:8000/user_data")
      .then((res) => res.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("Unexpected API response:", data);
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/device_info")
      .then((res) => res.json())
      .then((data) => {
        if (data.smart_home_devices && Array.isArray(data.smart_home_devices)) {
          const allocatedDevices =
            users.find((user) => user.user_id === selectedUser)
              ?.allocated_devices || [];
          const availableDevices = data.smart_home_devices.filter(
            (device) => !allocatedDevices.includes(device.id.toString())
          );
          setDevices(availableDevices);
        } else {
          console.error("Unexpected API response:", data);
          setDevices([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching devices:", err);
        setDevices([]);
      });
  }, [selectedUser, users]);

  const handleDeviceChange = (event) => {
    setSelectedDevices(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedUser) return;

    const user = users.find((user) => user.user_id === selectedUser);
    const existingAllocatedDevices = user?.allocated_devices || [];

    const updatedDevices = [
      ...new Set([...existingAllocatedDevices, ...selectedDevices]),
    ];

    fetch("http://localhost:8000/allocate_devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser,
        device_ids: updatedDevices,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        handleClose();
      })
      .catch((err) => console.error("Error allocating devices:", err));
  };

  const handleClose = () => {
    setSelectedUser("");
    setSelectedDevices([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}>
        Allocate Devices to User
      </DialogTitle>
      <DialogContent>
        {/* User Selection */}
        <FormControl fullWidth sx={{ marginTop: 1 }}>
          <InputLabel sx={{ fontFamily: "JetBrains Mono" }}>
            Select User
          </InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {Array.isArray(users) &&
              users.map((user) => (
                <MenuItem key={user.user_id} value={user.user_id}>
                  {user.user_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Device Selection */}
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel sx={{ fontFamily: "JetBrains Mono" }}>
            Select Devices
          </InputLabel>
          <Select
            multiple
            value={selectedDevices}
            onChange={handleDeviceChange}
            renderValue={(selected) =>
              selected
                .map((id) => devices.find((device) => device.id === id)?.name)
                .join(", ")
            }
          >
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                <Checkbox checked={selectedDevices.includes(device.id)} />
                <ListItemText primary={device.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selected Devices as Chips */}
        <Box sx={{ marginTop: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedDevices.map((deviceId) => {
            const device = devices.find((d) => d.id === deviceId);
            return (
              <Chip
                key={deviceId}
                label={device?.name || "Unknown"}
                onDelete={() =>
                  setSelectedDevices((prev) =>
                    prev.filter((id) => id !== deviceId)
                  )
                }
                sx={{ fontFamily: "JetBrains Mono" }}
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ fontFamily: "Jetbrains Mono" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ fontFamily: "JetBrains Mono" }}
        >
          Allocate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllocateDevicesDialog;
