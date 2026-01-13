"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@kideo/api";

export const trpc = createTRPCReact<AppRouter>();
