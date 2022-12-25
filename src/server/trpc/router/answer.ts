import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const answerRouter = router({
  add: publicProcedure
    .input(z.object({ text: z.string(), questionId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.create({
        data: { text: input.text, questionId: input.questionId },
      });
    }),
  updateText: publicProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.update({
        where: { id: input.id },
        data: { text: input.text },
      });
    }),
  updateIsActive: publicProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.answer.delete({ where: { id: input.id } });
    }),
});
