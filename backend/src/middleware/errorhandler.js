import AppError from "../utils/AppError";
import { ZodError } from "zod";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.json({
            message: err.message,
            success: false,
        });
    }
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json({ message: err.message, success: false });
    }
    console.error("Error:", err);
    return res
        .status(500)
        .json({ message: "Something went wrong!", success: false });
};
//# sourceMappingURL=errorhandler.js.map