'use client';
'use no memo';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Types
import { OnboardingContextType } from './types';

// Example Hooks Usage:
// const { setCurrentStep, closeNextStep, startNextStep } = useOnboarding();

// // To trigger a specific step
// setCurrentStep(2); // step 3

// // To close/start onboarding
// closeOnboarding();
// startOnboarding();

/**
 * Context for managing the state of the onboarding process.
 *
 * Provides methods to control the current step and visibility of the onboarding overlay.
 *
 * @returns {OnboardingContextType} The context value containing state and methods for managing the onboarding process.
 *
 * @example
 * const { setCurrentStep, closeNextStep, startNextStep } = useOnboarding();
 */
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

/**
 * Custom hook to access the NextStep context.
 *
 * @throws Will throw an error if used outside of an OnboardingProvider.
 * @returns {OnboardingContextType} The context value containing state and methods for managing the onboarding process.
 */
const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

/**
 * Provider component for the Onboarding context.
 *
 * Manages the state of the current tour and step, and provides methods to control the onboarding process.
 *
 * @param {React.ReactNode} children - The child components that will have access to the Onboarding context.
 * @returns {JSX.Element} The rendered provider component.
 */
const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [currentStep, setCurrentStepState] = useState(0);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  const setCurrentStep = useCallback((step: number, delay?: number) => {
    if (delay) {
      setTimeout(() => {
        setCurrentStepState(step);
        setIsOnboardingVisible(true);
      }, delay);
    } else {
      setCurrentStepState(step);
      setIsOnboardingVisible(true);
    }
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOnboardingVisible(false);
    setCurrentTour(null);
  }, []);

  const startOnboarding = useCallback((tourName: string) => {
    setCurrentTour(tourName);
    setCurrentStepState(0);
    setIsOnboardingVisible(true);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        currentTour,
        currentStep,
        setCurrentStep,
        closeOnboarding,
        startOnboarding,
        isOnboardingVisible,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export { OnboardingProvider, useOnboarding };
