import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/infrastructure/trpc";

const helloProcedure = publicProcedure
	.input(z.object({ text: z.string() }))
	.query(({ input }) => {
		return {
			greeting: `Hello ${input.text}`,
		};
	});

const getAllProcedure = publicProcedure.query(({ ctx }) => {
	return ctx.prisma.example.findMany();
});

export const exampleRouter = createTRPCRouter({
	hello: helloProcedure,
	getAll: getAllProcedure,
});

