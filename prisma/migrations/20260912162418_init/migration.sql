-- CreateEnum
CREATE TYPE "ConditionCategory" AS ENUM ('PROCTOLOGY', 'GENERAL_SURGERY', 'UROLOGY', 'PERIPHERAL_VASCULAR');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('IN_CLINIC', 'TELECONSULT');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AnonymousCategory" AS ENUM ('STUDENT', 'WOMAN', 'IT_PROFESSIONAL', 'POLICE_DEFENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('AWARENESS', 'CONSIDERATION', 'DECISION');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('CASHLESS', 'REIMBURSEMENT', 'NONE');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('HAPPY_FACES', 'INTERIOR', 'SURGERY', 'TESTIMONIAL');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "qualifications" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "yearsExperience" INTEGER,
    "surgeriesCount" INTEGER,
    "specializations" TEXT[],
    "bioParagraphs" TEXT[],
    "philosophy" TEXT,
    "testimonialVideoUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "phone" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ConditionCategory" NOT NULL,
    "heroImageUrl" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "directAnswer" TEXT NOT NULL,
    "introText" TEXT,
    "definitionHeading" TEXT,
    "definitionText" TEXT,
    "symptoms" TEXT[],
    "causes" TEXT,
    "diagnosisProcess" TEXT,
    "treatmentOptions" JSONB,
    "whyChooseUsPoints" TEXT[],
    "recoveryInfo" TEXT,
    "closingHeading" TEXT,
    "closingText" TEXT,
    "reviewedByDoctorId" TEXT,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "doctorId" TEXT,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "anesthesiaType" TEXT,
    "hospitalStay" TEXT,
    "recoveryTimeline" JSONB,
    "successRate" TEXT,
    "costMin" INTEGER,
    "costMax" INTEGER,
    "downloadablePdfUrl" TEXT,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationLandingPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "keywordVariant" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "paragraphs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationLandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "conditionId" TEXT,
    "topic" TEXT,
    "pageContext" TEXT NOT NULL DEFAULT 'faqs-page',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "patientName" TEXT,
    "initials" TEXT,
    "quote" TEXT,
    "rating" INTEGER,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "conditionId" TEXT,
    "doctorId" TEXT,
    "anonymousCategory" "AnonymousCategory",
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "category" "MediaCategory" NOT NULL,
    "url" TEXT,
    "youtubeId" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferredDate" TIMESTAMP(3),
    "preferredTimeSlot" TEXT,
    "type" "AppointmentType" NOT NULL,
    "conditionId" TEXT,
    "doctorId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "anonymousCategory" "AnonymousCategory",
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomCheckSession" (
    "id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "urgencyResult" TEXT NOT NULL,
    "conditionGuessId" TEXT,
    "resultingAppointmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomCheckSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "body" TEXT NOT NULL,
    "excerpt" TEXT,
    "heroImageUrl" TEXT,
    "tags" TEXT[],
    "reviewedByDoctorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostEstimatorRule" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "conditionId" TEXT,
    "city" TEXT NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "costMin" INTEGER NOT NULL,
    "costMax" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostEstimatorRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "mapEmbedUrl" TEXT,
    "hours" TEXT,
    "googleBusinessUrl" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_slug_key" ON "Condition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_slug_key" ON "Procedure"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LocationLandingPage_slug_key" ON "LocationLandingPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomCheckSession_resultingAppointmentId_key" ON "SymptomCheckSession"("resultingAppointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_reviewedByDoctorId_fkey" FOREIGN KEY ("reviewedByDoctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLandingPage" ADD CONSTRAINT "LocationLandingPage_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomCheckSession" ADD CONSTRAINT "SymptomCheckSession_conditionGuessId_fkey" FOREIGN KEY ("conditionGuessId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomCheckSession" ADD CONSTRAINT "SymptomCheckSession_resultingAppointmentId_fkey" FOREIGN KEY ("resultingAppointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_reviewedByDoctorId_fkey" FOREIGN KEY ("reviewedByDoctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEstimatorRule" ADD CONSTRAINT "CostEstimatorRule_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEstimatorRule" ADD CONSTRAINT "CostEstimatorRule_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
