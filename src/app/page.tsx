"use client";

import { useEffect, useState } from "react";
import { Listing } from "../../types";
import { Typography, Container, Divider } from "@mui/material";
import ListingCard from "./components/UI/ListingCard";
import "../app/globals.css";
import Searchbar from "./components/UI/Searchbar";
import Head from "next/head";
import { metadata } from "./metadata"; // Ensure this path is correct

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Listing[] = await response.json();
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
        <title>{String(metadata.title ?? "Default Title")}</title>
        <meta
          name="description"
          content={String(metadata.description ?? "Default description")}
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
          <div className="listing-card-container">
            {loading
              ? [1, 2, 3].map((key) => (
                  <div key={key}>
                    <ListingCard listing={{} as Listing} loading={true} />
                  </div>
                ))
              : filteredListings.map((listing) => (
                  <div key={listing.id}>
                    <ListingCard listing={listing} loading={false} />
                  </div>
                ))}
          </div>
        </Container>
      </div>
    </>
  );
}
