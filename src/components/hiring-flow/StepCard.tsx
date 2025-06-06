import React, { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { StepMetadata, FlowStep } from "../../types/hiring-flow";
import { HiringFlowValidator } from "../../utils/hiring-flow-validation";

interface StepCardProps {
  metadata: StepMetadata;
  existingSteps?: FlowStep[];
  isInFlow?: boolean;
  flowStep?: FlowStep;
  onClick?: () => void;
  onDelete?: () => void;
  hasConfigError?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  metadata,
  existingSteps = [],
  isInFlow = false,
  flowStep,
  onClick,
  onDelete,
  hasConfigError = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const canAdd =
    !isInFlow &&
    HiringFlowValidator.canAddStep(existingSteps, metadata.stepType);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "STEP",
      item: () => ({
        type: "STEP",
        stepType: metadata.stepType,
        metadata,
        ...(isInFlow && flowStep ? { flowStep } : {}),
      }),
      canDrag: isInFlow || canAdd,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [metadata, canAdd, isInFlow, flowStep]
  );

  // Connect the drag ref
  useEffect(() => {
    if (cardRef.current) {
      drag(cardRef);
    }
  }, [drag]);

  const getStepIcon = (stepType: string) => {
    const iconMap: Record<string, string> = {
      CREATE_JOB_POST: "📝",
      UPLOAD_CV: "📄",
      SEND_JD_TO_CANDIDATE: "📧",
      SCREENING_CALL: "📞",
      INTERVIEW: "👥",
      POST_INTERVIEW_ASSIGNMENT: "📋",
      OFFER_LETTER: "💼",
      BACKGROUND_VERIFICATION: "🔍",
      CUSTOM_MESSAGE: "💬",
    };
    return iconMap[stepType] || "📌";
  };

  const getCardClasses = () => {
    let baseClasses =
      "relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ";

    if (isDragging) {
      baseClasses += "opacity-50 ";
    }

    if (isInFlow) {
      baseClasses +=
        "bg-white dark:bg-gray-800 border-brand-200 dark:border-brand-700 ";
      if (hasConfigError) {
        baseClasses += "border-error-500 bg-error-25 dark:bg-error-950 ";
      }
      if (onClick) {
        baseClasses += "hover:border-brand-400 hover:shadow-md ";
      }
    } else {
      if (canAdd) {
        baseClasses +=
          "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:bg-brand-25 dark:hover:bg-brand-950 ";
      } else {
        baseClasses +=
          "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60 cursor-not-allowed ";
      }
    }

    return baseClasses;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click when dragging or if disabled
    if (isDragging || (!isInFlow && !canAdd)) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    <div ref={cardRef} className={getCardClasses()} onClick={handleClick}>
      {/* Step Icon and Name */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{getStepIcon(metadata.stepType)}</span>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {isInFlow && flowStep ? flowStep.customName : metadata.displayName}
          </h4>
          {isInFlow && flowStep && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Order: {flowStep.order}
            </p>
          )}
        </div>
      </div>

      {/* Configuration Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {metadata.configFlag && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                hasConfigError
                  ? "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                  : isInFlow &&
                    flowStep &&
                    Object.keys(flowStep.config).length > 0
                  ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                  : "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
              }`}
            >
              {hasConfigError
                ? "⚠️ Config"
                : metadata.configFlag
                ? "⚙️ Config"
                : ""}
            </span>
          )}

          {metadata.positionFlexible && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-light-100 text-blue-light-800 dark:bg-blue-light-900 dark:text-blue-light-200">
              📍 Flexible
            </span>
          )}
        </div>

        {/* Max Occurrence Indicator */}
        {!isInFlow && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Max: {metadata.maxOccurrence === 99 ? "∞" : metadata.maxOccurrence}
          </span>
        )}
      </div>

      {/* Delete Button for Flow Steps */}
      {isInFlow && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error-500 text-white hover:bg-error-600 flex items-center justify-center text-xs transition-colors"
        >
          ×
        </button>
      )}

      {/* Disabled Overlay */}
      {!isInFlow && !canAdd && (
        <div className="absolute inset-0 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded">
            Limit Reached
          </span>
        </div>
      )}
    </div>
  );
};

export default StepCard;
