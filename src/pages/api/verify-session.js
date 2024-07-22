import Stripe from "stripe";
import { query } from "../../lib/db.cjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { session_id } = req.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        // Extract metadata and insert listing into the database if not already done
        const formData = session.metadata;

        // Retrieve the full description using the description_id
        const fullDescription = await getFullDescription(
          formData.description_id
        );

        // Check if the listing already exists to prevent duplicate entries
        const checkListingQuery =
          "SELECT id FROM listings WHERE session_id = $1";
        const checkListingResult = await query(checkListingQuery, [session_id]);

        if (checkListingResult.rows.length === 0) {
          // Proceed to insert listing and related data
          // Check if the location exists, otherwise insert it
          let location_id;
          const locationQuery = "SELECT id FROM locations WHERE name = $1";
          const locationResult = await query(locationQuery, [
            formData.location,
          ]);

          if (locationResult.rows.length > 0) {
            location_id = locationResult.rows[0].id;
          } else {
            const insertLocationQuery =
              "INSERT INTO locations (name) VALUES ($1) RETURNING id";
            const insertLocationResult = await query(insertLocationQuery, [
              formData.location,
            ]);
            location_id = insertLocationResult.rows[0].id;
          }

          // Insert the listing into the database
          const listingQuery = `
            INSERT INTO listings (
              title, description, tagline, website, location, email, phone, package_id,
              online_lessons, at_teachers, at_students, main_image, banner_image, created_at,
              price_30_online, price_30_at_teachers, price_30_at_students, price_60_online, price_60_at_teachers, price_60_at_students,
              session_id
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(),
              $14, $15, $16, $17, $18, $19, $20
            ) RETURNING id
          `;

          const listingValues = [
            formData.title,
            fullDescription,
            formData.tagline,
            formData.website,
            formData.location,
            formData.email,
            formData.phone,
            parseInt(formData.package, 10),
            formData.onlineLessons === "true",
            formData.atTeachers === "true",
            formData.atStudents === "true",
            formData.mainImage || "https://example.com/placeholder.jpg",
            formData.bannerImage || "https://example.com/placeholder.jpg",
            formData.onlineLessonPrice30 || 0,
            formData.atTeachersPrice30 || 0,
            formData.atStudentsPrice30 || 0,
            formData.onlineLessonPrice60 || 0,
            formData.atTeachersPrice60 || 0,
            formData.atStudentsPrice60 || 0,
            session_id,
          ];

          const listingResult = await query(listingQuery, listingValues);
          const listing_id = listingResult.rows[0].id;

          // Insert the listing instruments into the listing_instruments table
          const instruments = formData.instruments.split(",");
          for (const instrument of instruments) {
            const instrumentQuery =
              "SELECT id FROM instruments WHERE name = $1";
            const instrumentResult = await query(instrumentQuery, [instrument]);

            let instrument_id;
            if (instrumentResult.rows.length > 0) {
              instrument_id = instrumentResult.rows[0].id;
            } else {
              const insertInstrumentQuery =
                "INSERT INTO instruments (name) VALUES ($1) RETURNING id";
              const insertInstrumentResult = await query(
                insertInstrumentQuery,
                [instrument]
              );
              instrument_id = insertInstrumentResult.rows[0].id;
            }

            // Insert into listing_instruments
            const insertListingInstrumentQuery =
              "INSERT INTO listing_instruments (listing_id, instrument_id) VALUES ($1, $2)";
            await query(insertListingInstrumentQuery, [
              listing_id,
              instrument_id,
            ]);
          }

          // Delete the temporary description
          await deleteTemporaryDescription(formData.description_id);

          res.status(200).json({ message: "Listing created successfully" });
        } else {
          res.status(200).json({ message: "Listing already exists" });
        }
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

async function getFullDescription(descriptionId) {
  const queryText =
    "SELECT description FROM temporary_descriptions WHERE id = $1";
  const queryParams = [descriptionId];

  try {
    const result = await query(queryText, queryParams);
    return result.rows[0].description;
  } catch (error) {
    console.error("Error fetching full description:", error);
    throw new Error("Failed to fetch full description");
  }
}

async function deleteTemporaryDescription(descriptionId) {
  const queryText = "DELETE FROM temporary_descriptions WHERE id = $1";
  const queryParams = [descriptionId];

  try {
    await query(queryText, queryParams);
  } catch (error) {
    console.error("Error deleting temporary description:", error);
    throw new Error("Failed to delete temporary description");
  }
}
