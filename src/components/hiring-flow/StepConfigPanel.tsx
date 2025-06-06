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
  const [config, setConfig] = useState<
    Record<string, string | number | boolean | string[]>
  >(step.config);

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
    value: string | number | boolean | string[]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderConfigFields = () => {
    switch (step.stepType) {
      case "CREATE_JOB_POST":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={
                  typeof config.jobTitle === "string" ? config.jobTitle : ""
                }
                onChange={(e) => handleConfigChange("jobTitle", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                value={
                  typeof config.jobDescription === "string"
                    ? config.jobDescription
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("jobDescription", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter job description"
              />
            </div>
          </div>
        );

      case "UPLOAD_CV":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                value={
                  typeof config.maxFileSize === "number"
                    ? config.maxFileSize
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("maxFileSize", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="10"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions for Candidates
              </label>
              <textarea
                value={
                  typeof config.instructions === "string"
                    ? config.instructions
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("instructions", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Please upload your updated CV in PDF format..."
              />
            </div>
          </div>
        );

      case "SEND_JD":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Methods
              </label>
              <div className="space-y-2">
                {["Email", "Whatsapp", "SMS"].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(config.delivery_methods)
                          ? config.delivery_methods.includes(method)
                          : false
                      }
                      onChange={(e) => {
                        const currentMethods = Array.isArray(
                          config.delivery_methods
                        )
                          ? [...config.delivery_methods]
                          : [];
                        if (e.target.checked) {
                          handleConfigChange("delivery_methods", [
                            ...currentMethods,
                            method,
                          ]);
                        } else {
                          handleConfigChange(
                            "delivery_methods",
                            currentMethods.filter((m) => m !== method)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Template
              </label>
              <textarea
                value={
                  typeof config.messageTemplate === "string"
                    ? config.messageTemplate
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("messageTemplate", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Dear candidate, please find the job description attached..."
              />
            </div>
          </div>
        );

      case "SCREENING_CALL":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Via
              </label>
              <select
                value={
                  typeof config.schedule_via === "string"
                    ? config.schedule_via
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("schedule_via", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select scheduling method</option>
                <option value="calendar">Calendar Integration</option>
                <option value="manual">Manual Scheduling</option>
                <option value="auto">Auto-assign Time Slots</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={
                  typeof config.duration_minutes === "number"
                    ? config.duration_minutes
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange(
                    "duration_minutes",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 15"
                min="5"
                max="120"
                step="5"
              />
            </div>
          </div>
        );

      case "INTERVIEW":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Rounds
              </label>
              <input
                type="number"
                value={typeof config.rounds === "number" ? config.rounds : ""}
                onChange={(e) =>
                  handleConfigChange("rounds", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 2"
                min="1"
                max="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Type
              </label>
              <select
                value={
                  typeof config.interview_type === "string"
                    ? config.interview_type
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("interview_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select interview type</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person</option>
                <option value="online">Online Assessment</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    typeof config.panel_required === "boolean"
                      ? config.panel_required
                      : false
                  }
                  onChange={(e) =>
                    handleConfigChange("panel_required", e.target.checked)
                  }
                  className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Panel Interview Required
                </span>
              </label>
            </div>
          </div>
        );

      case "POST_INTERVIEW_ASSIGNMENT":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Document
              </label>
              <input
                type="text"
                value={
                  typeof config.assignment_doc === "string"
                    ? config.assignment_doc
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("assignment_doc", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="assignment_doc.pdf"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Type
              </label>
              <select
                value={
                  typeof config.assignment_type === "string"
                    ? config.assignment_type
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("assignment_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select assignment type</option>
                <option value="Technical">Technical</option>
                <option value="Creative">Creative</option>
                <option value="Case Study">Case Study</option>
                <option value="Presentation">Presentation</option>
                <option value="Code Review">Code Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Email Template
              </label>
              <input
                type="text"
                value={
                  typeof config.assignment_email_template === "string"
                    ? config.assignment_email_template
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange(
                    "assignment_email_template",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="assignment_email_v1"
              />
            </div>
          </div>
        );

      case "BACKGROUND_VERIFICATION":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Documents
              </label>
              <div className="space-y-2">
                {[
                  "Aadhaar",
                  "PAN",
                  "Payslip1",
                  "Payslip2",
                  "Payslip3",
                  "BankStatement1",
                ].map((doc) => (
                  <label key={doc} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(config.required_documents)
                          ? config.required_documents.includes(doc)
                          : false
                      }
                      onChange={(e) => {
                        const currentDocs = Array.isArray(
                          config.required_documents
                        )
                          ? [...config.required_documents]
                          : [];
                        if (e.target.checked) {
                          handleConfigChange("required_documents", [
                            ...currentDocs,
                            doc,
                          ]);
                        } else {
                          handleConfigChange(
                            "required_documents",
                            currentDocs.filter((d) => d !== doc)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {doc}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "OFFER_LETTER":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Template
              </label>
              <input
                type="text"
                value={
                  typeof config.email_template === "string"
                    ? config.email_template
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("email_template", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="offer_email_template_v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Package
              </label>
              <input
                type="text"
                value={
                  typeof config.salaryPackage === "string"
                    ? config.salaryPackage
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("salaryPackage", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="₹8,00,000 - ₹12,00,000 per annum"
              />
            </div>
          </div>
        );

      case "ONBOARDING":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Onboarding Duration (days)
              </label>
              <input
                type="number"
                value={
                  typeof config.duration_days === "number"
                    ? config.duration_days
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("duration_days", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 5"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buddy Assignment
              </label>
              <input
                type="text"
                value={
                  typeof config.buddyAssignment === "string"
                    ? config.buddyAssignment
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("buddyAssignment", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Senior team member name"
              />
            </div>
          </div>
        );

      case "CUSTOMER_MESSAGE":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Name
              </label>
              <input
                type="text"
                value={
                  typeof config.message_name === "string"
                    ? config.message_name
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("message_name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Welcome Message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Template
              </label>
              <input
                type="text"
                value={
                  typeof config.email_template === "string"
                    ? config.email_template
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("email_template", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="customer_email_template_v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Content
              </label>
              <textarea
                value={
                  typeof config.messageContent === "string"
                    ? config.messageContent
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("messageContent", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Message to be sent to customer post-selection..."
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
                    : ""
                }
                onChange={(e) =>
                  handleConfigChange("messageType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select message type</option>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configure Step: {metadata.displayName}
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
