"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.model";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast("Success", {
        description: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      let errorMessage = "Failed to delete message";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      toast.error("Error", {
        description: errorMessage,
      });
    }
  };
  return (
    <Card className="relative bg-white shadow-md rounded-2xl border border-gray-200 p-4 transition hover:shadow-lg">
      {/* Delete button top-right */}
      <div className="absolute top-2 right-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="w-8 h-8 p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. It will permanently delete the
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Header */}
      <CardHeader className="pb-2">
        <CardDescription className="text-sm text-gray-500">
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="text-base text-gray-700">
        {message.content}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-2 text-xs text-gray-400">
        Message ID: {message._id}
      </CardFooter>
    </Card>
  );
}

export default MessageCard;
