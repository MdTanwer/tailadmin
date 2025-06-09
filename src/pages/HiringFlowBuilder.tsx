import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  HiringFlow,
  FlowStep,
  StepMetadata,
  ValidationError,
} from "../types/hiring-flow";
import { HiringFlowValidator } from "../utils/hiring-flow-validation";
import { useStepMetadata } from "../hooks/useStepMetadata";
import StepPalette from "../components/hiring-flow/StepPalette";
import FlowCanvas from "../components/hiring-flow/FlowCanvas";
import FlowToolbar from "../components/hiring-flow/FlowToolbar";
import StepConfigPanel from "../components/hiring-flow/StepConfigPanel";
import PageMeta from "../components/common/PageMeta";

const HiringFlowBuilder: React.FC = () => {
  const { getStepMetadata, loading: metadataLoading } = useStepMetadata();

  const [flow, setFlow] = useState<HiringFlow>({
    flowName: "New Hiring Flow",
    description: "A custom hiring flow for your organization",
    steps: [],
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [selectedStep, setSelectedStep] = useState<FlowStep | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Generate unique ID for new steps
  const generateStepId = () => {
    return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add a new step to the flow
  const handleAddStep = useCallback(
    (stepType: string, metadata: StepMetadata) => {
      if (
        !HiringFlowValidator.canAddStep(flow.steps, stepType, getStepMetadata)
      ) {
        return;
      }

      const suggestedOrder = HiringFlowValidator.suggestOrder(
        flow.steps,
        stepType,
        getStepMetadata
      );
      const newStep: FlowStep = {
        id: generateStepId(),
        stepType,
        customName: metadata.displayName,
        order: suggestedOrder,
        config: {},
      };

      setFlow((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));

      // Validate after adding
      const updatedFlow = {
        ...flow,
        steps: [...flow.steps, newStep],
      };
      setValidationErrors(
        HiringFlowValidator.validateFlow(updatedFlow, getStepMetadata)
      );
    },
    [flow.steps, getStepMetadata]
  );

  // Update an existing step
  const handleUpdateStep = useCallback(
    (stepId: string, updatedStep: FlowStep) => {
      setFlow((prev) => ({
        ...prev,
        steps: prev.steps.map((step) =>
          step.id === stepId ? updatedStep : step
        ),
      }));

      // Validate after updating
      const updatedFlow = {
        ...flow,
        steps: flow.steps.map((step) =>
          step.id === stepId ? updatedStep : step
        ),
      };
      setValidationErrors(
        HiringFlowValidator.validateFlow(updatedFlow, getStepMetadata)
      );
      setSelectedStep(null);
    },
    [flow, getStepMetadata]
  );

  // Delete a step from the flow
  const handleDeleteStep = useCallback(
    (stepId: string) => {
      setFlow((prev) => ({
        ...prev,
        steps: prev.steps.filter((step) => step.id !== stepId),
      }));

      // Validate after deleting
      const updatedFlow = {
        ...flow,
        steps: flow.steps.filter((step) => step.id !== stepId),
      };
      setValidationErrors(
        HiringFlowValidator.validateFlow(updatedFlow, getStepMetadata)
      );

      // Close config panel if the deleted step was selected
      if (selectedStep?.id === stepId) {
        setSelectedStep(null);
      }
    },
    [flow, selectedStep, getStepMetadata]
  );

  // Handle step click for configuration
  const handleStepClick = useCallback(
    (step: FlowStep) => {
      const metadata = getStepMetadata(step.stepType);
      // Only open config panel for steps that have configuration options
      if (metadata && metadata.configFlag) {
        setSelectedStep(step);
      }
    },
    [getStepMetadata]
  );

  // Validate the entire flow
  const handleValidate = useCallback(() => {
    const errors = HiringFlowValidator.validateFlow(flow, getStepMetadata);
    setValidationErrors(errors);

    // Show validation result
    if (errors.length === 0) {
      alert("✅ Flow validation passed! No errors found.");
    } else {
      alert(
        `❌ Flow validation failed with ${errors.length} error(s). Check the details below.`
      );
    }
  }, [flow, getStepMetadata]);

  // Save the flow
  const handleSave = useCallback(async (updatedFlow: HiringFlow) => {
    setIsSaving(true);

    try {
      // Update local state first
      setFlow(updatedFlow);

      // Prepare the data for the API in the expected format
      const flowData = {
        hiring_user_template_id: 3, // You might want to make this dynamic based on your needs
        company_id: 1, // You might want to make this dynamic based on logged in user
        template_name: updatedFlow.flowName,
        template_json: {
          steps: updatedFlow.steps.map((step) => ({
            id: step.id,
            order: step.order,
            config: step.config,
            stepType: step.stepType,
            customName: step.customName,
          })),
          flowName: updatedFlow.flowName,
          description: updatedFlow.description,
        },
        is_active: true,
        created_by: 1,
      };

      // Make API call to save the flow
      const response = await fetch(
        "https://abhirebackend.onrender.com/hiringflow/template/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flowData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to save flow: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Flow saved successfully:", result);
      alert("✅ Flow saved successfully!");
    } catch (error) {
      console.error("Error saving flow:", error);
      alert(
        `❌ Failed to save flow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Reset the flow
  const handleReset = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to reset the flow? This will remove all steps."
      )
    ) {
      setFlow({
        flowName: "New Hiring Flow",
        description: "A custom hiring flow for your organization",
        steps: [],
      });
      setValidationErrors([]);
      setSelectedStep(null);
    }
  }, []);

  // Export flow as JSON
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${flow.flowName
      .replace(/\s+/g, "_")
      .toLowerCase()}_flow.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [flow]);

  // Show loading state while metadata is being fetched
  if (metadataLoading) {
    return (
      <>
        <PageMeta
          title="Hiring Flow Builder | TailAdmin - React.js Admin Dashboard Template"
          description="Build and configure custom hiring flows with drag-and-drop interface"
        />
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Loading Hiring Flow Builder
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching step definitions from backend...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Hiring Flow Builder | TailAdmin - React.js Admin Dashboard Template"
        description="Build and configure custom hiring flows with drag-and-drop interface"
      />

      <DndProvider backend={HTML5Backend}>
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex-shrink-0">
            <FlowToolbar
              flow={flow}
              validationErrors={validationErrors}
              onSave={handleSave}
              onReset={handleReset}
              onValidate={handleValidate}
              onExport={handleExport}
              isSaving={isSaving}
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Panel - Step Palette */}
            <StepPalette existingSteps={flow.steps} />

            {/* Center - Flow Canvas */}
            <FlowCanvas
              steps={flow.steps}
              onAddStep={handleAddStep}
              onDeleteStep={handleDeleteStep}
              onStepClick={handleStepClick}
              validationErrors={validationErrors}
              getStepMetadata={getStepMetadata}
            />
          </div>

          {/* Step Configuration Modal */}
          {selectedStep && (
            <StepConfigPanel
              step={selectedStep}
              metadata={getStepMetadata(selectedStep.stepType)!}
              onUpdate={(updatedStep) =>
                handleUpdateStep(selectedStep.id, updatedStep)
              }
              onClose={() => setSelectedStep(null)}
            />
          )}
        </div>
      </DndProvider>
    </>
  );
};

export default HiringFlowBuilder;
