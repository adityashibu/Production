"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import GoogleIcon from "@mui/icons-material/Google";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";
import { useRouter } from "next/navigation";

// Firebase & Google Auth Hook
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

const Homepage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // Google Authentication Hook
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const theme = getTheme(darkMode ? "dark" : "light");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) {
        console.error("Google sign-in failed: No user result received.");
        return;
      }
      
      console.log("User signed in:", result.user);
      sessionStorage.setItem("user", true);
      router.push("/users");
    } catch (error) {
      console.error("Google sign-in error:", error);
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
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          color="inherit"
          onClick={() => setDarkMode(!darkMode)}
        >
          <LightModeIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
        </IconButton>

        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontFamily: "JetBrains Mono" }}>
              Sign in with Google
            </Typography>

            <Button
              onClick={handleGoogleLogin}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                fontFamily: "JetBrains Mono",
                fontWeight: 800,
                color: "white",
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue with Google"}
            </Button>

            {error && (
              <Typography color="error" variant="body2">
                {error.message}
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;
