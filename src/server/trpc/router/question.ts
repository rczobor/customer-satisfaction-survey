import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const questionRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany({
      orderBy: { index: "asc" },
      include: {
        answers: {
          orderBy: { index: "asc" },
        },
      },
    });
  }),
  getByIndex: protectedProcedure
    .input(z.object({ index: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const [result, next] = await ctx.prisma.question.findMany({
        orderBy: { index: "asc" },
        where: { isActive: true, index: { gte: input.index } },
        include: {
          answers: {
            orderBy: { index: "asc" },
            where: { isActive: true },
          },
        },
        take: 2,
      });

      return { result, nextIndex: next?.index };
    }),
  addWithAnswers: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        answers: z.array(z.string().min(1)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { _count: questionCount } = await ctx.prisma.question.aggregate({
        _count: true,
      });

      return ctx.prisma.question.create({
        data: {
          text: input.text,
          index: questionCount,
          answers: {
            create: input.answers.map((text, index) => ({ text, index })),
          },
        },
      });
    }),
  updateText: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { text: input.text },
      });
    }),
  updateIsActive: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { isActive: input.isActive },
      });
    }),
  updateIsDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { isInput: false, isSmiley: false },
      });
    }),
  makeInput: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { isInput: true, isSmiley: false },
      });
    }),
  makeSmiley: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { isSmiley: true, isInput: false },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.delete({ where: { id: input.id } });
      await ctx.prisma.question.updateMany({
        where: { index: { gt: input.index } },
        data: { index: { decrement: 1 } },
      });
    }),
  moveUpByIndex: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.update({
        where: { id: input.id },
        data: { index: { decrement: 1 } },
      });
      await ctx.prisma.question.updateMany({
        where: {
          AND: [{ index: input.index - 1 }, { id: { not: input.id } }],
        },
        data: { index: { increment: 1 } },
      });
    }),
  moveDownByIndex: protectedProcedure
    .input(z.object({ id: z.string(), index: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.update({
        where: { id: input.id },
        data: { index: { increment: 1 } },
      });
      await ctx.prisma.question.updateMany({
        where: {
          AND: [{ index: input.index + 1 }, { id: { not: input.id } }],
        },
        data: { index: { decrement: 1 } },
      });
    }),
});
