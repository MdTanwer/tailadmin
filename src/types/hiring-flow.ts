export interface StepMetadata {
  stepType: string;
  displayName: string;
  configFlag: boolean;
  maxOccurrence: number;
  defaultOrder: number;
  positionFlexible: boolean;
}

export interface FlowStep {
  stepType: string;
  customName: string;
  order: number;
  config: Record<string, string | number | boolean>;
  id: string; // Unique identifier for drag-and-drop
}

export interface HiringFlow {
  flowName: string;
  description: string;
  steps: FlowStep[];
}

export interface ValidationError {
  type: "ordering" | "occurrence" | "config" | "required";
  message: string;
  stepId?: string;
}

export interface DragItem {
  type: "STEP";
  stepType: string;
  metadata: StepMetadata;
}
