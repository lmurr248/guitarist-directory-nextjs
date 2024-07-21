"use client";

import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

export default function AddListingForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tagline: "",
    website: "",
    location: "",
    email: "",
    phone: "",
    package: "",
  });
  const [titleLength, setTitleLength] = useState(0);
  const maxTitleLength = 35;
  const [taglineLength, setTaglineLength] = useState(0);
  const maxTaglineLength = 55;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div>
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
            color={taglineLength === maxTaglineLength ? "red" : "textSecondary"}
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
            helperText="Enter a detailed description of your listing"
            onChange={handleChange}
          />
          <Typography variant="subtitle1" gutterBottom>
            Main Image{" "}
          </Typography>
          <IconButton
            name="mainImage"
            id="mainImage"
            color="primary"
            aria-label="upload picture"
            component="span"
            sx={{ width: 70, height: 70 }}
          >
            <PhotoCamera />
          </IconButton>
          <Typography variant="caption" gutterBottom>
            Upload a main image for your listing
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Banner Image{" "}
          </Typography>
          <IconButton
            name="bannerImage"
            id="bannerImage"
            color="primary"
            aria-label="upload picture"
            component="span"
            sx={{ width: 70, height: 70 }}
          >
            <PhotoCamera />
          </IconButton>
          <Typography variant="caption" gutterBottom>
            Upload a banner image for your listing
          </Typography>

          <Button variant="contained" endIcon={<KeyboardArrowRightIcon />}>
            Continue
          </Button>
        </Stack>
      </form>
    </div>
  );
}
