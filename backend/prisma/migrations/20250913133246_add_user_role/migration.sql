/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'VIEWER');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "anomalyDetail" JSONB,
ADD COLUMN     "isAnomalous" BOOLEAN DEFAULT false,
ADD COLUMN     "riskScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'VIEWER';
