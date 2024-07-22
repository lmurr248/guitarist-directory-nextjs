import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    const file = files.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const uploadResponse = await cloudinary.uploader.upload(
        file[0].filepath,
        {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        }
      );

      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ error: "Error uploading image" });
    }
  });
}
