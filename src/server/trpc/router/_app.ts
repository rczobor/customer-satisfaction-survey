import { router } from "../trpc";
import { answerRouter } from "./answer";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { personRouter } from "./person";
import { questionRouter } from "./question";
import { recordRouter } from "./record";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  question: questionRouter,
  answer: answerRouter,
  record: recordRouter,
  person: personRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
