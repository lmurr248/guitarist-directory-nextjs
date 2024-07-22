"use client";

import { useEffect, useState } from "react";
import { Typography, Container, Divider, Grid } from "@mui/material";
import ListingCard from "./components/UI/ListingCard";
import "../app/globals.css";
import Searchbar from "./components/UI/Searchbar";
import Head from "next/head";
import { metadata } from "./metadata"; // Ensure this path is correct

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    return (
      (!selectedInstrument ||
        listing.instruments.includes(selectedInstrument)) &&
      (!selectedLocation || listing.location === selectedLocation)
    );
  });

  return (
    <>
      <Head>
        <title>{metadata.title ?? "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description ?? "Default description"}
        />
      </Head>
      <div>
        <div className="hero homepage-hero">
          <Container maxWidth="lg" className="align-center">
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              color="white"
              align="center"
            >
              Find Guitar Teachers Near You
            </Typography>
            <Typography
              variant="h5"
              component="h5"
              color="white"
              align="center"
              gutterBottom
            >
              Find your perfect guitar teacher!
            </Typography>
            <Divider
              component="li"
              sx={{ marginTop: 3, marginBottom: 4, bgcolor: "#ffffff55" }}
            />
            <Searchbar
              setSelectedInstrument={setSelectedInstrument}
              setSelectedLocation={setSelectedLocation}
              selectedInstrument={selectedInstrument}
              selectedLocation={selectedLocation}
            />
          </Container>
        </div>
        <Container maxWidth="lg">
          {/* <div className="listing-card-container">
            {loading
              ? [1, 2, 3].map((key) => (
                  <div key={key}>
                    <ListingCard listing={{}} loading={true} />
                  </div>
                ))
              : filteredListings.map((listing) => (
                  <div key={listing.id}>
                    <ListingCard listing={listing} loading={false} />
                  </div>
                ))}
          </div> */}
          <Grid
            container
            columns={{ xs: 1, sm: 8, md: 12 }}
            rowSpacing={4}
            columnSpacing={0}
          >
            {loading
              ? [1, 2, 3].map((key) => (
                  <Grid item xs={1} sm={4} md={4} key={key}>
                    <ListingCard listing={{}} loading={true} />
                  </Grid>
                ))
              : filteredListings.map((listing) => (
                  <Grid item xs={1} sm={4} md={4} key={listing.id}>
                    <ListingCard listing={listing} loading={false} />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </div>
    </>
  );
}
