import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const answerRouter = router({
  add: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { _count: answerCount } = await ctx.prisma.answer.aggregate({
        _count: true,
        where: { questionId: input.questionId },
      });

      return ctx.prisma.answer.create({
        data: {
          text: "",
          isActive: false,
          index: answerCount,
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
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.answer.delete({ where: { id: input.id } });
      await ctx.prisma.answer.updateMany({
        where: { index: { gt: input.index } },
        data: { index: { decrement: 1 } },
      });
    }),
  moveUpByIndex: protectedProcedure
    .input(
      z.object({ questionId: z.string(), id: z.string(), index: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.answer.update({
        where: { id: input.id },
        data: { index: { decrement: 1 } },
      });
      await ctx.prisma.answer.updateMany({
        where: {
          AND: [
            { questionId: input.questionId },
            { index: input.index - 1 },
            { id: { not: input.id } },
          ],
        },
        data: { index: { increment: 1 } },
      });
    }),
  moveDownByIndex: protectedProcedure
    .input(
      z.object({ questionId: z.string(), id: z.string(), index: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.answer.update({
        where: { id: input.id },
        data: { index: { increment: 1 } },
      });
      await ctx.prisma.answer.updateMany({
        where: {
          AND: [
            { questionId: input.questionId },
            { index: input.index + 1 },
            { id: { not: input.id } },
          ],
        },
        data: { index: { decrement: 1 } },
      });
    }),
});
