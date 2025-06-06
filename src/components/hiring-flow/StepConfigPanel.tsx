import React, { useState, useEffect } from "react";
import { FlowStep, StepMetadata } from "../../types/hiring-flow";

interface StepConfigPanelProps {
  step: FlowStep;
  metadata: StepMetadata;
  onUpdate: (updatedStep: FlowStep) => void;
  onClose: () => void;
}

const StepConfigPanel: React.FC<StepConfigPanelProps> = ({
  step,
  metadata,
  onUpdate,
  onClose,
}) => {
  const [customName, setCustomName] = useState(step.customName);
  const [order, setOrder] = useState(step.order.toString());
  const [config, setConfig] = useState(step.config);

  useEffect(() => {
    setCustomName(step.customName);
    setOrder(step.order.toString());
    setConfig(step.config);
  }, [step]);

  const handleSave = () => {
    const updatedStep: FlowStep = {
      ...step,
      customName,
      order: parseInt(order, 10),
      config,
    };
    onUpdate(updatedStep);
  };

  const handleConfigChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderConfigFields = () => {
    switch (step.stepType) {
      case "OFFER_LETTER":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Template ID
              </label>
              <input
                type="text"
                value={
                  typeof config.emailTemplateId === "string"
                    ? config.emailTemplateId
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("emailTemplateId", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., template_offer_001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                value={
                  typeof config.salaryRange === "string"
                    ? config.salaryRange
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("salaryRange", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>
          </div>
        );

      case "BACKGROUND_VERIFICATION":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Type
              </label>
              <select
                value={
                  typeof config.verificationType === "string"
                    ? config.verificationType
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("verificationType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select verification type</option>
                <option value="criminal">Criminal Background</option>
                <option value="employment">Employment History</option>
                <option value="education">Education Verification</option>
                <option value="reference">Reference Check</option>
                <option value="comprehensive">Comprehensive Check</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Documents
              </label>
              <textarea
                value={
                  typeof config.requiredDocuments === "string"
                    ? config.requiredDocuments
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("requiredDocuments", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="List required documents..."
              />
            </div>
          </div>
        );

      case "CUSTOM_MESSAGE":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Content
              </label>
              <textarea
                value={typeof config.message === "string" ? config.message : ""}
                onChange={(e) => handleConfigChange("message", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your custom message..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Type
              </label>
              <select
                value={
                  typeof config.messageType === "string"
                    ? config.messageType
                    : "email"
                }
                onChange={(e) =>
                  handleConfigChange("messageType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="notification">In-App Notification</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No additional configuration required for this step.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configure Step
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Step Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder={metadata.displayName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                min="1"
                step="1"
              />
              {!metadata.positionFlexible && (
                <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                  ⚠️ This step has fixed positioning constraints
                </p>
              )}
            </div>
          </div>

          {/* Step-specific Configuration */}
          {metadata.configFlag && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Step Configuration
              </h4>
              {renderConfigFields()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepConfigPanel;
