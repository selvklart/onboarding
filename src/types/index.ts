import type { Transition } from 'motion';

// Context
export interface OnboardingContextType {
  currentStep: number;
  currentTour: string | null;
  setCurrentStep: (step: number, delay?: number) => void;
  closeOnboarding: () => void;
  startOnboarding: (tourName: string) => void;
  isOnboardingVisible: boolean;
}

// Step
export interface Step {
  // Step Content
  icon?: React.ReactNode | string | null;
  title: string;
  content: React.ReactNode;
  selector: string;
  // Options
  side?: 'top' | 'bottom' | 'left' | 'right';
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
  // Routing
  nextRoute?: string;
  prevRoute?: string;
}

// Tour
//
export interface Tour {
  tour: string;
  steps: Step[];
}

// Onboarding
export interface OnboardingProps {
  children: React.ReactNode;
  interact?: boolean;
  steps: Tour[];
  showOnboarding?: boolean;
  shadowRgb?: string;
  shadowOpacity?: string;
  cardTransition?: Transition;
  cardComponent?: React.ComponentType<CardComponentProps>;
  scrollToTop?: boolean;
  labels?: OnboardingLabels;
}

// Localization
export interface OnboardingLabels {
  next?: string;
  previous?: string;
  finish?: string;
  skip?: string;
  of?: string;
  ariaLabels?: {
    closeButton?: string;
    nextButton?: string;
    previousButton?: string;
    finishButton?: string;
    skipButton?: string;
    card?: string;
  };
}

// Custom Card
export interface CardComponentProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  labels?: OnboardingLabels;
}
