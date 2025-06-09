import React, { useState } from "react";
import { HiringFlow, ValidationError, FlowStep } from "../../types/hiring-flow";

// Interface for template data
interface TemplateData {
  hiring_user_template_id: number;
  company_id: number;
  template_name: string;
  template_json: {
    steps: FlowStep[];
    flowName: string;
    description: string;
  };
  is_active: boolean;
  created_by: number;
  created_on: string;
  updated_by: number | null;
  updated_on: string;
}

interface FlowToolbarProps {
  flow: HiringFlow;
  validationErrors: ValidationError[];
  onSave: (flow: HiringFlow) => void;
  onReset: () => void;
  onValidate: () => void;
  onExport: () => void;
  isSaving?: boolean;
  templates?: TemplateData[];
  selectedTemplate?: TemplateData | null;
  loadingTemplates?: boolean;
  isEditMode?: boolean;
  onTemplateSelect?: (template: TemplateData) => void;
  onCreateNew?: () => void;
}

const FlowToolbar: React.FC<FlowToolbarProps> = ({
  flow,
  validationErrors,
  onSave,
  onReset,
  onValidate,
  onExport,
  isSaving = false,
  templates = [],
  selectedTemplate = null,
  loadingTemplates = false,
  isEditMode = false,
  onTemplateSelect,
  onCreateNew,
}) => {
  const [flowName, setFlowName] = useState(flow.flowName);
  const [description, setDescription] = useState(flow.description);
  const [showFlowDetails, setShowFlowDetails] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  // Update local state when flow changes
  React.useEffect(() => {
    setFlowName(flow.flowName);
    setDescription(flow.description);
  }, [flow.flowName, flow.description]);

  const handleSave = () => {
    const updatedFlow: HiringFlow = {
      ...flow,
      flowName,
      description,
    };
    onSave(updatedFlow);
  };

  const handleTemplateSelect = (template: TemplateData) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
    setShowTemplateDropdown(false);
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    }
    setShowTemplateDropdown(false);
  };

  const hasErrors = validationErrors.length > 0;
  const hasSteps = flow.steps.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Flow Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hiring Flow Builder
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {flowName || "Untitled Flow"} • {flow.steps.length} steps
              {isEditMode && selectedTemplate && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
                  Editing: {selectedTemplate.template_name}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => setShowFlowDetails(!showFlowDetails)}
            className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            {showFlowDetails ? "Hide Details" : "Edit Details"}
          </button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Validation Status */}
          <div className="flex items-center gap-2">
            {hasErrors ? (
              <div className="flex items-center text-error-600 dark:text-error-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {validationErrors.length} errors
                </span>
              </div>
            ) : hasSteps ? (
              <div className="flex items-center text-success-600 dark:text-success-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Valid</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">No steps</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Template Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                disabled={loadingTemplates}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingTemplates ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                Templates
              </button>

              {showTemplateDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {/* Create New Option */}
                  <button
                    onClick={handleCreateNew}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Template
                  </button>

                  {/* Template List */}
                  {templates.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No templates available
                    </div>
                  ) : (
                    templates.map((template) => (
                      <button
                        key={template.hiring_user_template_id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                          selectedTemplate?.hiring_user_template_id ===
                          template.hiring_user_template_id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="font-medium">
                          {template.template_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {template.template_json?.steps?.length || 0} steps •
                          {new Date(template.updated_on).toLocaleDateString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={onValidate}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Validate
            </button>

            <button
              onClick={onExport}
              disabled={!hasSteps}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export JSON
            </button>

            <button
              onClick={onReset}
              disabled={!hasSteps}
              className="px-3 py-2 text-sm font-medium text-error-700 dark:text-error-300 bg-error-100 dark:bg-error-900 hover:bg-error-200 dark:hover:bg-error-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>

            <button
              onClick={handleSave}
              disabled={hasErrors || !hasSteps || isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isSaving
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Template"
                : "Save Flow"}
            </button>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showTemplateDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTemplateDropdown(false)}
        />
      )}

      {/* Flow Details Panel */}
      {showFlowDetails && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Flow Name
              </label>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter flow name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter description..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors Summary */}
      {hasErrors && (
        <div className="mt-4 p-4 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 rounded-lg">
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
                Flow Validation Errors ({validationErrors.length})
              </h4>
              <div className="mt-2 text-sm text-error-700 dark:text-error-300">
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li className="text-error-600 dark:text-error-400">
                      ... and {validationErrors.length - 5} more errors
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowToolbar;
