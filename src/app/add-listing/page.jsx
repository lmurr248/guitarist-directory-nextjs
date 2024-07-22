import React from "react";
import AddListingForm from "./components/AddListingForm";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";

export default function AddListingPage() {
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />

      <AddListingForm />
    </Container>
  );
}
