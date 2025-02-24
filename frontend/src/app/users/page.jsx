"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "../theme";
import { useRouter } from "next/navigation";

const Users = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordValid, setPasswordValid] = useState(null);

  const router = useRouter(); // Initialize the router

  const theme = getTheme(darkMode ? "dark" : "light");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/user_data"); // API endpoint
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
    setPasswordInput("");
    setPasswordValid(null);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === selectedUser.user_password) {
      setPasswordValid(true);
      // Redirect to the dashboard page after successful password match
      router.push("/dashboard");
    } else {
      setPasswordValid(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          px: 2,
        }}
      >
        {/* Theme Toggle Button */}
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
        >
          <LightModeIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "JetBrains Mono",
            fontWeight: "800",
            mb: 3,
            color: "primary.main",
            fontSize: "2.5rem",
          }}
        >
          Users List
        </Typography>

        {/* Loading State */}
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Container
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 3,
              maxWidth: "1000px",
            }}
          >
            {users.length > 0 ? (
              users.map((user, index) => (
                <Card
                  key={index}
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    p: 2,
                    textAlign: "center",
                    boxShadow: 6,
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "JetBrains Mono",
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      {user.user_name}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                No users found.
              </Typography>
            )}
          </Container>
        )}

        {/* Password Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Enter Password for {selectedUser?.user_name}</DialogTitle>
          <DialogContent>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            {passwordValid !== null && (
              <Typography
                variant="body2"
                sx={{
                  color: passwordValid ? "green" : "red",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                {passwordValid ? "Password is correct!" : "Incorrect password."}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              color="primary"
              disabled={passwordInput.length !== 4}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Users;
