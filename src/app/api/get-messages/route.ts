import UserModel from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log("User not aunthenticated");
    return Response.json(
      {
        success: false,
        message: "User not aunthenticated",
      },
      {
        status: 400,
      }
    );
  }
  const user: User = session.user as User;
  console.log(user);
  
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
      console.log("Unable to find the user");
      return Response.json(
        {
          success: false,
          message: "Unable to find the user",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
        success:true,
        messages: user[0].messages
    },{
        status:200
    })
  } catch (error) {
    console.log("Unable to get messages");
    return Response.json(
      {
        success: false,
        message: "Unable to get messages",
      },
      {
        status: 500,
      }
    );
  }
}
