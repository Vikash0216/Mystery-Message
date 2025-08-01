import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User is not registered ");
          }
          if (!user.isVerified) {
            throw new Error(
              "User is not verified yet Please verify your email before login"
            );
          }
          const isPasswordverified = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordverified) {
            throw new Error("Password is incorrect ");
          }
          return user;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.userName = user.userName;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      session.user.userName = token.userName;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessages = token.isAcceptingMessages;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
