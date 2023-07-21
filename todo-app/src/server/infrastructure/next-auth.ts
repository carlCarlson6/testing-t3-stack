import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs";
import { prisma } from "~/server/infrastructure/prisma";

declare module "next-auth" {
  	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
	  		id: string;
		};
  	}
}

export const authOptions: NextAuthOptions = {
  	callbacks: {
		session: ({ session, user }) => ({
	  		...session,
	  		user: {
				...session.user,
				id: user.id,
	  		},
		}),
  	},
  	adapter: PrismaAdapter(prisma),
  	providers: [
		DiscordProvider({
	  		clientId: env.DISCORD_CLIENT_ID,
	  		clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
  ],
};

export const getServerAuthSession = (ctx: {
  	req: GetServerSidePropsContext["req"];
  	res: GetServerSidePropsContext["res"];
}) => getServerSession(ctx.req, ctx.res, authOptions);
