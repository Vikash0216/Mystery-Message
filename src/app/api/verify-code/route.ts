import { z } from "zod";
import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";
import { userNameValidation } from "@/schemas/signUpSchema";

// Define combined validation schema
const verifyCodeSchema = z.object({
  userName: userNameValidation,
  code: verifySchema.shape.code,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    console.log("Request Body:", body); // For debugging

    const parsed = verifyCodeSchema.safeParse(body);

    if (!parsed.success) {
      const formatted = parsed.error.format();
      const userNameErrors = formatted.userName?._errors || [];
      const codeErrors = formatted.code?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            [...userNameErrors, ...codeErrors].join(", ") || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { userName, code } = parsed.data;
    console.log("Verifying user:", userName, "with code:", code);

    const user = await UserModel.findOne({ userName });

    if (!user) {
      console.log("User not found");
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      console.log("Code expired");
      return Response.json(
        {
          success: false,
          message: "Code expired! Please try again",
        },
        { status: 410 }
      );
    }

    if (user.verifyCode !== code) {
      console.log("Code doesn't match");
      return Response.json(
        {
          success: false,
          message: "Code doesn't match. Failed to verify",
        },
        { status: 401 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Failed to verify code", err);
    return Response.json(
      {
        success: false,
        message: "Failed to verify the code",
      },
      { status: 500 }
    );
  }
}
