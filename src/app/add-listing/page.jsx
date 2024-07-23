"use client";

import React, { useEffect } from "react";
import AddListingForm from "./components/AddListingForm";
import { Container, CssBaseline, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./addListingStyles.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function AddListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect user if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-up?add-listing=true");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
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
          <Elements stripe={stripePromise}>
            <AddListingForm />
          </Elements>
        </Container>
      </div>
    );
  }

  return null;
}
