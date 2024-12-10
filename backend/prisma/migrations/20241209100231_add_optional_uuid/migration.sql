/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Form` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Form_uuid_key" ON "Form"("uuid");
