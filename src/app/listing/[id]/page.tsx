import { Listing } from "../../../../types";
import { query } from "@/lib/db";
import {
  Container,
  Typography,
  Avatar,
  Chip,
  Stack,
  CardMedia,
} from "@mui/material";
import BackButton from "@/app/components/UI/BackButton";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = params;

  const result = await query(
    `
    SELECT 
      l.id, l.title, l.description, l.tagline, l.banner_image, l.main_image, l.location,
      COALESCE(json_agg(i.name) FILTER (WHERE i.name IS NOT NULL), '[]') AS instruments
    FROM listings l
    LEFT JOIN listing_instruments li ON l.id = li.listing_id
    LEFT JOIN instruments i ON li.instrument_id = i.id
    WHERE l.id = $1
    GROUP BY l.id
  `,
    [id]
  );

  const listing = result.rows[0];

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        {listing.title}
      </Typography>
      <Avatar
        alt={listing.title}
        src={listing.main_image}
        sx={{ width: 100, height: 100 }}
      />
      <Typography variant="h5" gutterBottom>
        {listing.tagline}
      </Typography>
      <CardMedia
        component="img"
        alt={listing.title}
        sx={{ maxHeight: 300 }}
        image={listing.banner_image}
      />
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {listing.instruments.map((instrument, index) => (
          <Chip key={index} label={instrument} color="primary" size="small" />
        ))}
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Location: {listing.location}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        About
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        {listing.description}
      </Typography>
      <BackButton />
    </Container>
  );
}

export async function generateStaticParams() {
  const result = await query(`
    SELECT id FROM listings
  `);

  return result.rows.map((listing) => ({
    id: listing.id.toString(),
  }));
}
