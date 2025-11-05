# Selvklart Onboarding

**Selvklart Onboarding** is a lightweight, Next.js-focused onboarding library with smooth animations and smart positioning. Guide your users through interactive product tours with minimal setup.

## Features

- **Smart Positioning** - Automatic card positioning with viewport edge detection using Floating UI
- **Smooth Animations** - Beautiful transitions powered by Motion (Framer Motion)
- **Celebration Effects** - Built-in confetti animation on tour completion
- **Multi-Tour Support** - Define and manage multiple product tours
- **Next.js Navigation** - Seamless integration with Next.js App Router
- **Spotlight Effect** - Customizable focus highlight on target elements
- **Internationalization** - Full label customization for any language
- **Accessibility** - ARIA labels and keyboard-ready structure
- **TypeScript First** - Fully typed API with excellent IntelliSense support

## Use Cases

- **Easier Onboarding** - Guide new users with step-by-step tours
- **Engagement Boost** - Make help docs interactive, so users learn by doing
- **Better Error Handling** - Skip generic toasters—show users exactly what to fix with tailored tours
- **Event-Based Tours** - Trigger custom tours after key actions to keep users coming back

## Installation

```bash
npm install @selvklart/onboarding motion
```

### Peer Dependencies

This library requires the following peer dependencies:

- `motion` >= 11 (Framer Motion)
- `next` >= 14
- `react` >= 18
- `react-dom` >= 18

## Quick Start

```tsx
'use client';

import {
  OnboardingProvider,
  Onboarding,
  useOnboarding,
  type Tour,
} from '@selvklart/onboarding';

// Define your tours
const tours: Tour[] = [
  {
    tour: 'welcome-tour',
    steps: [
      {
        icon: '👋',
        title: 'Welcome!',
        content: 'Let me show you around.',
        selector: '#welcome-button',
        side: 'bottom',
        showControls: true,
      },
      {
        icon: '✨',
        title: 'Amazing Feature',
        content: 'This is where the magic happens.',
        selector: '#feature-area',
        side: 'right',
        showControls: true,
      },
    ],
  },
];

// Component that uses the hook
function YourContent() {
  const { startOnboarding } = useOnboarding();

  return (
    <div>
      <button id="welcome-button" onClick={() => startOnboarding('welcome-tour')}>
        Start Tour
      </button>
      <div id="feature-area">Your feature content</div>
    </div>
  );
}

// Root layout or page
export default function App() {
  return (
    <OnboardingProvider>
      <Onboarding steps={tours}>
        <YourContent />
      </Onboarding>
    </OnboardingProvider>
  );
}
```

## API Reference

### `<OnboardingProvider>`

The context provider that manages onboarding state. Wrap your app with this component.

```tsx
<OnboardingProvider>{children}</OnboardingProvider>
```

**Props:** None

---

### `<Onboarding>`

The main component that renders the onboarding overlay, spotlight, and card.

```tsx
<Onboarding
  steps={tours}
  shadowRgb="0, 0, 0"
  shadowOpacity="0.2"
  cardTransition={{ type: 'spring', bounce: 0.2 }}
  cardComponent={CustomCard}
  scrollToTop={true}
  interact={true}
  labels={customLabels}
>
  {children}
</Onboarding>
```

#### Props

| Prop             | Type                                | Default                                | Description                                                  |
| ---------------- | ----------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `children`       | `React.ReactNode`                   | Required                               | Your application content                                     |
| `steps`          | `Tour[]`                            | Required                               | Array of tour objects                                        |
| `shadowRgb`      | `string`                            | `'0, 0, 0'`                            | RGB values for the spotlight shadow (e.g., `'255, 0, 0'`)   |
| `shadowOpacity`  | `string`                            | `'0.2'`                                | Opacity of the spotlight shadow (0-1)                        |
| `cardTransition` | `Transition`                        | `{ type: 'spring', bounce: 0.2 }`      | Motion transition configuration                              |
| `cardComponent`  | `React.ComponentType<CardProps>`    | `DefaultCard`                          | Custom card component                                        |
| `scrollToTop`    | `boolean`                           | `true`                                 | Scroll to top when tour ends                                 |
| `interact`       | `boolean`                           | `true`                                 | Allow interaction with highlighted element during tour       |
| `labels`         | `OnboardingLabels`                  | English defaults (see Labels section)  | Custom labels for internationalization                       |

---

### `useOnboarding()` Hook

Access onboarding state and controls from anywhere in your app.

