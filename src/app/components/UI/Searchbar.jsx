"use client";

import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

export default function Searchbar({
  setSelectedInstrument,
  setSelectedLocation,
  selectedInstrument,
  selectedLocation,
}) {
  const [instruments, setInstruments] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [loadingInstruments, setLoadingInstruments] = React.useState(true);
  const [loadingLocations, setLoadingLocations] = React.useState(true);

  React.useEffect(() => {
    async function fetchInstruments() {
      const response = await fetch("/api/instruments");
      const data = await response.json();
      setInstruments(data.map((instrument) => instrument.name));
      setLoadingInstruments(false);
    }

    async function fetchLocations() {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data.map((location) => location.location));
      setLoadingLocations(false);
    }

    fetchInstruments();
    fetchLocations();
  }, []);

  const handleResetFilters = () => {
    setSelectedInstrument("");
    setSelectedLocation("");
  };

  if (loadingInstruments || loadingLocations) {
    return <CircularProgress />;
  }

  return (
    <Box
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#fff"
      padding={2}
      gap={2}
    >
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <NativeSelect
          value={selectedInstrument}
          inputProps={{
            name: "instrument",
            id: "instrument-native",
          }}
          sx={{ padding: 0.5 }}
          onChange={(e) => setSelectedInstrument(e.target.value)}
        >
          <option value="" disabled>
            Select Instrument
          </option>
          {instruments.map((instrument, index) => (
            <option key={index} value={instrument}>
              {instrument}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <NativeSelect
          value={selectedLocation}
          inputProps={{
            name: "location",
            id: "location-native",
          }}
          sx={{ backgroundColor: "white", padding: 0.5 }}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="" disabled>
            Select Location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      {(selectedInstrument || selectedLocation) && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
}
