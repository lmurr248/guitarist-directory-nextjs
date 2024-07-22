"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography, CircularProgress } from "@mui/material";

export default function Success() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session_id = searchParams.get("session_id");

    if (session_id) {
      const verifySession = async () => {
        try {
          const response = await fetch("/api/verify-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id }),
          });

          if (response.ok) {
            const data = await response.json();
            setMessage("Your listing has been created successfully!");
          } else {
            setMessage(
              "There was an error creating your listing. Please contact support."
            );
          }
        } catch (error) {
          setMessage(
            "An error occurred while verifying your payment. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };

      verifySession();
    } else {
      setLoading(false);
      setMessage("Session ID not found. Please try again.");
    }
  }, [searchParams]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h5">{message}</Typography>
      )}
    </div>
  );
}
