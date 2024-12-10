/*
  Warnings:

  - Made the column `uuid` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "uuid" SET NOT NULL;
