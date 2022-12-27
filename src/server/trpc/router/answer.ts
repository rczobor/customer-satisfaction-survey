import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const answerRouter = router({
  add: protectedProcedure
    .input(z.object({ questionId: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: {
          text: input.text,
          question: {
            connect: { id: input.questionId },
          },
        },
      });
    }),
  updateText: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.update({
        where: { id: input.id },
        data: { text: input.text },
      });
    }),
  updateIsActive: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.delete({ where: { id: input.id } });
    }),
});
