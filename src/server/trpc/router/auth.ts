import { hash } from "argon2";
import { env } from "../../../env/server.mjs";
import { signUpSchema } from "../../common/get-server-auth-session";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.secret !== env.SIGNUP_SECRET) {
        throw new Error("Invalid secret");
      }

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: await hash(input.password),
        },
      });
      return user;
    }),
});
