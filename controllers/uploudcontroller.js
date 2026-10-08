import cloudinary from "../utilities/cloudinary.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_pictures" },
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed", error });
        }

        return res.status(201).json({
          success: true,
          message: "Image uploaded successfully",
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};
