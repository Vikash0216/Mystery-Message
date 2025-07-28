import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();

    const userVerifiedByUsername = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (userVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 409 }
      );
    }

    const userByEmail = await UserModel.findOne({ email });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // 🔁 CASE 1: Email exists but user is not verified
    if (userByEmail) {
      if (userByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 409 }
        );
      }

      // Update existing unverified user
      userByEmail.password = hashedPassword;
      userByEmail.verifyCode = verificationCode;
      userByEmail.verifyCodeExpiry = verifyCodeExpiry;
      await userByEmail.save();

      const emailResponse = await sendVerificationEmail(
        email,
        userName,
        verificationCode
      );

      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send verification email",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Verification code resent. Please check your email.",
        },
        { status: 200 }
      );
    }

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      verifyCode: verificationCode,
      verifyCodeExpiry,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });
    await newUser.save();

    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verificationCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered. Please verify your email nb .",
      },
      { status: 201 }
    );
  } catch (signupError) {
    console.error("Failed to signup:", signupError);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to signup",
      },
      { status: 500 }
    );
  }
}
