import { NextApiRequest, NextApiResponse } from "next";
const { query } = require("../../lib/db.cjs");

export default async function handler(req, res) {
  try {
    const result = await query("SELECT * FROM instruments");
    res.status(200).json(result.rows);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res
      .status(500)
      .json({ message: "Internal Server Error", error: errorMessage });
  }
}
