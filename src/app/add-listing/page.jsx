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
      <Typography variant="h4" gutterBottom marginTop={5}>
        Add a Listing
      </Typography>
      <Typography variant="body1" gutterBottom marginBottom={2}>
        To add your listing, fill out the form below.
      </Typography>
      <AddListingForm />
    </Container>
  );
}
