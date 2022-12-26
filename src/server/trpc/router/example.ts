import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const exampleRouter = router({
  hello: protectedProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  add: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.example.create({ data: {} });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.example.delete({ where: { id: input.id } });
    }),
});
