import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    _id?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    userName?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isAcceptingMessages?: boolean;
      isVerified?: boolean;
      userName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    userName?: string;
  }
}
