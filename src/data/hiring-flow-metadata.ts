import { StepMetadata } from "../types/hiring-flow";

export const STEP_METADATA: StepMetadata[] = [
  {
    stepType: "CREATE_JOB_POST",
    displayName: "Create Job Post",
    configFlag: false,
    maxOccurrence: 1,
    defaultOrder: 10,
    positionFlexible: false,
  },
  {
    stepType: "UPLOAD_CV",
    displayName: "Upload CV",
    configFlag: false,
    maxOccurrence: 1,
    defaultOrder: 20,
    positionFlexible: false,
  },
  {
    stepType: "SEND_JD_TO_CANDIDATE",
    displayName: "Send JD to Candidate",
    configFlag: false,
    maxOccurrence: 1,
    defaultOrder: 30,
    positionFlexible: false,
  },
  {
    stepType: "SCREENING_CALL",
    displayName: "Screening Call",
    configFlag: false,
    maxOccurrence: 1,
    defaultOrder: 40,
    positionFlexible: false,
  },
  {
    stepType: "INTERVIEW",
    displayName: "Interview",
    configFlag: false,
    maxOccurrence: 5,
    defaultOrder: 50,
    positionFlexible: false,
  },
  {
    stepType: "POST_INTERVIEW_ASSIGNMENT",
    displayName: "Post Interview Assignment",
    configFlag: false,
    maxOccurrence: 1,
    defaultOrder: 60,
    positionFlexible: false,
  },
  {
    stepType: "OFFER_LETTER",
    displayName: "Offer Letter",
    configFlag: true,
    maxOccurrence: 1,
    defaultOrder: 70,
    positionFlexible: false,
  },
  {
    stepType: "BACKGROUND_VERIFICATION",
    displayName: "Background Verification",
    configFlag: true,
    maxOccurrence: 1,
    defaultOrder: 80,
    positionFlexible: false,
  },
  {
    stepType: "CUSTOM_MESSAGE",
    displayName: "Custom Message",
    configFlag: true,
    maxOccurrence: 99,
    defaultOrder: 0,
    positionFlexible: true,
  },
];

export const getStepMetadata = (stepType: string): StepMetadata | undefined => {
  return STEP_METADATA.find((meta) => meta.stepType === stepType);
};
