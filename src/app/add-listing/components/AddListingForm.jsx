"use client";

import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Skeleton from "@mui/material/Skeleton";
import PricingCard from "./PricingCard";
import dynamic from "next/dynamic";
import { useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

// Dynamically import Image component with no SSR
const Image = dynamic(() => import("next/image"), { ssr: false });

export default function AddListingForm() {
  const [formStep, setFormStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const stripe = useStripe();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    tagline: "",
    website: "",
    location: "",
    instruments: [],
    email: "",
    phone: "",
    package: "",
    onlineLessons: false,
    atTeachers: false,
    atStudents: false,
    mainImage: null,
    bannerImage: null,
    onlineLessonPrice60: 0,
    onlineLessonPrice30: 0,
    atTeachersPrice60: 0,
    atTeachersPrice30: 0,
    atStudentsPrice60: 0,
    atStudentsPrice30: 0,
  });
  const [titleLength, setTitleLength] = useState(0);
  const maxTitleLength = 35;
  const [taglineLength, setTaglineLength] = useState(0);
  const maxTaglineLength = 55;

  // Package card data
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    return () => {
      if (form.mainImagePreview) URL.revokeObjectURL(form.mainImagePreview);
      if (form.bannerImagePreview) URL.revokeObjectURL(form.bannerImagePreview);
    };
  }, [form.bannerImagePreview, form.mainImagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "title") {
      setTitleLength(value.length);
    }

    if (name === "tagline") {
      setTaglineLength(value.length);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedInstruments = [...form.instruments];
    if (checked) {
      updatedInstruments.push(value);
    } else {
      updatedInstruments = updatedInstruments.filter(
        (instrument) => instrument !== value
      );
    }
    setForm({
      ...form,
      instruments: updatedInstruments,
    });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      [name]: checked,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file && file.size <= 1048576 && /image\/(jpeg|png)/.test(file.type)) {
      const previewUrl = URL.createObjectURL(file);
      setForm({
        ...form,
        [name]: file,
        [`${name}Preview`]: previewUrl,
      });
    } else {
      alert(
        "Please select a valid image file (jpg, png) with size less than 1MB."
      );
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Error uploading image: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let mainImageUrl = form.mainImage;
      let bannerImageUrl = form.bannerImage;

      if (form.mainImage instanceof File) {
        mainImageUrl = await uploadFile(form.mainImage);
      }
      if (form.bannerImage instanceof File) {
        bannerImageUrl = await uploadFile(form.bannerImage);
      }

      const selectedPackageDetails = packages.find(
        (pkg) => pkg.id === selectedPackage
      );
      const packagePrice = selectedPackageDetails.price;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          price: packagePrice * 100,
          ...form,
          mainImage: mainImageUrl,
          bannerImage: bannerImageUrl,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const session = await response.json();
      if (session.id) {
        stripe.redirectToCheckout({ sessionId: session.id });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form: " + error.message);
    }
  };

  const handleSelectPackage = (packageId) => {
    setSelectedPackage(packageId);
    setFormStep(2);
  };

  const handleBackToStep1 = () => {
    setFormStep(1);
  };

  // Fetch instruments
  const [instruments, setInstruments] = useState([]);
  const [loadingInstruments, setLoadingInstruments] = useState(true);
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch("/api/instruments");
        if (!response.ok) {
          throw new Error("Failed to fetch instruments");
        }
        const data = await response.json();
        setInstruments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInstruments(false);
      }
    };
    fetchInstruments();
  }, []);

  // Fetch locations
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/all-locations");
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  const selectedPackageDetails = packages.find(
    (pkg) => pkg.id === selectedPackage
  );

  return (
    <div>
      {formStep === 1 && (
        <section className="pricing-table">
          <Typography variant="h5" gutterBottom sx={{ paddingTop: 5 }}>
            Select a listing package
          </Typography>
          <Typography variant="body1" sx={{ paddingBottom: 5 }}>
            Choose a package to make your listing stand out.
          </Typography>
          {loadingPackages ? (
            <Grid container spacing={2}>
              {Array.from(new Array(2)).map((_, index) => (
                <Grid item xs={8} sm={6} md={4} key={index}>
                  <Card sx={{ maxWidth: 345, borderRadius: 3 }}>
                    <CardContent>
                      <Skeleton variant="text" width="80%" height={60} />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={20}
                        sx={{ marginTop: 1 }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={25}
                        sx={{ marginTop: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Grid container spacing={2}>
                {packages.map((packageItem, index) => (
                  <Grid item xs={8} sm={6} md={4} key={index}>
                    <PricingCard
                      id={packageItem.id}
                      name={packageItem.name}
                      description={packageItem.description}
                      price={packageItem.price}
                      onSelect={handleSelectPackage}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </section>
      )}

      {formStep === 2 && selectedPackageDetails && (
        <section>
          <Typography variant="h4" gutterBottom marginTop={5}>
            Add a {selectedPackageDetails.name} Listing
          </Typography>
          <Typography variant="body1" gutterBottom marginBottom={4}>
            To add your {selectedPackageDetails.name} listing, fill out the form
            below.
          </Typography>
          <Button
            onClick={handleBackToStep1}
            variant="text"
            sx={{ color: "#007fff", marginBottom: 2 }}
          >
            &larr; Select Package
          </Button>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                id="listing-title"
                name="title"
                fullWidth
                label="Listing Title"
                margin="normal"
                variant="standard"
                helperText="Enter the title of your listing"
                inputProps={{ maxLength: maxTitleLength }}
                value={form.title}
                onChange={handleChange}
              />
              <Typography
                variant="caption"
                color={titleLength === maxTitleLength ? "red" : "textSecondary"}
              >
                {titleLength}/{maxTitleLength} characters
              </Typography>

              <TextField
                id="tagline"
                name="tagline"
                fullWidth
                label="Tagline"
                margin="normal"
                variant="standard"
                helperText="A short description of your listing"
                inputProps={{ maxLength: maxTaglineLength }}
                value={form.tagline}
                onChange={handleChange}
              />
              <Typography
                variant="caption"
                color={
                  taglineLength === maxTaglineLength ? "red" : "textSecondary"
                }
              >
                {taglineLength}/{maxTaglineLength} characters
              </Typography>
              <TextField
                id="description"
                name="description"
                fullWidth
                variant="standard"
                label="Description"
                multiline
                maxRows={50}
                margin="normal"
                helperText="This is the About text. Introduce yourself, and what you do."
                onChange={handleChange}
              />
              <Typography variant="h6" gutterBottom sx={{ paddingTop: 7 }}>
                Listing images:
              </Typography>

              <Stack direction="row" spacing={2}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Main Image
                  </Typography>
                  <input
                    accept="image/*"
                    id="mainImage"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    name="mainImage"
                  />
                  <label htmlFor="mainImage">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      sx={{ width: 70, height: 70 }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="caption" gutterBottom>
                    Upload your main image.
                  </Typography>
                  <Grid item xs={12} sm={6}>
                    {form.mainImagePreview ? (
                      <Image
                        src={form.mainImagePreview}
                        alt="Main Image Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    ) : null}
                  </Grid>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Banner Image
                  </Typography>
                  <input
                    accept="image/*"
                    id="bannerImage"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    name="bannerImage"
                  />
                  <label htmlFor="bannerImage">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      sx={{ width: 70, height: 70 }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="caption" gutterBottom>
                    Upload your banner image.
                  </Typography>
                  <Grid item xs={12} sm={6}>
                    {form.bannerImagePreview ? (
                      <Image
                        src={form.bannerImagePreview}
                        alt="Banner Image Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    ) : null}
                  </Grid>
                </Stack>
              </Stack>

              <Typography variant="h6" gutterBottom sx={{ paddingTop: 7 }}>
                About your lessons:
              </Typography>
              <Typography variant="subtitle1">
                What instruments do you teach?
              </Typography>
              <Stack direction="row" spacing={2}>
                {loadingInstruments
                  ? Array.from(new Array(5)).map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        width={210}
                        height={40}
                      />
                    ))
                  : instruments.map((instrument, index) => (
                      <FormControlLabel
                        key={index}
                        name="instruments"
                        id="instruments"
                        control={
                          <Checkbox
                            value={instrument.name}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label={instrument.name}
                      />
                    ))}
              </Stack>
              <Typography variant="subtitle1">Where are you based?</Typography>
              <Autocomplete
                id="location-autocomplete"
                freeSolo
                options={locations.map((location) => location.name)}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option.name) {
                    return option.name;
                  }
                  return "";
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select or enter your location"
                    variant="standard"
                    margin="normal"
                    fullWidth
                  />
                )}
                value={form.location}
                onInputChange={(event, newValue) => {
                  setForm({
                    ...form,
                    location: newValue,
                  });
                }}
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    location:
                      typeof newValue === "string"
                        ? newValue
                        : newValue?.name || "",
                  });
                }}
              />
              <Typography variant="subtitle1">
                Where do you teach your lessons?
              </Typography>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.onlineLessons}
                      onChange={handleSwitchChange}
                      name="onlineLessons"
                    />
                  }
                  label="Online"
                  sx={{ width: "17ch" }}
                />
                {form.onlineLessons === true ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2">Pricing (£):</Typography>
                    <TextField
                      id="onlineLessonPrice60"
                      name="onlineLessonPrice60"
                      label="60 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                    <TextField
                      id="onlineLessonPrice30"
                      name="onlineLessonPrice30"
                      label="30 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                  </Stack>
                ) : null}
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.atTeachers}
                      onChange={handleSwitchChange}
                      name="atTeachers"
                    />
                  }
                  label="At teachers"
                  sx={{ width: "17ch" }}
                />
                {form.atTeachers === true ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2">Pricing (£):</Typography>
                    <TextField
                      id="atTeachersPrice60"
                      name="atTeachersPrice60"
                      label="60 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                    <TextField
                      id="atTeachersPrice30"
                      name="atTeachersPrice30"
                      label="30 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                  </Stack>
                ) : null}
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.atStudents}
                      onChange={handleSwitchChange}
                      name="atStudents"
                    />
                  }
                  label="At students"
                  sx={{ width: "17ch" }}
                />
                {form.atStudents === true ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2">Pricing (£):</Typography>
                    <TextField
                      id="atStudentsPrice60"
                      name="atStudentsPrice60"
                      label="60 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                    <TextField
                      id="atStudentsPrice30"
                      name="atStudentsPrice30"
                      label="30 minutes"
                      type="number"
                      margin="normal"
                      sx={{ width: "15ch" }}
                      onChange={handleChange}
                    />
                  </Stack>
                ) : null}
              </Stack>
              <Typography variant="h6" gutterBottom sx={{ paddingTop: 7 }}>
                How can students contact you?
              </Typography>
              <TextField
                id="email"
                name="email"
                type="email"
                fullWidth
                label="Email"
                margin="normal"
                variant="standard"
                helperText="Enter your email address"
                value={form.email}
                onChange={handleChange}
              />
              <TextField
                id="website"
                name="website"
                type="url"
                fullWidth
                label="Website"
                margin="normal"
                variant="standard"
                helperText="Enter your website"
                value={form.website}
                onChange={handleChange}
                sx={{ paddingBottom: 7 }}
              />

              <Button
                type="submit"
                variant="contained"
                endIcon={<KeyboardArrowRightIcon />}
              >
                Continue
              </Button>
            </Stack>
          </form>
        </section>
      )}
    </div>
  );
}
