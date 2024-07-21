import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { ListingType } from "../../../../types";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ListingCardProps {
  listing: ListingType;
  loading: boolean;
}

export default function ListingCard({ listing, loading }: ListingCardProps) {
  const maxChips = 2;
  const instruments = listing?.instruments ?? []; // Default to an empty array if undefined
  const extraInstruments = instruments.length - maxChips;

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      {loading ? (
        <Skeleton variant="rectangular" height={80} />
      ) : (
        <CardMedia
          component="img"
          alt={listing?.title ?? "Loading..."}
          sx={{ maxHeight: 80 }}
          image={listing?.banner_image}
        />
      )}
      {loading ? (
        <Skeleton
          variant="circular"
          width={70}
          height={70}
          className="listing-avatar"
        />
      ) : (
        <Avatar
          alt={listing?.title ?? "Loading..."}
          src={listing?.main_image}
          sx={{ width: 70, height: 70 }}
          className="listing-avatar"
        />
      )}
      <div
        className="instrument-chips"
        style={{ position: "absolute", top: 16, right: 16 }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={24} />
        ) : (
          <Stack direction="column" spacing={1}>
            {instruments.slice(0, maxChips).map((instrument, index) => (
              <Chip
                key={index}
                label={instrument}
                color="primary"
                size="small"
              />
            ))}
            {extraInstruments > 0 && (
              <Chip
                label={`+${extraInstruments}`}
                color="primary"
                size="small"
              />
            )}
          </Stack>
        )}
      </div>
      <CardContent>
        {loading ? (
          <Skeleton variant="text" width="60%" />
        ) : (
          <Typography gutterBottom variant="h5" component="div">
            {listing?.title}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" width="80%" />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {listing?.tagline}
          </Typography>
        )}
      </CardContent>
      <CardActions className="flex-space-between">
        {loading ? (
          <Skeleton variant="rectangular" width={100} height={36} />
        ) : (
          <Link href={`/listing/${listing.id}`} passHref>
            <Button size="small" component="a">
              View Profile
            </Button>
          </Link>
        )}
        {loading ? (
          <Skeleton variant="rectangular" width={100} height={36} />
        ) : (
          <Chip
            icon={<LocationOnIcon sx={{ fontSize: 8 }} />}
            label={listing?.location}
            size="small"
            variant="outlined"
          />
        )}
      </CardActions>
    </Card>
  );
}
