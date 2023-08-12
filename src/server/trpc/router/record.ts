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
          user: {
            connect: { id: ctx.session.user.id },
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
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  deleteAll: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.record.deleteMany();
  }),
  getAllForQuestion: protectedProcedure
    .input(z.object({ questionId: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.questionId) {
        return null;
      }

      return ctx.prisma.record.findMany({
        where: {
          questionId: input.questionId,
        },
        include: {
          answer: true,
          question: true,
        },
      });
    }),
});
