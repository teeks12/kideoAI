import { router } from "./trpc";
import { familyRouter } from "./routers/family";
import { kidRouter } from "./routers/kid";
import { taskRouter } from "./routers/task";
import { completionRouter } from "./routers/completion";
import { templateRouter } from "./routers/template";
import { rewardRouter } from "./routers/reward";
import { redemptionRouter } from "./routers/redemption";

/**
 * Root tRPC router
 * All routers should be merged here
 */
export const appRouter = router({
  family: familyRouter,
  kid: kidRouter,
  task: taskRouter,
  completion: completionRouter,
  template: templateRouter,
  reward: rewardRouter,
  redemption: redemptionRouter,
});

/**
 * Export type definition of API
 */
export type AppRouter = typeof appRouter;
