import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const questionRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany({
      include: { answers: true, records: true },
    });
  }),
  add: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({ data: { text: input.text } });
    }),
  addWithAnswers: publicProcedure
    .input(
      z.object({
        text: z.string(),
        answers: z.array(z.string().min(1)),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          text: input.text,
          answers: {
            create: input.answers.map((text) => ({ text })),
          },
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.delete({ where: { id: input.id } });
    }),
});
