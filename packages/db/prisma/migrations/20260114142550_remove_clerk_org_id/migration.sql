-- DropIndex
DROP INDEX "Family_clerkOrgId_idx";

-- DropIndex
DROP INDEX "Family_clerkOrgId_key";

-- AlterTable
ALTER TABLE "Family" DROP COLUMN "clerkOrgId";
