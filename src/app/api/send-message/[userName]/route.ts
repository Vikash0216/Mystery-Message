import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { messgeSchema } from "@/schemas/messageSchema";

export async function POST(request: Request, { params }: { params: { userName: string } }) {
  const { userName } = params;

  const body = await request.json();

  const parseResult = messgeSchema.safeParse(body);
  if (!parseResult.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid input",
        errors: parseResult.error.format(),
      },
      { status: 400 }
    );
  }

  const { content } = parseResult.data;

  if (!userName) {
    return Response.json(
      {
        success: false,
        message: "Username is empty",
      },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid username",
        },
        { status: 404 }
      );
    }

    if(!user.isAcceptingMessages){
       return Response.json(
        {
          success: false,
          message: "User is currently not accepting messages",
        },
        { status: 400 }
      );
    }

    const updatedMessages = await UserModel.updateOne(
      { _id: user._id },
      { $push: { messages: {
        content:content
      } } }
    );

    if (updatedMessages.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Failed to update messages",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
