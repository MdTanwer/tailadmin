import { useState, useEffect } from "react";
import { StepMetadata } from "../types/hiring-flow";
import { apiGet } from "../utils/api";

interface BackendStep {
  hiringflow_steps_master_id: number;
  step_code: string;
  step_name: string;
  description: string;
  step_level: number;
  is_configurable: boolean;
  is_active: boolean;
  config: Record<string, string | number | boolean | string[]>;
  created_at: string;
}

export const useStepMetadata = () => {
  const [stepMetadata, setStepMetadata] = useState<StepMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        const response = await apiGet(
          "https://abhirebackend.onrender.com/hiringflow/steps"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch steps: ${response.status}`);
        }

        const backendSteps: BackendStep[] = await response.json();

        // Transform backend data to match StepMetadata interface
        const transformedSteps: StepMetadata[] = backendSteps
          .filter((step) => step.is_active)
          .map((step) => ({
            stepType: step.step_code,
            displayName: step.step_name,
            configFlag: step.is_configurable,
            maxOccurrence: getMaxOccurrence(step.step_code),
            defaultOrder: step.step_level,
            positionFlexible: isPositionFlexible(step.step_code),
          }));

        setStepMetadata(transformedSteps);
        setError(null);
      } catch (err) {
        console.error("Error fetching steps:", err);
        setError(err instanceof Error ? err.message : "Failed to load steps");
      } finally {
        setLoading(false);
      }
    };

    fetchSteps();
  }, []);

  // Helper function to determine max occurrence based on step type
  const getMaxOccurrence = (stepCode: string): number => {
    switch (stepCode) {
      case "INTERVIEW":
        return 5;
      case "CUSTOMER_MESSAGE":
        return 99;
      default:
        return 1;
    }
  };

  // Helper function to determine if position is flexible
  const isPositionFlexible = (stepCode: string): boolean => {
    return stepCode === "CUSTOMER_MESSAGE";
  };

  // Helper function to get metadata for a specific step type
  const getStepMetadata = (stepType: string): StepMetadata | undefined => {
    return stepMetadata.find((meta) => meta.stepType === stepType);
  };

  return {
    stepMetadata,
    loading,
    error,
    getStepMetadata,
  };
};
