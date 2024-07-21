import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await query("SELECT DISTINCT location FROM listings");
    res.status(200).json(result.rows);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res
      .status(500)
      .json({ message: "Internal Server Error", error: errorMessage });
  }
}
