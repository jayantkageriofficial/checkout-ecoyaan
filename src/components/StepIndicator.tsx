"use client";

interface Step {
  label: string;
  index: number;
}

const steps: Step[] = [
  { label: "Cart", index: 0 },
  { label: "Shipping", index: 1 },
  { label: "Payment", index: 2 },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                step.index < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : step.index === currentStep
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {step.index < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.index + 1
              )}
            </div>
            <span
              className={`mt-1 text-xs font-medium ${
                step.index === currentStep ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-1 mb-4 transition-colors ${
                step.index < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
