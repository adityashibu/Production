"use client";

import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import Breadcrumb from "@/app/ui/dashboard/breadcrumbs";
import IOSSwitch from "../ui/iosButton";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon
import UpdateNotifier from "../ui/snackBar";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [checked, setChecked] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState(null);

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

  const handleEdit = (id, name) => {
    setDeviceId(id);
    setDeviceName(name);
    setOpenDialog(true); // Open the dialog when edit icon is clicked
  };

  const handleSave = async () => {
    try {
      // Modify the fetch request to match the updated API endpoint
      const response = await fetch(
        `http://localhost:8000/device/${deviceId}/name/${deviceName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is successful
      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === deviceId ? { ...device, name: deviceName } : device
          )
        );
        setOpenDialog(false); // Close dialog after saving
      } else {
        console.error("Error updating device name:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating device name:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog without saving
  };

  return (
    <div>
      <UpdateNotifier />
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
                  position: "relative",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.02)" },
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

                  {/* Edit Icon Button */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "text.secondary",
                    }}
                    onClick={() => handleEdit(device.id, device.name)}
                  >
                    <EditIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog for editing device name */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontFamily: "JetBrains Mono", color: "primary.main" }}
        >
          Edit Device Name
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <TextField
            autoFocus
            fullWidth
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            sx={{ fontFamily: "JetBrains Mono" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{ fontFamily: "JetBrains Mono" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            sx={{ fontFamily: "JetBrains Mono" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Devices;
