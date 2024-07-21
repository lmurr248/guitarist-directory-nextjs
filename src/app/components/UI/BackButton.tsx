"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push("/")}
    >
      Back to Listings
    </Button>
  );
}
