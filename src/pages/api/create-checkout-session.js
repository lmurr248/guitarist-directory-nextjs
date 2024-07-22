import Stripe from "stripe";
import { query } from "../../lib/db.cjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      title,
      description,
      tagline,
      website,
      location,
      email,
      phone,
      packageId,
      onlineLessons,
      atTeachers,
      atStudents,
      mainImage,
      bannerImage,
      instruments,
      onlineLessonPrice30,
      atTeachersPrice30,
      atStudentsPrice30,
      onlineLessonPrice60,
      atTeachersPrice60,
      atStudentsPrice60,
    } = req.body;

    try {
      const packageDetails = await getPackageDetails(packageId); // Function to fetch package details
      const price = Math.round(packageDetails.price * 100); // Convert to integer representing cents

      // Truncate the description to 500 characters
      const truncatedDescription =
        description.length > 500
          ? description.substring(0, 497) + "..."
          : description;

      // Save the full description and get an identifier
      const descriptionId = await saveFullDescription(description);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: packageDetails.name,
              },
              unit_amount: price, // Use the package price in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/add-listing?canceled=true`,
        metadata: {
          title,
          description: truncatedDescription, // Use the truncated description
          description_id: descriptionId, // Store the description identifier
          tagline,
          website,
          location,
          email,
          phone,
          package: packageId,
          onlineLessons,
          atTeachers,
          atStudents,
          mainImage, // Add mainImage to metadata
          bannerImage, // Add bannerImage to metadata
          instruments: instruments.join(","),
          onlineLessonPrice30: parseFloat(onlineLessonPrice30) || 0,
          atTeachersPrice30: parseFloat(atTeachersPrice30) || 0,
          atStudentsPrice30: parseFloat(atStudentsPrice30) || 0,
          onlineLessonPrice60: parseFloat(onlineLessonPrice60) || 0,
          atTeachersPrice60: parseFloat(atTeachersPrice60) || 0,
          atStudentsPrice60: parseFloat(atStudentsPrice60) || 0,
        },
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      res
        .status(500)
        .json({ error: `Internal Server Error: ${error.message}` });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

async function getPackageDetails(packageId) {
  const queryText = "SELECT * FROM packages WHERE id = $1";
  const queryParams = [packageId];

  try {
    const result = await query(queryText, queryParams);
    if (result.rows.length === 0) {
      throw new Error(`Package with id ${packageId} not found`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching package details:", error);
    throw new Error("Failed to fetch package details");
  }
}

async function saveFullDescription(description) {
  const queryText =
    "INSERT INTO temporary_descriptions (description) VALUES ($1) RETURNING id";
  const queryParams = [description];

  try {
    const result = await query(queryText, queryParams);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error saving full description:", error);
    throw new Error("Failed to save full description");
  }
}
