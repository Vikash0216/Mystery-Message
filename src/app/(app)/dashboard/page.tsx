"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessagrSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const handleDeleteMessage = (messageId: string) => {
    console.log("Deleting message:", messageId);
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      isAcceptingMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("isAcceptingMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue(
        "isAcceptingMessages",
        response.data.isAcceptingMessages ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(`${axiosError.response?.data.message}`, {
        description: "Failed to fetch message setting",
        dismissible: true,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast(`${axiosError.response?.data.message}`, {
          description: "Failed to fetch message setting",
          dismissible: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [fetchAcceptMessage, fetchMessages, session, setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessages: !acceptMessages,
      });
      console.log(response);

      setValue("isAcceptingMessages", !acceptMessages);

      toast(`${response?.data.message}`, {
        closeButton: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(`${axiosError.response?.data.message}`, {
        description: "Failed to switch accept message",
        dismissible: true,
      });
    }
  };

  useEffect(() => {
    if (session?.user?.userName && typeof window !== "undefined") {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${session.user.userName}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Copied", {
      duration: 300,
    });
  };
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

        <div className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold">Your unique message link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 px-4 py-2 border rounded-lg text-sm bg-gray-800 text-white border-gray-700"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Switch
            {...register("isAcceptingMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="h-6 w-11 rounded-full relative transition-colors duration-300 
             bg-gray-600 data-[state=checked]:bg-green-500 border border-gray-700"
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
               translate-x-0.5 data-[state=checked]:translate-x-5`}
            />
          </Switch>

          <span className="text-sm font-medium">
            Accept Messages:{" "}
            <span
              className={`font-bold ${acceptMessages ? "text-green-400" : "text-red-400"}`}
            >
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>

        <Separator className="mb-6 bg-gray-700" />

        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="text-black hover:text-white border-gray-600 hover:bg-gray-800"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCcw className="mr-2" />
            )}
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center">
              No messages to display
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
