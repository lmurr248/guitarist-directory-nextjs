import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await query("SELECT 1");
    res.status(200).json({ message: "Database connection successful" });
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
}
