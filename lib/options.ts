import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import userModel from "@/models/user-model";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Enter your name" },
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (
          !credentials?.name ||
          !credentials?.email ||
          !credentials?.password
        ) {
          throw new Error("Name, Email, and Password is required");
        }

        try {
          await db();
          let user = await userModel.findOne({ email: credentials?.email });
          if (!user) throw new Error("No user found");
          let isMatch = await bcrypt.compare(
            credentials?.password,
            user?.password
          );

          if (!isMatch) {
            throw new Error("Invalid Password");
          }

          return {
            id: user?._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token,user}) {
        if(user) {
            token.id = user.id 
        }
        return token
    },
    async session({session,token}) {
        if(session.user) {
            session.user.id = token.id as string
        }

        return session
    }
  },
  pages: {
    signIn:"/signIn",
    error: "/signIn",

  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
