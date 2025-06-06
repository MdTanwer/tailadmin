import {
  FlowStep,
  ValidationError,
  HiringFlow,
  StepMetadata,
} from "../types/hiring-flow";

export class HiringFlowValidator {
  static validateFlow(
    flow: HiringFlow,
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate ordering
    errors.push(...this.validateOrdering(flow.steps, getStepMetadata));

    // Validate step occurrences
    errors.push(...this.validateOccurrences(flow.steps, getStepMetadata));

    // Validate required configurations
    errors.push(...this.validateConfigurations(flow.steps, getStepMetadata));

    return errors;
  }

  private static validateOrdering(
    steps: FlowStep[],
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    for (let i = 0; i < sortedSteps.length - 1; i++) {
      const currentStep = sortedSteps[i];
      const nextStep = sortedSteps[i + 1];

      if (currentStep.order >= nextStep.order) {
        errors.push({
          type: "ordering",
          message: `Step "${currentStep.customName}" has invalid order. Steps must be in ascending order.`,
          stepId: currentStep.id,
        });
      }

      // Check position flexibility rules
      const currentMeta = getStepMetadata(currentStep.stepType);
      const nextMeta = getStepMetadata(nextStep.stepType);

      if (
        currentMeta &&
        nextMeta &&
        !currentMeta.positionFlexible &&
        !nextMeta.positionFlexible
      ) {
        if (currentMeta.defaultOrder > nextMeta.defaultOrder) {
          errors.push({
            type: "ordering",
            message: `"${currentStep.customName}" cannot come before "${nextStep.customName}" due to fixed positioning rules.`,
            stepId: currentStep.id,
          });
        }
      }
    }

    return errors;
  }

  private static validateOccurrences(
    steps: FlowStep[],
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const stepCounts = new Map<string, number>();

    // Count occurrences of each step type
    steps.forEach((step) => {
      const count = stepCounts.get(step.stepType) || 0;
      stepCounts.set(step.stepType, count + 1);
    });

    // Check against max occurrences
    stepCounts.forEach((count, stepType) => {
      const metadata = getStepMetadata(stepType);
      if (metadata && count > metadata.maxOccurrence) {
        const affectedSteps = steps.filter((s) => s.stepType === stepType);
        affectedSteps.forEach((step) => {
          errors.push({
            type: "occurrence",
            message: `Too many "${metadata.displayName}" steps. Maximum allowed: ${metadata.maxOccurrence}`,
            stepId: step.id,
          });
        });
      }
    });

    return errors;
  }

  private static validateConfigurations(
    steps: FlowStep[],
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    steps.forEach((step) => {
      const metadata = getStepMetadata(step.stepType);
      if (metadata && metadata.configFlag) {
        if (!step.config || Object.keys(step.config).length === 0) {
          // Skip validation for completely empty config - user hasn't configured yet
          // This avoids showing errors for steps that are newly added
        } else {
          // Validate specific configurations based on step type
          const configErrors = this.validateStepSpecificConfig(step);
          errors.push(...configErrors);
        }
      }
    });

    return errors;
  }

  private static validateStepSpecificConfig(step: FlowStep): ValidationError[] {
    const errors: ValidationError[] = [];

    // Generic validation based on config structure
    const validateConfigValue = (
      key: string,
      value: string | number | boolean | string[] | Record<string, unknown>
    ): void => {
      if (value === null || value === undefined) {
        return; // Skip null/undefined values
      }

      if (typeof value === "string") {
        // Check if string is empty or just whitespace
        if (value.trim() === "") {
          errors.push({
            type: "config",
            message: `"${step.customName}" ${key.replace(
              /_/g,
              " "
            )} cannot be empty.`,
            stepId: step.id,
          });
        }
      } else if (typeof value === "number") {
        // Check if number is valid (not negative for certain fields)
        if (value <= 0) {
          errors.push({
            type: "config",
            message: `"${step.customName}" ${key.replace(
              /_/g,
              " "
            )} must be greater than 0.`,
            stepId: step.id,
          });
        }
      } else if (Array.isArray(value)) {
        // Check if array is empty
        if (value.length === 0) {
          errors.push({
            type: "config",
            message: `"${step.customName}" must have at least one ${key
              .replace(/_/g, " ")
              .replace(/s$/, "")} selected.`,
            stepId: step.id,
          });
        } else {
          // Validate each item in the array
          value.forEach((item, index) => {
            if (typeof item === "string" && item.trim() === "") {
              errors.push({
                type: "config",
                message: `"${step.customName}" ${key.replace(/_/g, " ")} item ${
                  index + 1
                } cannot be empty.`,
                stepId: step.id,
              });
            }
          });
        }
      } else if (typeof value === "object" && value !== null) {
        // Recursively validate nested objects
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          validateConfigValue(
            `${key}.${nestedKey}`,
            nestedValue as
              | string
              | number
              | boolean
              | string[]
              | Record<string, unknown>
          );
        });
      }
      // Boolean values are always valid, no validation needed
    };

    // Validate all config entries
    Object.entries(step.config).forEach(([key, value]) => {
      validateConfigValue(key, value);
    });

    return errors;
  }

  static canAddStep(
    steps: FlowStep[],
    stepType: string,
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): boolean {
    const metadata = getStepMetadata(stepType);
    if (!metadata) return false;

    const currentCount = steps.filter((s) => s.stepType === stepType).length;
    return currentCount < metadata.maxOccurrence;
  }

  static suggestOrder(
    steps: FlowStep[],
    stepType: string,
    getStepMetadata: (stepType: string) => StepMetadata | undefined
  ): number {
    const metadata = getStepMetadata(stepType);
    if (!metadata) return 100;

    if (metadata.positionFlexible) {
      // For flexible steps, find a good spot based on existing steps
      const orders = steps.map((s) => s.order).sort((a, b) => a - b);
      if (orders.length === 0) return 10;

      // Try to insert at a reasonable position
      for (let i = 0; i < orders.length - 1; i++) {
        const gap = orders[i + 1] - orders[i];
        if (gap > 1) {
          return orders[i] + Math.floor(gap / 2);
        }
      }

      // Add at the end
      return orders[orders.length - 1] + 10;
    } else {
      // For fixed steps, use default order or find appropriate position
      const existingOrders = steps.map((s) => s.order);
      let suggestedOrder = metadata.defaultOrder;

      // Ensure the order doesn't conflict
      while (existingOrders.includes(suggestedOrder)) {
        suggestedOrder += 1;
      }

      return suggestedOrder;
    }
  }
}
