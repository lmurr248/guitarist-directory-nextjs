import { buffer } from "micro";
import Stripe from "stripe";
import { query } from "../../lib/db.cjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const formData = session.metadata;

        console.log("Checkout session completed event received");
        console.log("Session metadata:", formData);

        // Check if the location exists, otherwise insert it
        let location_id;
        const locationQuery = "SELECT id FROM locations WHERE name = $1";
        try {
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
        } catch (error) {
          console.error("Error checking or inserting location:", error);
        }

        // Insert the listing into the database
        const listingQuery = `
          INSERT INTO listings (
            title, description, tagline, website, location, email, phone, package_id,
            online_lessons, at_teachers, at_students, main_image, banner_image, created_at,
            price_30_online, price_30_at_teachers, price_30_at_students, price_60_online, price_60_at_teachers, price_60_at_students
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(),
            $14, $15, $16, $17, $18, $19
          ) RETURNING id
        `;

        const listingValues = [
          formData.title,
          formData.description,
          formData.tagline,
          formData.website,
          location_id,
          formData.email,
          formData.phone,
          parseInt(formData.package, 10),
          formData.onlineLessons === true,
          formData.atTeachers === true,
          formData.atStudents === true,
          formData.mainImage || null,
          formData.bannerImage || null,
          formData.onlineLessonPrice30 || 0,
          formData.atTeachersPrice30 || 0,
          formData.atStudentsPrice30 || 0,
          formData.onlineLessonPrice60 || 0,
          formData.atTeachersPrice60 || 0,
          formData.atStudentsPrice60 || 0,
        ];

        let listing_id;
        try {
          const listingResult = await query(listingQuery, listingValues);
          listing_id = listingResult.rows[0].id;
          console.log("Listing created successfully with ID:", listing_id);
        } catch (error) {
          console.error("Error inserting listing:", error);
        }

        // Insert the listing instruments into the listing_instruments table
        const instruments = formData.instruments.split(",");
        for (const instrument of instruments) {
          try {
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

            const insertListingInstrumentQuery =
              "INSERT INTO listing_instruments (listing_id, instrument_id) VALUES ($1, $2)";
            await query(insertListingInstrumentQuery, [
              listing_id,
              instrument_id,
            ]);
          } catch (error) {
            console.error("Error inserting listing instruments:", error);
          }
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
