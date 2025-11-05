'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset as floatingOffset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { Portal } from '@radix-ui/react-portal';
import { motion, useInView } from 'motion/react';
import { useRouter } from 'next/navigation';

import { DefaultCard } from './DefaultCard';
import { useOnboarding } from './OnboardingContext';
// Types
import type { OnboardingProps, Step } from './types';

/**
 * Onboarding component for managing onboarding flow. It must be used within a OnboardingProvider.
 *
 * This component provides a guided experience for users through a series of steps.
 * It allows customization of the card component and provides callbacks for various events.
 *
 * @param {React.ReactNode} children - The content to be displayed within the step.
 * @param {Array} steps - An array of steps to be displayed, each containing information for the onboarding process.
 * @param {string} [shadowRgb='0, 0, 0'] - The RGB value for the shadow effect surrounding the target area (default: '0, 0, 0').
 * @param {string} [shadowOpacity='0.2'] - The opacity of the shadow effect (default: '0.2').
 * @param {object} [cardTransition={ ease: 'anticipate', duration: 0.6 }] - Transition settings for the card animation, including easing and duration (default: { ease: 'anticipate', duration: 0.6 }).
 * @param {React.ComponentType} [cardComponent] - Custom component for rendering the card, allowing for design flexibility.
 * @param {boolean} [scrollToTop=true] - Flag to scroll to the top of the page when the onboarding process ends (default: true).
 * @param {boolean} [interact=true] - Flag to enable interaction with the target area (default: true).
 *
 * @returns {JSX.Element} The rendered NextStep component.
 *
 */
