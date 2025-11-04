import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DefaultCard from '../DefaultCard';
import { Step } from '../types';

describe('DefaultCard Component', () => {
  const mockNextStep = vi.fn();
  const mockPrevStep = vi.fn();
  const mockSkipTour = vi.fn();
  const mockArrow = <div data-testid="arrow">Arrow</div>;

  const baseStep: Step = {
    title: 'Test Step',
    content: 'This is test content',
    icon: null,
    showControls: true,
    showSkip: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render step title', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('Test Step')).toBeInTheDocument();
    });

    it('should render step content', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('This is test content')).toBeInTheDocument();
    });

    it('should render arrow element', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByTestId('arrow')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const stepWithIcon = { ...baseStep, icon: '🚀' };

      render(
        <DefaultCard
          step={stepWithIcon}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Icon span should not exist
      const iconContainer = screen.queryByText('🚀');
      expect(iconContainer).not.toBeInTheDocument();
    });

    it('should render with JSX content', () => {
      const stepWithJSX = {
        ...baseStep,
        content: (
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        ),
      };

      render(
        <DefaultCard
          step={stepWithJSX}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });
  });

  describe('Progress Display', () => {
    it('should display correct step counter on first step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={5}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('1 of 5')).toBeInTheDocument();
    });

    it('should display correct step counter on middle step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={2}
          totalSteps={5}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('3 of 5')).toBeInTheDocument();
    });

    it('should display correct step counter on last step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={4}
          totalSteps={5}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('5 of 5')).toBeInTheDocument();
    });

    it('should render progress bar with correct width on first step', () => {
      const { container } = render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={4}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      const progressBar = container.querySelector('div[style*="width: 25%"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should render progress bar with correct width on last step', () => {
      const { container } = render(
        <DefaultCard
          step={baseStep}
          currentStep={3}
          totalSteps={4}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      const progressBar = container.querySelector('div[style*="width: 100%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons', () => {
    it('should render "Previous" button when showControls is true', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={1}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /go to previous step/i })).toBeInTheDocument();
    });

    it('should hide "Previous" button when showControls is false', () => {
      const stepWithoutControls = { ...baseStep, showControls: false };

      const { container } = render(
        <DefaultCard
          step={stepWithoutControls}
          currentStep={1}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Find the Previous button by text content in the container
      const buttons = container.querySelectorAll('button');
      const prevButton = Array.from(buttons).find((btn) => btn.textContent === 'Previous');
      expect(prevButton).toHaveStyle({ display: 'none' });
    });

    it('should disable "Previous" button on first step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /go to previous step/i })).toBeDisabled();
    });

    it('should enable "Previous" button on non-first steps', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={1}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /go to previous step/i })).not.toBeDisabled();
    });

    it('should render "Next" button on non-last steps when showControls is true', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /go to next step/i })).toBeInTheDocument();
    });

    it('should hide "Next" button when showControls is false', () => {
      const stepWithoutControls = { ...baseStep, showControls: false };

      const { container } = render(
        <DefaultCard
          step={stepWithoutControls}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Find the Next button by text content in the container
      const buttons = container.querySelectorAll('button');
      const nextButton = Array.from(buttons).find((btn) => btn.textContent === 'Next');
      expect(nextButton).toHaveStyle({ display: 'none' });
    });

    it('should render "Finish" button on last step instead of "Next"', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={2}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /finish tour/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument();
    });

    it('should hide "Finish" button when showControls is false', () => {
      const stepWithoutControls = { ...baseStep, showControls: false };

      const { container } = render(
        <DefaultCard
          step={stepWithoutControls}
          currentStep={2}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Find the Finish button by text content in the container
      const buttons = container.querySelectorAll('button');
      const finishButton = Array.from(buttons).find((btn) => btn.textContent === 'Finish');
      expect(finishButton).toHaveStyle({ display: 'none' });
    });
  });

  describe('Skip Tour Button', () => {
    it('should render "Skip Tour" button when showSkip is true and not on last step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByRole('button', { name: /skip tour/i })).toBeInTheDocument();
    });

    it('should hide "Skip Tour" button when showSkip is false', () => {
      const stepWithoutSkip = { ...baseStep, showSkip: false };

      const { container } = render(
        <DefaultCard
          step={stepWithoutSkip}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Find the Skip Tour button by text content in the container
      const buttons = container.querySelectorAll('button');
      const skipButton = Array.from(buttons).find((btn) => btn.textContent === 'Skip Tour');
      expect(skipButton).toHaveStyle({ display: 'none' });
    });

    it('should not render "Skip Tour" button on last step', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={2}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Skip Tour button should not be in DOM on last step
      const skipButtons = screen.getAllByRole('button', { name: /skip|finish/i });
      const skipTourButton = skipButtons.find((btn) => btn.textContent === 'Skip Tour');
      expect(skipTourButton).toBeUndefined();
    });

    it('should not render "Skip Tour" button when skipTour callback is undefined', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          arrow={mockArrow}
        />
      );

      expect(screen.queryByRole('button', { name: /skip tour/i })).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call prevStep when "Previous" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DefaultCard
          step={baseStep}
          currentStep={1}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      await user.click(screen.getByRole('button', { name: /go to previous step/i }));
      expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it('should call nextStep when "Next" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      await user.click(screen.getByRole('button', { name: /go to next step/i }));
      expect(mockNextStep).toHaveBeenCalledTimes(1);
    });

    it('should call skipTour when "Finish" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DefaultCard
          step={baseStep}
          currentStep={2}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      await user.click(screen.getByRole('button', { name: /finish tour/i }));
      expect(mockSkipTour).toHaveBeenCalledTimes(1);
    });

    it('should call skipTour when "Skip Tour" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      await user.click(screen.getByRole('button', { name: /skip tour/i }));
      expect(mockSkipTour).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single step tour correctly', () => {
      render(
        <DefaultCard
          step={baseStep}
          currentStep={0}
          totalSteps={1}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByText('1 of 1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to previous step/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /finish tour/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument();
    });

    it('should handle empty strings in step properties', () => {
      const emptyStep: Step = {
        title: '',
        content: '',
        icon: null,
        showControls: true,
        showSkip: true,
      };

      render(
        <DefaultCard
          step={emptyStep}
          currentStep={0}
          totalSteps={1}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      // Should render without crashing
      expect(screen.getByText('1 of 1')).toBeInTheDocument();
    });

    it('should handle ReactNode as icon', () => {
      const stepWithReactIcon = {
        ...baseStep,
        icon: <span data-testid="custom-icon">★</span>,
      };

      render(
        <DefaultCard
          step={stepWithReactIcon}
          currentStep={0}
          totalSteps={3}
          nextStep={mockNextStep}
          prevStep={mockPrevStep}
          skipTour={mockSkipTour}
          arrow={mockArrow}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });
});
