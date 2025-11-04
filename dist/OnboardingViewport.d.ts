import React from 'react';
interface OnboardingViewportProps {
    children: React.ReactNode;
    id: string;
}
/**
 * A viewport component for wrapping content that will be targeted by the NextStep onboarding process.
 *
 * This component ensures that the content is positioned correctly and can be scrolled if necessary.
 *
 * @param {React.ReactNode} children - The content to be rendered within the viewport.
 * @param {string} id - The unique identifier for the viewport, used for targeting in the onboarding steps.
 * @returns {JSX.Element} The rendered viewport component.
 *
 * @example
 * <OnboardingViewport id="scrollable-viewport">
 *   <YourScrollableContent />
 * </OnboardingViewport>
 */
declare const OnboardingViewport: ({ children, id }: OnboardingViewportProps) => import("react/jsx-runtime").JSX.Element;
export default OnboardingViewport;