const Onboarding: React.FC<OnboardingProps> = ({
  children,
  steps,
  shadowRgb = '0, 0, 0',
  shadowOpacity = '0.2',
  cardTransition = { type: 'spring', bounce: 0.2 },
  cardComponent: CardComponent,
  scrollToTop = true,
  interact = true,
  labels,
}) => {
  const { currentTour, currentStep, setCurrentStep, isOnboardingVisible } =
    useOnboarding();
  const currentTourSteps = steps.find((tour) => tour.tour === currentTour)?.steps;

  const [elementToScroll, setElementToScroll] = useState<Element | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const currentElementRef = useRef<Element | null>(null);
  const observeRef = useRef(null); // Ref for the observer element
  const isInView = useInView(observeRef);
  const offset = 20;

  // - -
  // Route Changes
  const router = useRouter();

  // - -
  // Initialisze
  const previousVisibilityRef = useRef<boolean>(isOnboardingVisible);

  // - -
  // Scroll to top when tour closes
  useEffect(() => {
    // Detect when tour closes (visible -> not visible)
    if (previousVisibilityRef.current && !isOnboardingVisible && scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // Update ref for next render
    previousVisibilityRef.current = isOnboardingVisible;
  }, [isOnboardingVisible, scrollToTop]);

  useEffect(() => {
    if (isOnboardingVisible && currentTourSteps) {
      // Clean up all elements that might have our styles
      currentTourSteps.forEach((tourStep) => {
        const element = document.querySelector(tourStep.selector) as HTMLElement | null;
        if (element && tourStep !== currentTourSteps[currentStep]) {
          // Reset styles for non-active elements if interaction is enabled
          if (interact) {
            const style = element.style;
            style.position = '';
            style.zIndex = '';
          }
        }
      });

      const step = currentTourSteps[currentStep];
      if (step) {
        const element = document.querySelector(step.selector) as Element | null;
        if (element) {
          // Set styles for current element
          (element as HTMLElement).style.position = 'relative';
          if (interact) {
            (element as HTMLElement).style.zIndex = '990';
          }

          setPointerPosition(getElementPosition(element));
          currentElementRef.current = element;
          setElementToScroll(element);

          const rect = element.getBoundingClientRect();
          const isInViewportWithOffset =
            rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

          if (!isInView || !isInViewportWithOffset) {
            scrollToElementWithCard(element);
          }
        }
      }
    }

    // Cleanup function for component unmount
    return () => {
      if (currentTourSteps) {
        currentTourSteps.forEach((step) => {
          const element = document.querySelector(step.selector) as HTMLElement | null;
          if (element && interact) {
            element.style.position = '';
            element.style.zIndex = '';
          }
        });
      }
    };
  }, [currentStep, currentTourSteps, isInView, offset, isOnboardingVisible, interact]);

  // - -
  // Helper function to get element position
  const getElementPosition = (element: Element) => {
    const { top, left, width, height } = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    return {
      x: left + scrollLeft,
      y: top + scrollTop,
      width,
      height,
    };
  };

  // - -
  // Custom scroll function that accounts for the DefaultCard
  const scrollToElementWithCard = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Estimate card height (padding 16px top + bottom = 32px, content varies but typically 150-250px)
    // We'll use a conservative estimate of 350px to ensure the card is always visible
    const estimatedCardHeight = 350;

    // Card is positioned above the element with 17px offset (from floatingOffset(17))
    const cardOffset = 17;

    // Total space needed above the element for the card
    const spaceNeededAbove = estimatedCardHeight + cardOffset;

    // Calculate the ideal scroll position
    // We want the element positioned such that:
    // 1. The card above it is fully visible
    // 2. At least some of the element is visible
    // 3. Don't scroll past the bottom of the page

    const elementTopRelativeToPage = rect.top + window.scrollY;

    // Position element so that card + element fit in viewport
    // Leave some margin at the top (50px) for breathing room
    const topMargin = 50;
    const idealScrollPosition = elementTopRelativeToPage - spaceNeededAbove - topMargin;

    // Don't scroll if we're already in a good position
    const elementTop = rect.top;
    const elementBottom = rect.bottom;

    // Check if both card and element are reasonably visible
    const isCardVisible = elementTop > spaceNeededAbove + topMargin;
    const isElementVisible = elementBottom < viewportHeight;

    if (isCardVisible && isElementVisible) {
      // Already in a good position, no need to scroll
      return;
    }

    // Perform smooth scroll to calculated position
    window.scrollTo({
      top: Math.max(0, idealScrollPosition),
      behavior: 'smooth',
    });
  };

  // - -
  // Update pointerPosition when currentStep changes
  useEffect(() => {
    if (isOnboardingVisible && currentTourSteps) {
      const step = currentTourSteps[currentStep];
      if (step) {
        const element = document.querySelector(step.selector) as Element | null;
        if (element) {
          setPointerPosition(getElementPosition(element));
          currentElementRef.current = element;
          setElementToScroll(element);

          const rect = element.getBoundingClientRect();
          const isInViewportWithOffset =
            rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

          if (!isInView || !isInViewportWithOffset) {
            scrollToElementWithCard(element);
          }
        }
      }
    }
  }, [currentStep, currentTourSteps, isInView, offset, isOnboardingVisible]);

  useEffect(() => {
    if (elementToScroll && !isInView && isOnboardingVisible) {
      scrollToElementWithCard(elementToScroll);
    }
  }, [elementToScroll, isInView, isOnboardingVisible]);

  // - -
  // Update pointer position on window resize
  const updatePointerPosition = () => {
    if (currentTourSteps) {
      const step = currentTourSteps[currentStep];
      if (step) {
        const element = document.querySelector(step.selector) as Element | null;
        if (element) {
          setPointerPosition(getElementPosition(element));
        }
      }
    }
  };

  // - -
  // Update pointer position on window resize
  useEffect(() => {
    if (isOnboardingVisible) {
      window.addEventListener('resize', updatePointerPosition);
      return () => window.removeEventListener('resize', updatePointerPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentTourSteps, isOnboardingVisible]);

  // - -
  // Step Controls
  const nextStep = async () => {
    if (currentTourSteps && currentStep < currentTourSteps.length - 1) {
      try {
        const nextStepIndex = currentStep + 1;
        const route = currentTourSteps[currentStep].nextRoute;

        if (route) {
          await router.push(route);

          const targetSelector = currentTourSteps[nextStepIndex].selector;

          // Use MutationObserver to detect when the target element is available in the DOM
          const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(targetSelector);
            if (element) {
              // Once the element is found, update the step and scroll to the element
              setCurrentStep(nextStepIndex);
              scrollToElement(nextStepIndex);

              // Stop observing after the element is found
              observer.disconnect();
            }
          });

          // Start observing the document body for changes
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        } else {
          setCurrentStep(nextStepIndex);
          scrollToElement(nextStepIndex);
        }
      } catch (error) {
        console.error('Error navigating to next route', error);
      }
    }
  };

  const prevStep = async () => {
    if (currentTourSteps && currentStep > 0) {
      try {
        const prevStepIndex = currentStep - 1;
        const route = currentTourSteps[currentStep].prevRoute;

        if (route) {
          await router.push(route);

          const targetSelector = currentTourSteps[prevStepIndex].selector;

          // Use MutationObserver to detect when the target element is available in the DOM
          const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(targetSelector);
            if (element) {
              // Once the element is found, update the step and scroll to the element
              setCurrentStep(prevStepIndex);
              scrollToElement(prevStepIndex);

              // Stop observing after the element is found
              observer.disconnect();
            }
          });

          // Start observing the document body for changes
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        } else {
          setCurrentStep(prevStepIndex);
          scrollToElement(prevStepIndex);
        }
      } catch (error) {
        console.error('Error navigating to previous route', error);
      }
    }
  };

  // - -
  // Scroll to the correct element when the step changes
  const scrollToElement = (stepIndex: number) => {
    if (currentTourSteps) {
      const element = document.querySelector(
        currentTourSteps[stepIndex].selector,
      ) as Element | null;
      if (element) {
        const { top } = element.getBoundingClientRect();
        const isInViewport = top >= -offset && top <= window.innerHeight + offset;
        if (!isInViewport) {
          scrollToElementWithCard(element);
        }
        // Update pointer position after scrolling
        setPointerPosition(getElementPosition(element));
      }
    }
  };

  // - -
  // Overlay Variants
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  // - -
  // Pointer Options
  const pointerPadding = currentTourSteps?.[currentStep]?.pointerPadding ?? 30;
  const pointerPadOffset = pointerPadding / 2;
  const pointerRadius = currentTourSteps?.[currentStep]?.pointerRadius ?? 28;
  const placement = currentTourSteps?.[currentStep]?.side ?? 'top';

  const arrowRef = useRef(null);

  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: finalPlacement,
  } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: placement,
    middleware: [
      flip({
        fallbackAxisSideDirection: 'start',
        fallbackPlacements: ['top', 'bottom'],
      }),
      shift(),
      floatingOffset(17),
      arrow((state) => ({ element: arrowRef, padding: state.rects.reference.width })),
    ],
  });

  // - -
  // Card Arrow
  const FloatingCardArrow = () => {
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;

    // Determine arrow positioning based on final placement
    const getArrowStyles = () => {
      const baseStyles = {
        position: 'absolute' as const,
        rotate: '45deg',
        backgroundColor: '#ffffff',
        width: '20px',
        height: '20px',
      };

      if (!finalPlacement) return baseStyles;

      if (finalPlacement.startsWith('top')) {
        return {
          ...baseStyles,
          left: arrowX,
          top: '-27px',
        };
      } else if (finalPlacement.startsWith('bottom')) {
        return {
          ...baseStyles,
          left: arrowX,
          bottom: '-27px',
        };
      } else if (finalPlacement.startsWith('left')) {
        return {
          ...baseStyles,
          left: '-27px',
          top: arrowY,
        };
      } else if (finalPlacement.startsWith('right')) {
        return {
          ...baseStyles,
          right: '-27px',
          top: arrowY,
        };
      }

      return baseStyles;
    };

    return <div ref={arrowRef} style={getArrowStyles()}></div>;
  };

  return (
    <div
      data-name="onboarding-wrapper"
      data-onboarding="dev"
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Container for the Website content */}
      <div
        data-name="onboarding-site"
        style={{
          display: 'block',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* Onboarding Overlay Step Content */}
      {pointerPosition && isOnboardingVisible && (
        <Portal>
          {!interact && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 900,
              }}
            />
          )}
          <motion.div
            data-name="onboarding-overlay"
            style={{
              position: 'absolute',
              inset: 0,
            }}
            initial="hidden"
            animate={isOnboardingVisible ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={refs.setReference}
              data-name="onboarding-pointer"
              style={{
                position: 'relative',
                zIndex: 900,
                boxShadow: `0 0 200vw 200vh rgba(${shadowRgb}, ${shadowOpacity})`,
                borderRadius: `${pointerRadius}px ${pointerRadius}px ${pointerRadius}px ${pointerRadius}px`,
              }}
              initial={
                pointerPosition
                  ? {
                      x: pointerPosition.x - pointerPadOffset,
                      y: pointerPosition.y - pointerPadOffset,
                      width: pointerPosition.width + pointerPadding,
                      height: pointerPosition.height + pointerPadding,
                    }
                  : {}
              }
              animate={
                pointerPosition
                  ? {
                      x: pointerPosition.x - pointerPadOffset,
                      y: pointerPosition.y - pointerPadOffset,
                      width: pointerPosition.width + pointerPadding,
                      height: pointerPosition.height + pointerPadding,
                    }
                  : {}
              }
              transition={cardTransition}
            >
              {/* Card */}
              <motion.div
                ref={refs.setFloating}
                data-name="onboarding-card"
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '100%',
                  minWidth: 'min-content',
                  pointerEvents: 'auto',
                  zIndex: 950,
                  ...floatingStyles,
                }}
                transition={cardTransition}
              >
                {CardComponent ? (
                  <CardComponent
                    step={currentTourSteps?.[currentStep] as Step}
                    currentStep={currentStep}
                    totalSteps={currentTourSteps?.length ?? 0}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    labels={labels}
                  />
                ) : (
                  <DefaultCard
                    step={currentTourSteps?.[currentStep] as Step}
                    currentStep={currentStep}
                    totalSteps={currentTourSteps?.length ?? 0}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    labels={labels}
                  />
                )}
              </motion.div>
              <FloatingCardArrow />
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </div>
  );
};

export default Onboarding;
