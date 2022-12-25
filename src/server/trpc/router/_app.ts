import { router } from "../trpc";
import { answerRouter } from "./answer";
import { exampleRouter } from "./example";
import { questionRouter } from "./question";

export const appRouter = router({
  example: exampleRouter,
  question: questionRouter,
  answer: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
