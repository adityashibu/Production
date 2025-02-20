"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";

import { useRouter } from "next/navigation";

// Auth Stuff
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

const Homepage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Create User
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  // Sign In User
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const theme = getTheme(darkMode ? "dark" : "light");

  const handleSignUp = async () => {
    event.preventDefault(); // Prevent page refresh
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", true);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    event.preventDefault(); // Prevent page refresh
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
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
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Theme Toggle Button (Top Right) */}
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
        >
          <LightModeIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
        </IconButton>

        {/* Login/Signup Form */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* PowerHouse Title */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "JetBrains Mono",
              fontWeight: "800",
              mb: 2,
              color: "primary.main",
              fontSize: "3rem",
            }}
          >
            PowerHouse
          </Typography>

          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 400,
              bgcolor: "background.paper",
            }}
          >
            {/* Toggle Buttons */}
            <Box sx={{ display: "flex", mb: 3 }}>
              <Button
                fullWidth
                variant={isLogin ? "contained" : "outlined"}
                color="primary"
                onClick={() => setIsLogin(true)}
                sx={{
                  fontFamily: "JetBrains Mono",
                  fontWeight: 800,
                  color: isLogin ? "white" : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant={!isLogin ? "contained" : "outlined"}
                color="primary"
                onClick={() => setIsLogin(false)}
                sx={{
                  fontFamily: "JetBrains Mono",
                  fontWeight: 800,
                  color: !isLogin ? "white" : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                }}
              >
                Sign Up
              </Button>
            </Box>

            {/* Form Fields */}
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              onSubmit={isLogin ? handleLogin : handleSignUp}
            >
              {/* {!isLogin && (
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                  sx={{ fontFamily: "JetBrains Mono" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )} */}
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  fontFamily: "JetBrains Mono",
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;
