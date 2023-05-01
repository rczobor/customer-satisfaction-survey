import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const personRouter = router({
  add: protectedProcedure
    .input(
      z.record(
        z.object({
          isInput: z.boolean(),
          answer: z.string(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      const records = Object.entries(input).map(([questionId, answer]) => {
        if (answer.isInput) {
          return {
            question: { connect: { id: questionId } },
            text: answer.answer,
            user: {
              connect: { id: ctx.session.user.id },
            },
          };
        }

        return {
          question: { connect: { id: questionId } },
          answer: { connect: { id: answer.answer } },
          user: {
            connect: { id: ctx.session.user.id },
          },
        };
      });

      return ctx.prisma.person.create({
        data: {
          records: {
            create: records,
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.person.deleteMany();
  }),
});
