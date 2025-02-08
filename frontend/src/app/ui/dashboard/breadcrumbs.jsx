"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";

// Function to format breadcrumb text
const formatBreadcrumb = (segment) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function IconBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {/* Home Breadcrumb (with icon) */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <HomeIcon sx={{ fontSize: 19 }} />
      </Link>

      {/* Dynamic Breadcrumbs (without icons) */}
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;

        return isLast ? (
          // Last segment (not clickable)
          <Typography
            key={href}
            sx={{
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            {formatBreadcrumb(segment)}
          </Typography>
        ) : (
          // Clickable breadcrumb links
          <Link
            key={href}
            href={href}
            style={{ textDecoration: "none", color: "primary" }}
          >
            {formatBreadcrumb(segment)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
