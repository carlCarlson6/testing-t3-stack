import NextAuth from "next-auth";
import { authOptions } from "~/server/infrastructure/auth/next-auth";

export default NextAuth(authOptions);
