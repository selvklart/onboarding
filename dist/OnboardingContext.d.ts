import React from 'react';
import { OnboardingContextType } from './types';
/**
 * Custom hook to access the NextStep context.
 *
 * @throws Will throw an error if used outside of an OnboardingProvider.
 * @returns {OnboardingContextType} The context value containing state and methods for managing the onboarding process.
 */
declare const useOnboarding: () => OnboardingContextType;
/**
 * Provider component for the Onboarding context.
 *
 * Manages the state of the current tour and step, and provides methods to control the onboarding process.
 *
 * @param {React.ReactNode} children - The child components that will have access to the Onboarding context.
 * @returns {JSX.Element} The rendered provider component.
 */
declare const OnboardingProvider: React.FC<{
    children: React.ReactNode;
}>;
export { OnboardingProvider, useOnboarding };
