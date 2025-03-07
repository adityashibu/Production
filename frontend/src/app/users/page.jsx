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
  Button,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "../theme";
import { useRouter } from "next/navigation";

// Custom Dot Component for iOS-style Password
const DotInput = ({ value, maxLength }) => {
  const dots = Array(maxLength).fill(false);
  for (let i = 0; i < value.length; i++) {
    dots[i] = true;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      {dots.map((dot, index) => (
        <Box
          key={index}
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            bgcolor: dot ? "primary.main" : "transparent",
            border: "2px solid #ccc",
          }}
        />
      ))}
    </Box>
  );
};

const Keypad = ({ onKeyPress, onClear }) => {
  const handleButtonClick = (value) => {
    onKeyPress(value);
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
        <Button
          key={num}
          variant="outlined"
          onClick={() => handleButtonClick(num.toString())}
          sx={{ fontSize: "1.5rem", height: 50, fontFamily: "JetBrains Mono" }}
        >
          {num}
        </Button>
      ))}
      <Button
        variant="outlined"
        onClick={() => handleButtonClick("8")}
        sx={{ fontSize: "1.5rem", height: 50 }}
      >
        8
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleButtonClick("9")}
        sx={{ fontSize: "1.5rem", height: 50 }}
      >
        9
      </Button>
      <Button
        variant="outlined"
        onClick={() => handleButtonClick("0")}
        sx={{ fontSize: "1.5rem", height: 50 }}
      >
        0
      </Button>
      <Button
        variant="outlined"
        onClick={onClear}
        sx={{ fontSize: "1.5rem", height: 50 }}
      >
        <BackspaceIcon />
      </Button>
    </Box>
  );
};

const Users = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordValid, setPasswordValid] = useState(null);

  const router = useRouter();

  const theme = getTheme(darkMode ? "dark" : "light");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/user_data");
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
  
  const handlePasswordSubmit = async () => {
    if (selectedUser && passwordInput === selectedUser.user_password) {
      setPasswordValid(true);
  
      try {
        // Now, only set the selected user AFTER successful login
        const response = await fetch(`http://localhost:8000/select_user/${selectedUser.user_name}`, {
          method: "POST",
        });
  
        if (!response.ok) {
          console.error("Failed to set selected user");
          return;
        }
  
        // Fetch to verify if the user was actually set
        const selectedResponse = await fetch("http://localhost:8000/selected_user");
        const selectedData = await selectedResponse.json();
        console.log("Selected user from API:", selectedData);
  
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      } catch (error) {
        console.error("Error setting selected user:", error);
      }
    } else {
      setPasswordValid(false);
    }
  };

  const handleKeyPress = (value) => {
    if (passwordInput.length < 4) {
      setPasswordInput((prevInput) => prevInput + value);
    }
  };

  const handleClear = () => {
    setPasswordInput((prevInput) => prevInput.slice(0, -1));
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
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
        >
          <LightModeIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
        </IconButton>

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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
            Enter Password for {selectedUser ? selectedUser.user_name : "User"}
        </DialogTitle>
          <DialogContent>
            <DotInput value={passwordInput} maxLength={4} />
            <Typography variant="h6" sx={{ textAlign: "center", mt: 2, mb:2, fontFamily: "JetBrains Mono", fontSize: {xs: "15px", md:"24px"} }}>
              Please enter your 4-digit password:
            </Typography>

            <Keypad
              onKeyPress={handleKeyPress}
              onClear={handleClear}
              onSubmit={handlePasswordSubmit}
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
