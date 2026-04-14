-- CreateTable
CREATE TABLE "SiteContent" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE INDEX "SiteContent_updatedAt_idx" ON "SiteContent"("updatedAt");
