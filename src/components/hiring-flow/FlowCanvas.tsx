import React, { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import {
  FlowStep,
  StepMetadata,
  DragItem,
  ValidationError,
} from "../../types/hiring-flow";
import { HiringFlowValidator } from "../../utils/hiring-flow-validation";
import StepCard from "./StepCard";

interface FlowCanvasProps {
  steps: FlowStep[];
  onAddStep: (stepType: string, metadata: StepMetadata) => void;
  onDeleteStep: (stepId: string) => void;
  onStepClick: (step: FlowStep) => void;
  validationErrors: ValidationError[];
  getStepMetadata: (stepType: string) => StepMetadata | undefined;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  steps,
  onAddStep,
  onDeleteStep,
  onStepClick,
  validationErrors,
  getStepMetadata,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "STEP",
      drop: (item: DragItem, monitor) => {
        // Ensure we have a valid drop
        if (!monitor.didDrop()) {
          // Check if it's a new step from the palette or existing step being reordered
          if ("flowStep" in item) {
            // Existing step being moved - handle reordering logic here if needed
            console.log("Reordering existing step:", item.flowStep);
            return;
          } else {
            // New step from palette
            if (
              HiringFlowValidator.canAddStep(
                steps,
                item.stepType,
                getStepMetadata
              )
            ) {
              onAddStep(item.stepType, item.metadata);
            }
          }
        }
      },
      canDrop: (item: DragItem) => {
        if ("flowStep" in item) {
          return true; // Allow reordering existing steps
        }
        return HiringFlowValidator.canAddStep(
          steps,
          item.stepType,
          getStepMetadata
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [steps, onAddStep, getStepMetadata]
  );

  // Connect the drop ref
  useEffect(() => {
    if (canvasRef.current) {
      drop(canvasRef);
    }
  }, [drop]);

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  const getStepErrors = (stepId: string) => {
    return validationErrors.filter((error) => error.stepId === stepId);
  };

  const getCanvasClasses = () => {
    let classes =
      "min-h-[500px] p-6 border-2 border-dashed rounded-lg transition-all duration-200 ";

    if (isOver && canDrop) {
      classes += "border-brand-400 bg-brand-25 dark:bg-brand-950 ";
    } else if (isOver && !canDrop) {
      classes += "border-error-400 bg-error-25 dark:bg-error-950 ";
    } else {
      classes +=
        "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 ";
    }

    return classes;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="  px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex justify-between">
          <div className="p-6">
            {" "}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Flow Canvas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag steps from the left panel to build your hiring flow
            </p>
          </div>
          <div>
            {" "}
            <div className="p-4 bg-brand-50 dark:bg-brand-950 rounded-lg">
              <h4 className="text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                Flow Statistics
              </h4>
              <div className="text-xs text-brand-600 dark:text-brand-400 space-y-1">
                <div>Total Steps: {steps.length}</div>
                <div>
                  Configured Steps:{" "}
                  {
                    steps.filter((step) => Object.keys(step.config).length > 0)
                      .length
                  }
                </div>
                <div>
                  Flexible Steps:{" "}
                  {
                    steps.filter((step) => {
                      const meta = getStepMetadata(step.stepType);
                      return meta?.positionFlexible;
                    }).length
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div ref={canvasRef} className={getCanvasClasses()}>
          {steps.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start Building Your Flow
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag steps from the left panel to create your hiring process
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Flow Steps */}
              {sortedSteps.map((step, index) => {
                const metadata = getStepMetadata(step.stepType);
                const stepErrors = getStepErrors(step.id);
                const hasErrors = stepErrors.length > 0;

                return (
                  <div key={step.id} className="relative  w-90  mx-auto ">
                    {/* Step Number */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Step {index + 1}
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="ml-11">
                      {metadata && (
                        <StepCard
                          metadata={metadata}
                          isInFlow={true}
                          flowStep={step}
                          onClick={() => onStepClick(step)}
                          onDelete={() => onDeleteStep(step.id)}
                          hasConfigError={hasErrors}
                          getStepMetadata={getStepMetadata}
                        />
                      )}

                      {/* Error Messages */}
                      {hasErrors && (
                        <div className="mt-2 p-3 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 rounded-md">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-error-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-error-800 dark:text-error-200">
                                Validation Errors
                              </h4>
                              <ul className="mt-1 text-sm text-error-700 dark:text-error-300 list-disc list-inside">
                                {stepErrors.map((error, errorIndex) => (
                                  <li key={errorIndex}>{error.message}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < sortedSteps.length - 1 && (
                      <div className="flex items-center justify-center my-4">
                        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="absolute bg-gray-50 dark:bg-gray-800 px-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Drop Zone Indicator */}
              {isOver && (
                <div
                  className={`p-4 border-2 border-dashed rounded-lg ${
                    canDrop
                      ? "border-brand-400 bg-brand-25 dark:bg-brand-950"
                      : "border-error-400 bg-error-25 dark:bg-error-950"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{canDrop ? "✅" : "❌"}</div>
                    <p
                      className={`text-sm font-medium ${
                        canDrop
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-error-600 dark:text-error-400"
                      }`}
                    >
                      {canDrop
                        ? "Drop here to add step"
                        : "Cannot add this step"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowCanvas;
