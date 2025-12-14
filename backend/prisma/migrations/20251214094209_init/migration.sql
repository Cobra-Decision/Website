/*
  Warnings:

  - Made the column `description` on table `Route` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Route" ("createdAt", "deletedAt", "description", "id", "method", "path", "updatedAt") SELECT "createdAt", "deletedAt", "description", "id", "method", "path", "updatedAt" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE UNIQUE INDEX "Route_path_method_key" ON "Route"("path", "method");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
