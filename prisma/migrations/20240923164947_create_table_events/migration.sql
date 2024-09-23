-- CreateTable
CREATE TABLE "events" (
    "eventId" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(600),
    "linkEvent" VARCHAR(255),
    "street" VARCHAR(120) NOT NULL,
    "number" VARCHAR(8) NOT NULL,
    "neighborhood" VARCHAR(20) NOT NULL,
    "complement" VARCHAR(30),
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventId")
);
