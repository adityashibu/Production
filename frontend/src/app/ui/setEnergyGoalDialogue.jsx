import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function SetEnergyGoalDialog({ open, onClose }) {
  const [energyGoal, setEnergyGoal] = React.useState("");

  const handleSubmit = async () => {
    if (energyGoal) {
      try {
        const response = await fetch(
          `http://localhost:8000/energy_goal/${energyGoal}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to set energy goal");
        }

        setEnergyGoal("");
        onClose();
      } catch (error) {
        console.error("Error setting energy goal:", error);
        alert("Error setting energy goal. Please try again.");
      }
    } else {
      alert("Please enter a valid energy goal.");
    }
  };

  const handleClose = () => {
    setEnergyGoal("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontFamily: "Jetbrains Mono", color: "primary.main" }}>
        Set Monthly Energy Goal
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Energy Goal (kWh)"
          variant="outlined"
          fullWidth
          value={energyGoal}
          onChange={(e) => setEnergyGoal(e.target.value)}
          inputMode="decimal" // Specify that the input mode is decimal
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          sx={{ fontFamily: "JetBrains Mono" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ fontFamily: "JetBrains Mono", color: "white" }}
        >
          Set Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
}
