import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

    const interval = setInterval(fetchUpdates, 1000); // Poll every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="info"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
