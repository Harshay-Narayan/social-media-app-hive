import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  String(process.env.SUPABASE_URL),
  String(process.env.SUPABASE_ANON_KEY)
);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
