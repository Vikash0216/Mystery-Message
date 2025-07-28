"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Mystry Message
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-700 font-medium">
              Welcome {user?.userName || user?.email || "Guest"}
            </span>
            <Button onClick={() => signOut()} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
