"use client";

import React from "react";
import AddListingForm from "./components/AddListingForm";
import { Container, CssBaseline, Divider, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./addListingStyles.css";

export default function AddListingPage() {
  return (
    <div>
      <div className="hero">
        <Container maxWidth="lg" className="align-center">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            color="inherit"
            align="center"
          >
            Create a Listing
          </Typography>
          <Typography
            variant="h5"
            component="h5"
            color="inherit"
            align="center"
            gutterBottom
          >
            ...and be found by students looking to learn guitar!
          </Typography>
        </Container>
      </div>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Elements
          stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}
        >
          <AddListingForm />
        </Elements>
      </Container>
    </div>
  );
}
