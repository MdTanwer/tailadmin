import React from "react";
import { STEP_METADATA } from "../../data/hiring-flow-metadata";
import { FlowStep } from "../../types/hiring-flow";
import StepCard from "./StepCard";

interface StepPaletteProps {
  existingSteps: FlowStep[];
}

const StepPalette: React.FC<StepPaletteProps> = ({ existingSteps }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Available Steps
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag steps to the canvas to build your hiring flow
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Fixed Position Steps */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Fixed Position Steps
            </h3>
            <div className="space-y-3">
              {STEP_METADATA.filter((meta) => !meta.positionFlexible)
                .sort((a, b) => a.defaultOrder - b.defaultOrder)
                .map((metadata) => (
                  <StepCard
                    key={metadata.stepType}
                    metadata={metadata}
                    existingSteps={existingSteps}
                  />
                ))}
            </div>
          </div>

          {/* Flexible Position Steps */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-light-500 rounded-full mr-2"></span>
              Flexible Position Steps
            </h3>
            <div className="space-y-3">
              {STEP_METADATA.filter((meta) => meta.positionFlexible).map(
                (metadata) => (
                  <StepCard
                    key={metadata.stepType}
                    metadata={metadata}
                    existingSteps={existingSteps}
                  />
                )
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Legend
            </h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200 mr-2">
                  ⚙️ Config
                </span>
                Requires configuration
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-light-100 text-blue-light-800 dark:bg-blue-light-900 dark:text-blue-light-200 mr-2">
                  📍 Flexible
                </span>
                Can be placed anywhere
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Max: ∞</span>
                Unlimited occurrences
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="p-4 bg-brand-50 dark:bg-brand-950 rounded-lg">
            <h4 className="text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
              Flow Statistics
            </h4>
            <div className="text-xs text-brand-600 dark:text-brand-400 space-y-1">
              <div>Total Steps: {existingSteps.length}</div>
              <div>
                Configured Steps:{" "}
                {
                  existingSteps.filter(
                    (step) => Object.keys(step.config).length > 0
                  ).length
                }
              </div>
              <div>
                Flexible Steps:{" "}
                {
                  existingSteps.filter((step) => {
                    const meta = STEP_METADATA.find(
                      (m) => m.stepType === step.stepType
                    );
                    return meta?.positionFlexible;
                  }).length
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPalette;
