import {
  Container,
  Typography,
  Avatar,
  Chip,
  Stack,
  CardMedia,
} from "@mui/material";
import { query } from "@/lib/db";
import { ListingType } from "../../../../types"; // Ensure correct path
import BackButton from "@/app/components/UI/BackButton";

interface ListingPageProps {
  params: {
    id: string;
  };
}

interface ListingRow {
  id: number;
  title: string;
  tagline: string;
  banner_image: string;
  main_image: string;
  location: string;
  instruments: string[];
}

async function getListingData(id: string): Promise<ListingType | null> {
  const result = await query(
    `
    SELECT 
      l.id, l.title, l.tagline, l.banner_image, l.main_image, l.location,
      COALESCE(json_agg(i.name) FILTER (WHERE i.name IS NOT NULL), '[]') AS instruments
    FROM listings l
    LEFT JOIN listing_instruments li ON l.id = li.listing_id
    LEFT JOIN instruments i ON li.instrument_id = i.id
    WHERE l.id = $1
    GROUP BY l.id
  `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  // Debug log to verify the structure of row
  console.log("Row data:", row);

  // Manually constructing the object to ensure type safety
  const listing: ListingType = {
    id: row.id,
    title: row.title,
    tagline: row.tagline,
    banner_image: row.banner_image,
    main_image: row.main_image,
    location: row.location,
    instruments: row.instruments,
  };

  return listing;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingData(params.id);

  if (!listing) {
    return (
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Listing not found
        </Typography>
        <BackButton />
      </Container>
    );
  }

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
      <BackButton />
    </Container>
  );
}

export async function generateStaticParams() {
  const result = await query("SELECT id FROM listings");
  return result.rows.map((row: { id: number }) => ({
    id: row.id.toString(),
  }));
}
