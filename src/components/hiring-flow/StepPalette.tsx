import React from "react";
import { FlowStep } from "../../types/hiring-flow";
import { useStepMetadata } from "../../hooks/useStepMetadata";
import StepCard from "./StepCard";

interface StepPaletteProps {
  existingSteps: FlowStep[];
}

const StepPalette: React.FC<StepPaletteProps> = ({ existingSteps }) => {
  const { stepMetadata, loading, error, getStepMetadata } = useStepMetadata();

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Available Steps
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading steps from backend...
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Available Steps
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Error loading steps
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm text-error-600 dark:text-error-400 mb-2">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              {stepMetadata
                .filter((meta) => !meta.positionFlexible)
                .sort((a, b) => a.defaultOrder - b.defaultOrder)
                .map((metadata) => (
                  <StepCard
                    key={metadata.stepType}
                    metadata={metadata}
                    existingSteps={existingSteps}
                    getStepMetadata={getStepMetadata}
                  />
                ))}
            </div>
          </div>

          {/* Flexible Position Steps */}
          {stepMetadata.filter((meta) => meta.positionFlexible).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-light-500 rounded-full mr-2"></span>
                Flexible Position Steps
              </h3>
              <div className="space-y-3">
                {stepMetadata
                  .filter((meta) => meta.positionFlexible)
                  .map((metadata) => (
                    <StepCard
                      key={metadata.stepType}
                      metadata={metadata}
                      existingSteps={existingSteps}
                      getStepMetadata={getStepMetadata}
                    />
                  ))}
              </div>
            </div>
          )}

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

          {/* API Status */}
          <div className="p-3 bg-success-50 dark:bg-success-950 rounded-lg">
            <div className="flex items-center text-success-700 dark:text-success-300">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span className="text-xs font-medium">
                Connected to Backend API ({stepMetadata.length} steps loaded)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPalette;
