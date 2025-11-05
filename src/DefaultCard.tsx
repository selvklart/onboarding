'use client';

import React from 'react';
import { CardComponentProps, OnboardingLabels } from './types';
import confetti from 'canvas-confetti';
import { useOnboarding } from './OnboardingContext';

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

export const DefaultCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  labels: userLabels,
}: CardComponentProps) => {
  const labels: Required<OnboardingLabels> = {
    next: userLabels?.next ?? defaultLabels.next,
    previous: userLabels?.previous ?? defaultLabels.previous,
    finish: userLabels?.finish ?? defaultLabels.finish,
    skip: userLabels?.skip ?? defaultLabels.skip,
    of: userLabels?.of ?? defaultLabels.of,
    ariaLabels: {
      closeButton:
        userLabels?.ariaLabels?.closeButton ?? defaultLabels.ariaLabels.closeButton,
      nextButton:
        userLabels?.ariaLabels?.nextButton ?? defaultLabels.ariaLabels.nextButton,
      previousButton:
        userLabels?.ariaLabels?.previousButton ?? defaultLabels.ariaLabels.previousButton,
      finishButton:
        userLabels?.ariaLabels?.finishButton ?? defaultLabels.ariaLabels.finishButton,
      skipButton:
        userLabels?.ariaLabels?.skipButton ?? defaultLabels.ariaLabels.skipButton,
      card: userLabels?.ariaLabels?.card ?? defaultLabels.ariaLabels.card,
    },
  };
  // Onboarding hooks
  const { closeOnboarding } = useOnboarding();

  function handleClose() {
    closeOnboarding();
  }

  function handleConfetti() {
    closeOnboarding();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    });
  }

  if (totalSteps === 1) {
    return (
      <div
        role="dialog"
        aria-label={labels.ariaLabels.card}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          padding: '0.8rem',
          zIndex: 999,
          width: 'min(90vw, 350px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            {step.title}
          </h2>
          {step.icon && <div style={{ fontSize: '1.5rem' }}>{step.icon}</div>}
        </div>

        <div style={{ marginBottom: '1rem', fontSize: '1rem' }}>{step.content}</div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.75rem',
            flexShrink: 0,
          }}
        >
          {currentStep + 1 === totalSteps && (
            <Button
              ariaLabel={labels.ariaLabels.finishButton}
              onClick={handleConfetti}
              finnish={true}
              showControls={step.showControls}
            >
              {labels.finish}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={labels.ariaLabels.card}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        padding: '0.8rem',
        zIndex: 999,
        width: 'min(90vw, 350px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          {step.title}
        </h2>
        {step.icon && <div style={{ fontSize: '1.5rem' }}>{step.icon}</div>}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '1rem' }}>{step.content}</div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          flexShrink: 0,
          marginBottom: '0.5rem',
        }}
      >
        <Button
          ariaLabel={labels.ariaLabels.previousButton}
          onClick={prevStep}
          disabled={currentStep === 0}
          showControls={step.showControls}
          isPrev={true}
        >
          {labels.previous}
        </Button>

        <div style={{ flexShrink: 0, fontSize: '0.85rem' }}>
          {currentStep + 1} {labels.of} {totalSteps}
        </div>

        {currentStep + 1 !== totalSteps && (
          <Button
            ariaLabel={labels.ariaLabels.nextButton}
            onClick={nextStep}
            showControls={step.showControls}
          >
            {labels.next}
          </Button>
        )}
        {currentStep + 1 === totalSteps && (
          <Button
            ariaLabel={labels.ariaLabels.finishButton}
            onClick={handleConfetti}
            finnish={true}
            showControls={step.showControls}
          >
            {labels.finish}
          </Button>
        )}
      </div>

      <Button
        aria-label={labels.ariaLabels.skipButton}
        onClick={handleClose}
        isSkip={true}
        showControls={step.showControls}
      >
        {labels.skip}
      </Button>
    </div>
  );
};

type ButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
  children: React.ReactNode;
  disabled?: boolean;
  finnish?: boolean;
  showControls?: boolean;
  isPrev?: boolean;
  isSkip?: boolean;
};

const Button = ({
  onClick,
  ariaLabel,
  children,
  disabled,
  finnish,
  showControls,
  isPrev,
  isSkip,
}: ButtonProps) => {
  const buttonBg = finnish ? '#37C37F' : isPrev || isSkip ? '#E6E6E6' : '#1F1F1F';
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: '0.85rem',
        padding: isSkip ? '0.25rem 1rem' : '0.5rem 1rem',
        fontWeight: '500',
        color: isPrev || isSkip || finnish ? '#1F1F1F' : '#E6E6E6',
        backgroundColor: buttonBg,
        borderRadius: '0.375rem',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: showControls ? 'inline-block' : 'none',
        minWidth: '5rem',
        opacity: disabled ? 0.5 : 1,
        width: isSkip ? '100%' : 'auto',
      }}
    >
      {children}
    </button>
  );
};
