const { query } = require("../../lib/db.cjs");
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, hashedPassword]
      );

      res
        .status(201)
        .json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
