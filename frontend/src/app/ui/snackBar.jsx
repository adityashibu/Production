"use client";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function UpdateNotifier() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch("http://localhost:8000/updates");
        const data = await response.json();
        if (data.updates.length > 0) {
          setMessage(data.updates.join("\n"));
          setOpen(true);
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    const interval = setInterval(fetchUpdates, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="success"
        variant="filled"
        sx={{
          width: "100%",
        }}
        color="info"
      >
        <AlertTitle>Success</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
}
