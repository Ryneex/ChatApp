import { z } from "zod";

export const nameValidator = z.string().min(5).max(50);
