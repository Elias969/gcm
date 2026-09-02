import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createStudyReview, createStudySubject, listStudyReviews, listStudySubjects } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  study: router({
    subjects: protectedProcedure.query(({ ctx }) => listStudySubjects(ctx.user.id)),
    reviews: protectedProcedure.query(({ ctx }) => listStudyReviews(ctx.user.id)),
    createSubject: protectedProcedure.input(z.object({ name: z.string().min(1).max(120), weeklyMinutes: z.number().int().nonnegative(), color: z.string().max(20).optional() })).mutation(({ ctx, input }) => createStudySubject({ ...input, userId: ctx.user.id })),
    createReview: protectedProcedure.input(z.object({ title: z.string().min(1).max(180), subject: z.string().min(1).max(120), difficulty: z.enum(["easy", "medium", "hard"]), scheduledFor: z.date() })).mutation(({ ctx, input }) => createStudyReview({ ...input, userId: ctx.user.id })),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
