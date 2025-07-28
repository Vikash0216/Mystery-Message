import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";



export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const { acceptMessages } = await request.json();
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
   
  
    const user: User = session?.user as User;
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        isAcceptingMessages: acceptMessages
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      console.log("Failed to update the user acceptingmessages");
      return Response.json(
        {
          success: false,
          message: "Failed to update the user acceptingmessages",
        },
        {
          status: 402,
        }
      );
    }
    return Response.json(
        {
          success: true,
          message: "Message accepetance updated successfully",
          updatedUser
        },
        {
          status: 200,
        }
    )
  } catch (error) {
    console.log("Failed to update the user acceptingmessages");
      return Response.json(
        {
          success: false,
          message: "Failed to update the user acceptingmessages",
        },
        {
          status: 500,
        }
      );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "User not authenticated",
      }, {
        status: 401,
      });
    }

    const userFound = await UserModel.findById((session.user as any)._id);

    if (!userFound) {
      return Response.json({
        success: false,
        message: "User not found",
      }, {
        status: 404,
      });
    }

    return Response.json({
      success: true,
      isAcceptingMessages: userFound.isAcceptingMessages,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/accept-messages error:", error);
    return Response.json({
      success: false,
      message: "Failed to get user accepting messages",
    }, {
      status: 500,
    });
  }
}
