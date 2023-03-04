import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from "../../../server/db/client";
import { verify } from "argon2";
import { loginSchema } from "../../../server/common/get-server-auth-session";
import { env } from "../../../env/server.mjs";
import Credentials from "next-auth/providers/credentials";
import type { User } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session({ session, token }) {
      if (token?.user) {
        session.user = token.user as User;
      }

      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    },
  },

  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = await loginSchema.parseAsync(credentials);
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user) {
          throw new Error("No user found");
        }
        const isValid = await verify(user.password, creds.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