```tsx
const {
  currentStep,
  currentTour,
  setCurrentStep,
  closeOnboarding,
  startOnboarding,
  isOnboardingVisible,
} = useOnboarding();
```

#### Return Values

| Property              | Type                                      | Description                                        |
| --------------------- | ----------------------------------------- | -------------------------------------------------- |
| `currentStep`         | `number`                                  | Current step index (0-based)                       |
| `currentTour`         | `string \| null`                          | Current tour name                                  |
| `setCurrentStep`      | `(step: number, delay?: number) => void`  | Set the current step with optional delay (ms)      |
| `closeOnboarding`     | `() => void`                              | Close/hide the onboarding overlay                  |
| `startOnboarding`     | `(tourName: string) => void`              | Start a specific tour by name                      |
| `isOnboardingVisible` | `boolean`                                 | Whether the onboarding overlay is currently visible|

---

### Tour Interface

Define multiple tours for different flows in your app.

```typescript
interface Tour {
  tour: string;   // Unique tour identifier
  steps: Step[];  // Array of step objects
}
```

**Example:**

```tsx
const tours: Tour[] = [
  {
    tour: 'first-visit',
    steps: [/* steps */],
  },
  {
    tour: 'advanced-features',
    steps: [/* steps */],
  },
];
```

---

### Step Interface

Each step defines a single point in your onboarding tour.

```typescript
interface Step {
  // Content
  icon?: React.ReactNode | string | null;
  title: string;
  content: React.ReactNode;
  selector: string;

  // Positioning
  side?: 'top' | 'bottom' | 'left' | 'right';
  pointerPadding?: number;
  pointerRadius?: number;

  // Navigation
  nextRoute?: string;
  prevRoute?: string;

  // UI
  showControls?: boolean;
}
```

#### Step Properties

| Property          | Type                                     | Default     | Description                                                                 |
| ----------------- | ---------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `icon`            | `React.ReactNode \| string \| null`      | `undefined` | Icon or element to display with the title                                   |
| `title`           | `string`                                 | Required    | Title of the step                                                           |
| `content`         | `React.ReactNode`                        | Required    | Main content of the step                                                    |
| `selector`        | `string`                                 | Required    | CSS selector for the target element (e.g., `'#my-button'`)                 |
| `side`            | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`     | Preferred side for card placement (auto-flips if cutoff detected)           |
| `pointerPadding`  | `number`                                 | `10`        | Padding around the spotlight (in pixels)                                    |
| `pointerRadius`   | `number`                                 | `8`         | Border radius of the spotlight (in pixels)                                  |
| `nextRoute`       | `string`                                 | `undefined` | Next.js route to navigate to when going to next step                        |
| `prevRoute`       | `string`                                 | `undefined` | Next.js route to navigate to when going to previous step                    |
| `showControls`    | `boolean`                                | `true`      | Show navigation buttons (prev, next, skip) in default card                  |

**Example:**

```tsx
{
  icon: '🚀',
  title: 'Dashboard Overview',
  content: 'This is your main dashboard where you can see all your metrics.',
  selector: '#dashboard',
  side: 'bottom',
  pointerPadding: 15,
  pointerRadius: 12,
  showControls: true,
}
```

---

### OnboardingLabels Interface

Customize all text labels for internationalization.

```typescript
interface OnboardingLabels {
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
```

#### Default Labels (English)

```tsx
const defaultLabels = {
  next: 'Next',
  previous: 'Previous',
  finish: 'Finish',
  skip: 'Skip Tour',
  of: 'of',
  ariaLabels: {
    closeButton: 'Close onboarding',
    nextButton: 'Go to next step',
    previousButton: 'Go to previous step',
    finishButton: 'Finish onboarding',
    skipButton: 'Skip tour',
    card: 'Onboarding card',
  },
};
```

#### Internationalization Example

```tsx
const norwegianLabels: OnboardingLabels = {
  next: 'Neste',
  previous: 'Forrige',
  finish: 'Fullfør',
  skip: 'Hopp over',
  of: 'av',
  ariaLabels: {
    closeButton: 'Lukk introduksjon',
    nextButton: 'Gå til neste steg',
    previousButton: 'Gå til forrige steg',
    finishButton: 'Fullfør introduksjon',
    skipButton: 'Hopp over tur',
    card: 'Introduksjonskort',
  },
};

<Onboarding steps={tours} labels={norwegianLabels}>
  {children}
</Onboarding>
```

---

### Custom Card Component

Create your own card component for complete design control.

#### CardComponentProps Interface

```typescript
interface CardComponentProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  labels?: OnboardingLabels;
}
```

#### Example Custom Card

```tsx
import type { CardComponentProps } from '@selvklart/onboarding';

