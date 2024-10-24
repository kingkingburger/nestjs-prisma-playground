/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `PostRecommendation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostRecommendation_userId_postId_key" ON "PostRecommendation"("userId", "postId");
