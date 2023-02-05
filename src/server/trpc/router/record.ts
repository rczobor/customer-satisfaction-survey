import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const recordRouter = router({
  add: protectedProcedure
    .input(z.object({ questionId: z.string(), answerId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.record.create({
        data: {
          answer: {
            connect: { id: input.answerId },
          },
          question: {
            connect: { id: input.questionId },
          },
        },
      });
    }),
  addInputAnswer: protectedProcedure
    .input(z.object({ questionId: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.record.create({
        data: {
          text: input.text,
          question: {
            connect: { id: input.questionId },
          },
        },
      });
    }),
});