export function CustomCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  labels,
}: CardComponentProps) {
  return (
    <div className="custom-card">
      <h2>
        {step.icon} {step.title}
      </h2>
      <p>{step.content}</p>
      <div className="card-footer">
        <span>
          {currentStep + 1} {labels?.of || 'of'} {totalSteps}
        </span>
        <div>
          {currentStep > 0 && (
            <button onClick={prevStep}>
              {labels?.previous || 'Previous'}
            </button>
          )}
          <button onClick={nextStep}>
            {currentStep === totalSteps - 1
              ? labels?.finish || 'Finish'
              : labels?.next || 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Use it
<Onboarding steps={tours} cardComponent={CustomCard}>
  {children}
</Onboarding>
```

---

## Advanced Usage

### Multi-Route Tours

Navigate between different pages during a tour using `nextRoute` and `prevRoute`:

```tsx
const tours: Tour[] = [
  {
    tour: 'full-app-tour',
    steps: [
      {
        title: 'Dashboard',
        content: 'This is your dashboard.',
        selector: '#dashboard',
        nextRoute: '/settings', // Navigate to settings on next
      },
      {
        title: 'Settings',
        content: 'Here you can adjust your preferences.',
        selector: '#settings-panel',
        prevRoute: '/', // Navigate back to home on previous
        nextRoute: '/profile',
      },
      {
        title: 'Profile',
        content: 'Manage your profile here.',
        selector: '#profile',
        prevRoute: '/settings',
      },
    ],
  },
];
```

The library will automatically:
1. Navigate to the specified route
2. Wait for the target element to appear in the DOM
3. Advance to the next step

---

### Programmatic Control

Control tours from anywhere in your app:

```tsx
function TourControls() {
  const { startOnboarding, closeOnboarding, setCurrentStep, currentStep } = useOnboarding();

  return (
    <div>
      <button onClick={() => startOnboarding('welcome-tour')}>
        Start Welcome Tour
      </button>
      <button onClick={() => startOnboarding('advanced-tour')}>
        Start Advanced Tour
      </button>
      <button onClick={closeOnboarding}>
        Close Tour
      </button>
      <button onClick={() => setCurrentStep(2)}>
        Jump to Step 3
      </button>
      <p>Current Step: {currentStep + 1}</p>
    </div>
  );
}
```

---

### Custom Spotlight Styling

Customize the spotlight shadow color and opacity:

```tsx
<Onboarding
  steps={tours}
  shadowRgb="139, 0, 139"  // Dark magenta
  shadowOpacity="0.4"       // 40% opacity
>
  {children}
</Onboarding>
```

---

### Prevent Interaction with Highlighted Elements

Disable clicks on highlighted elements during the tour:

```tsx
<Onboarding
  steps={tours}
  interact={false}  // Users cannot click highlighted elements
>
  {children}
</Onboarding>
```

---

### Custom Animations

Customize card animations using Motion's transition API:

```tsx
<Onboarding
  steps={tours}
  cardTransition={{
    type: 'spring',
    stiffness: 300,
    damping: 20,
  }}
>
  {children}
</Onboarding>
```

---

## How It Works

### Smart Positioning

The library uses `@floating-ui/react-dom` to intelligently position cards:

1. **Preferred Side**: Cards try to render on the side you specify
2. **Auto-Flip**: If the card would be cut off by the viewport, it automatically flips to the opposite side
3. **Shift**: Cards shift horizontally/vertically to stay within viewport bounds
4. **Arrow**: A dynamic arrow points to the target element based on final position

### Spotlight Effect

The spotlight uses a box-shadow technique:

```css
box-shadow: 0 0 200vw 200vh rgba(0, 0, 0, 0.2);
```

This creates a dark overlay everywhere except the highlighted element.

### Confetti Celebration

When a tour is completed, confetti automatically fires with:
- 100 particles
- 70-degree spread
- Respects `prefers-reduced-motion`

---

## TypeScript Support

All types are exported for your convenience:

```tsx
import type {
  Tour,
  Step,
  OnboardingLabels,
  CardComponentProps,
} from '@selvklart/onboarding';
```

---

## Browser Support

This library supports all modern browsers that support:
- ES Modules
- CSS Grid
- Intersection Observer
- Mutation Observer

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Credits

- Built by [Selvklart AS](https://github.com/selvklart)
- Powered by [Floating UI](https://floating-ui.com/), [Motion](https://motion.dev/), and [Radix UI](https://www.radix-ui.com/)
