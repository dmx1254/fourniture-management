import UserPMN from "@/lib/models/user";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/actions/db";

connectDB();

export const options: NextAuthOptions = {
  pages: {
    signIn: "/pmn-signin",
    signOut: "/",
    newUser: "/pmn-signup",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (credentials) {
          const isUserExist = await UserPMN.findOne({
            email: credentials.email,
          });
          if (!isUserExist) {
            throw new Error("Adresse E-mail incorrect");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            isUserExist.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: isUserExist._id.toString(),
            email: isUserExist.email,
            phone: isUserExist.phone,
            firstname: isUserExist.firstname,
            lastname: isUserExist.lastname,
            occupation: isUserExist.occupation,
            identicationcode: isUserExist.identicationcode,
            role: isUserExist.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.occupation = user.occupation;
        token.identicationcode = user.identicationcode;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.occupation = token.occupation as string;
        session.user.identicationcode = token.identicationcode as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
