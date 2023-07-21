import NextAuth from "next-auth";
import { authOptions } from "~/server/infrastructure/next-auth";

export default NextAuth(authOptions);
