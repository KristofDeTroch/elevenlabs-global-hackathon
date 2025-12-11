-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentLinkUrl" TEXT,
ADD COLUMN     "stripeCheckoutSessionId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePaymentLinkId" TEXT,
ALTER COLUMN "scheduledDate" DROP NOT NULL;
