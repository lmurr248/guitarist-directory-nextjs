"use client";

import React from "react";
import AddListingForm from "./components/AddListingForm";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function AddListingPage() {
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Elements
        stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}
      >
        <AddListingForm />
      </Elements>
    </Container>
  );
}
