-- CreateTable
CREATE TABLE "solutions" (
    "id" TEXT NOT NULL,
    "titleSolution" TEXT NOT NULL,
    "valueSolution" DOUBLE PRECISION NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compositions" (
    "id" TEXT NOT NULL,
    "titleComposition" TEXT NOT NULL,
    "valueComposition" DOUBLE PRECISION NOT NULL,
    "solutionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "compositions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "compositions" ADD CONSTRAINT "compositions_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "solutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
