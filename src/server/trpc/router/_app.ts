import { router } from "../trpc";
import { exampleRouter } from "./example";
import { questionRouter } from "./question";

export const appRouter = router({
  example: exampleRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
