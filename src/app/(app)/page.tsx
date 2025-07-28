"use client";
import Message from "../../../src/message.json";
import { useRef, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Autoplay, { AutoplayType } from "embla-carousel-autoplay";

export default function Home() {
  const [showDialogBox, setShowDialogBox] = useState(false);
  const { data: session } = useSession();
  const pluginRef = useRef<AutoplayType | null>(null);

  useEffect(() => {
    if (!session || !session.user) {
      const timer = setTimeout(() => {
        setShowDialogBox(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);
  const [pluginReady, setPluginReady] = useState(false);

  useEffect(() => {
    pluginRef.current = Autoplay({ delay: 2000, stopOnInteraction: true });
    setPluginReady(true);
  }, []);

  if (!pluginReady) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Mystery Messages</h1>
        <p className="text-gray-400 text-sm mt-2">
          Swipe through anonymous messages shared by users around the world.
        </p>
      </div>
      <AlertDialog open={showDialogBox} onOpenChange={setShowDialogBox}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <p>Hasn&#39;t signed up yet</p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sign in an get into this awesome world
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Link href={"/sign-up"}>Sign-up Now</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Carousel
        plugins={pluginRef.current ? [pluginRef.current] : []}
        onMouseEnter={() => pluginRef.current?.stop?.()}
        onMouseLeave={() => pluginRef.current?.reset?.()}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {Message.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader className="text-base font-semibold text-gray-300">
                    {message.userName}
                  </CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl text-center font-medium text-white">
                      {message.textMessage}
                    </span>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-400">
                    {new Date(message.time)
                      .toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })
                      .replace("AM", "am")
                      .replace("PM", "pm")}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <footer className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mystery Messages. Made with ❤️ by Vikash.
      </footer>
    </div>
  );
}
