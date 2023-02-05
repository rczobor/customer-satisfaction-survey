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
  add: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({ data: { text: input.text } });
    }),
  addWithAnswers: protectedProcedure
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
    updateIsInput: protectedProcedure
    .input(z.object({ id: z.string(), isInput: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { isInput: input.isInput },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.delete({ where: { id: input.id } });
    }),
});
