-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "hotelSlug" TEXT;
ALTER TABLE "Booking" ADD COLUMN "roomCategorySlug" TEXT;

-- CreateIndex
CREATE INDEX "Booking_hotelSlug_idx" ON "Booking"("hotelSlug");

-- CreateIndex
CREATE INDEX "Booking_roomCategorySlug_idx" ON "Booking"("roomCategorySlug");
