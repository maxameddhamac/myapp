import { userSchema } from "../schemas/userSchema.js";

export const validate =
  (schema = userSchema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.format();

      console.log("Validation errors:", formatted);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.keys(formatted)
          .filter((key) => key !== "_errors")
          .map((field) => ({
            field,
            message: formatted[field]?._errors?.[0] || "Invalid value",
          })),
      });
    }
    return next();
  };
