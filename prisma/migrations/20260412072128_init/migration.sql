-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "guests" INTEGER NOT NULL,
    "dateFrom" DATETIME NOT NULL,
    "dateTo" DATETIME,
    "time" TEXT,
    "comment" TEXT,
    "telegramStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "telegramError" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "emailError" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Booking_service_idx" ON "Booking"("service");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_dateFrom_idx" ON "Booking"("dateFrom");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
