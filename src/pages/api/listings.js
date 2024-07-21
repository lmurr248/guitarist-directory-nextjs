const { query } = require("../../lib/db.cjs");

export default async function handler(req, res) {
  try {
    const result = await query(`
      SELECT 
        l.id, l.title, l.tagline, l.banner_image, l.main_image, l.location,
        COALESCE(json_agg(i.name) FILTER (WHERE i.name IS NOT NULL), '[]') AS instruments
      FROM listings l
      LEFT JOIN listing_instruments li ON l.id = li.listing_id
      LEFT JOIN instruments i ON li.instrument_id = i.id
      GROUP BY l.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res
      .status(500)
      .json({ message: "Internal Server Error", error: errorMessage });
  }
}
