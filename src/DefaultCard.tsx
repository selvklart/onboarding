import React from 'react';
import { CardComponentProps, OnboardingLabels } from './types';

const defaultLabels: Required<OnboardingLabels> = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  skip: 'Skip Tour',
  of: 'of',
  ariaLabels: {
    closeButton: 'Close tour',
    nextButton: 'Go to next step',
    previousButton: 'Go to previous step',
    finishButton: 'Finish tour',
    skipButton: 'Skip tour',
    card: 'Onboarding tour card',
  },
};

const DefaultCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
  labels: userLabels,
}) => {
  const labels: Required<OnboardingLabels> = {
    next: userLabels?.next ?? defaultLabels.next,
    previous: userLabels?.previous ?? defaultLabels.previous,
    finish: userLabels?.finish ?? defaultLabels.finish,
    skip: userLabels?.skip ?? defaultLabels.skip,
    of: userLabels?.of ?? defaultLabels.of,
    ariaLabels: {
      closeButton: userLabels?.ariaLabels?.closeButton ?? defaultLabels.ariaLabels.closeButton,
      nextButton: userLabels?.ariaLabels?.nextButton ?? defaultLabels.ariaLabels.nextButton,
      previousButton: userLabels?.ariaLabels?.previousButton ?? defaultLabels.ariaLabels.previousButton,
      finishButton: userLabels?.ariaLabels?.finishButton ?? defaultLabels.ariaLabels.finishButton,
      skipButton: userLabels?.ariaLabels?.skipButton ?? defaultLabels.ariaLabels.skipButton,
      card: userLabels?.ariaLabels?.card ?? defaultLabels.ariaLabels.card,
    },
  };
  return (
    <div
      role="dialog"
      aria-label={labels.ariaLabels.card}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '1rem',
        maxWidth: '32rem',
        minWidth: '16rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{step.title}</h2>
        {step.icon && <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>{step.content}</div>

      <div
        style={{
          marginBottom: '1rem',
          backgroundColor: '#E5E7EB',
          borderRadius: '9999px',
          height: '0.625rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#2563EB',
            height: '0.625rem',
            borderRadius: '9999px',
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
        }}
      >
        <button
          onClick={prevStep}
          aria-label={labels.ariaLabels.previousButton}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: '500',
            color: '#4B5563',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            display: step.showControls ? 'block' : 'none',
          }}
          disabled={currentStep === 0}
        >
          {labels.previous}
        </button>
        <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
          {currentStep + 1} {labels.of} {totalSteps}
        </span>
        {currentStep === totalSteps - 1 ? (
          <button
            onClick={skipTour}
            aria-label={labels.ariaLabels.finishButton}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#10B981',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: step.showControls ? 'block' : 'none',
            }}
          >
            {labels.finish}
          </button>
        ) : (
          <button
            onClick={nextStep}
            aria-label={labels.ariaLabels.nextButton}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#2563EB',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: step.showControls ? 'block' : 'none',
            }}
          >
            {labels.next}
          </button>
        )}
      </div>

      <span style={{ color: '#F3F4F6' }}>
        {arrow}
      </span>

      {skipTour && currentStep < totalSteps - 1 && (
        <button
          onClick={skipTour}
          aria-label={labels.ariaLabels.skipButton}
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            width: '100%',
            padding: '0.5rem 1rem',
            fontWeight: '500',
            color: '#4B5563',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            display: step.showSkip ? 'block' : 'none',
          }}
        >
          {labels.skip}
        </button>
      )}
    </div>
  );
};

export default DefaultCard;
