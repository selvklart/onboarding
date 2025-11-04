## Selvklart Onboarding

**Selvklart Onboarding** is a lightweight onboarding library for Next.js / React applications. It utilizes [motion](https://www.motion.dev) for smooth animations and supports multiple React frameworks including Next.js, React Router, and Remix.

**Some of the use cases:**

- **Easier Onboarding**: Guide new users with step-by-step tours
- **Engagement Boost**: Make help docs interactive, so users learn by _doing_.
- **Better Error Handling**: Skip generic toasters—show users exactly what to fix with tailored tours.
- **Event-Based Tours**: Trigger custom tours after key actions to keep users coming back.

The library allows users to use custom cards (tooltips) for easier integration.

## Getting Started

```bash
# npm
npm i @selvklart/onboarding motion
# pnpm
pnpm add @selvklart/onboarding motion
# yarn
yarn add @selvklart/onboarding motion
# bun
bun add @selvklart/onboarding motion
```

### Navigation Adapters (v2.0+)

@selvklart/onboarding 2.0 introduces a framework-agnostic routing system through navigation adapters. Each adapter is packaged separately to minimize bundle size - only the adapter you import will be included in your bundle.

> **Important:** Make sure to import the adapter you need in your app in order to access full functionality. Without an adapter, navigation features like `nextRoute` and `prevRoute` may not work properly.

#### Built-in Adapters

##### Next.js

@selvklart/onboarding uses Next.js adapter as default, therefore you don't need to import it.

```tsx
// app/layout.tsx or pages/_app.tsx
import { NextStep, NextStepProvider } from '@selvklart/onboarding';;

export default function Layout({ children }) {
  return (
    <NextStepProvider>
      <NextStep steps={steps}>{children}</NextStep>
    </NextStepProvider>
  );
}
```

##### React Router as a Framework

```tsx
//app/root.tsx
import { NextStepProvider, NextStepReact, type Tour } from '@selvklart/onboarding';
import { useReactRouterAdapter } from '@selvklart/onboarding/adapters/react-router';

export default function App() {
  return (
    <NextStepProvider>
      <NextStepReact navigationAdapter={useReactRouterAdapter} steps={steps}>
        <Outlet />
      </NextStepReact>
    </NextStepProvider>
  );
}
```

##### Remix

```tsx
// root.tsx
import { NextStepProvider, NextStepReact } from '@selvklart/onboarding';
import { useRemixAdapter } from 'nextstepjs/adapters/remix';

export default function App() {
  return (
    <NextStepProvider>
      <NextStepReact navigationAdapter={useRemixAdapter} steps={steps}>
        <Outlet />
      </NextStepReact>
    </NextStepProvider>
  );
}
```

##### Important Configuration for Vite (React Router or Remix)

If you're using Vite with React Router or Remix, add the following configuration to your `vite.config.ts`:

```ts
export default defineConfig({
  ssr: {
    noExternal: ['nextstepjs', 'motion'],
  },
});
```

Vite also requires `next/navigation` to be mocked in order to work properly. 

1. Create a mock file for `Next`, such as `next-navigation.ts`, and place it in `/src/mocks`
```typescript
// Mock for Next.js navigation to prevent build errors with @selvklart/onboarding
// This file is used to mock Next.js imports when using @selvklart/onboarding in a Vite app

export const useRouter = () => {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
};

export const usePathname = () => {
  return '';
};

export const useSearchParams = () => {
  return new URLSearchParams();
};

export const useParams = () => {
  return {};
};
```

2. Update `vite.config.mts` to use the proper alias for Next.js navigation imports
```typescript
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Mock Next.js navigation imports that @selvklart/onboarding might try to access
      {
        find: 'next/navigation',
        replacement: path.join(process.cwd(), 'src/mocks/next-navigation.ts'),
      },
    ]
  }
})
```

##### Custom Navigation Adapter

You can create your own navigation adapter for any routing solution by implementing the `NavigationAdapter` interface:

```tsx
import { NextStepReact } from '@selvklart/onboarding';
import type { NavigationAdapter } from '@selvklart/onboarding';

const useCustomAdapter = (): NavigationAdapter => {
  return {
    push: (path: string) => {
      // Your navigation logic here
      // Example: history.push(path)
    },
    getCurrentPath: () => {
      // Your path retrieval logic here
      // Example: window.location.pathname
      return window.location.pathname;
    },
  };
};

const App = () => {
  return (
    <NextStepReact navigationAdapter={useCustomAdapter} steps={steps}>
      {children}
    </NextStepReact>
  );
};
```

#### Troubleshooting

If you encounter an error related to module exports when using the Pages Router, it is likely due to a mismatch between ES modules (which use `export` statements) and CommonJS modules (which use `module.exports`). The `nextstepjs` package uses ES module syntax, but your Next.js project might be set up to use CommonJS.

To resolve this issue, ensure that your Next.js project is configured to support ES modules. You can do this by updating your `next.config.js` file to include the following configuration:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ['@selvklart/onboarding'],
};

export default nextConfig;
```

### Custom Card

You can create a custom card component for greater control over the design:

| Prop          | Type     | Description                                                                     |
| ------------- | -------- | ------------------------------------------------------------------------------- |
| `step`        | `Object` | The current `Step` object from your steps array, including content, title, etc. |
| `currentStep` | `number` | The index of the current step in the steps array.                               |
| `totalSteps`  | `number` | The total number of steps in the onboarding process.                            |
| `nextStep`    |          | A function to advance to the next step in the onboarding process.               |
| `prevStep`    |          | A function to go back to the previous step in the onboarding process.           |
| `arrow`       |          | Returns an SVG object, the orientation is controlled by the steps side prop     |
| `skipTour`    |          | A function to skip the tour                                                     |

```tsx
'use client';
import type { CardComponentProps } from '@selvklart/onboarding';

export const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  return (
    <div>
      <h1>
        {step.icon} {step.title}
      </h1>
      <h2>
        {currentStep} of {totalSteps}
      </h2>
      <p>{step.content}</p>
      <button onClick={prevStep}>Previous</button>
      <button onClick={nextStep}>Next</button>
      <button onClick={skipTour}>Skip</button>
      {arrow}
    </div>
  );
};
```

### Tours Array

@selvklart/onboarding supports multiple "tours", allowing you to create multiple product tours:

```tsx
import { Tour } from '@selvklart/onboarding';

const steps: Tour[] = [
  {
    tour: 'firstTour',
    steps: [
      // Step objects
    ],
  },
  {
    tour: 'secondTour',
    steps: [
      // Step objects
    ],
  },
];
```

### Step Object

| Prop                   | Type                                     | Description                                                                                                                                         |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`                 | `React.ReactNode`, `string`, `null`      | An icon or element to display alongside the step title.                                                                                             |
| `title`                | `string`                                 | The title of your step                                                                                                                              |
| `content`              | `React.ReactNode`                        | The main content or body of the step.                                                                                                               |
| `selector`             | `string`                                 | Optional. A string used to target an `id` that this step refers to. If not provided, card will be displayed in the center top of the document body. |
| `side`                 | `"top"`, `"bottom"`, `"left"`, `"right"` | Optional. Determines where the tooltip should appear relative to the selector.                                                                      |
| `showControls`         | `boolean`                                | Optional. Determines whether control buttons (next, prev) should be shown if using the default card.                                                |
| `showSkip`             | `boolean`                                | Optional. Determines whether skip button should be shown if using the default card.                                                                 |
| `blockKeyboardControl` | `boolean`                                | Optional. Determines whether keyboard control should be blocked                                                                                     |
| `pointerPadding`       | `number`                                 | Optional. The padding around the pointer (keyhole) highlighting the target element.                                                                 |
| `pointerRadius`        | `number`                                 | Optional. The border-radius of the pointer (keyhole) highlighting the target element.                                                               |
| `nextRoute`            | `string`                                 | Optional. The route to navigate to when moving to the next step.                                                                                    |
| `prevRoute`            | `string`                                 | Optional. The route to navigate to when moving to the previous step.                                                                                |
| `viewportID`           | `string`                                 | Optional. The id of the viewport element to use for positioning. If not provided, the document body will be used.                                   |

> **Note** `@selvklart/onboarding` handles card cutoff from screen sides. If side is right or left and card is out of the viewport, side would be switched to `top`. If side is top or bottom and card is out of the viewport, then side would be flipped between top and bottom.

### Target Anything

Target anything in your app using the element's `id` attribute.

```tsx
<div id="nextstep-step1">Onboard Step</div>
```

### Routing During a Tour

NextStep allows you to navigate between different routes during a tour using the `nextRoute` and `prevRoute` properties in the step object. These properties enable seamless transitions between different pages or sections of your application.

- `nextRoute`: Specifies the route to navigate to when the "Next" button is clicked.
- `prevRoute`: Specifies the route to navigate to when the "Previous" button is clicked.

When `nextRoute` or `prevRoute` is provided, NextStep will use Next.js's `next/navigation` to navigate to the specified route.

### Using NextStepViewport and viewportID

When a selector is in a scrollable area, it is best to wrap the content of the scrollable area with `NextStepViewport`. This component takes `children` and an `id` as prop. By providing the `viewportID` to the step, NextStep will target this element within the viewport. This ensures that the step is anchored to the element even if the container is scrollable.

Here's an example of how to use `NextStepViewport`:

```tsx
<div className="relative overflow-auto h-64">
  <NextStepViewport id="scrollable-viewport">{children}</NextStepViewport>
</div>
```

### Example `steps`

```tsx
[
  {
    tour: 'firsttour',
    steps: [
      {
        icon: <>👋</>,
        title: 'Tour 1, Step 1',
        content: <>First tour, first step</>,
        selector: '#tour1-step1',
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: '/foo',
        prevRoute: '/bar',
      },
      {
        icon: <>🎉</>,
        title: 'Tour 1, Step 2',
        content: <>First tour, second step</>,
        selector: '#tour1-step2',
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        viewportID: 'scrollable-viewport',
      },
    ],
  },
  {
    tour: 'secondtour',
    steps: [
      {
        icon: <>🚀</>,
        title: 'Second tour, Step 1',
        content: <>Second tour, first step!</>,
        selector: '#nextstep-step1',
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: '/foo',
        prevRoute: '/bar',
      },
    ],
  },
];
```

### NextStep & NextStepReact Props

| Property              | Type                                               | Description                                                                                                   |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `children`            | `React.ReactNode`                                  | Your website or application content                                                                           |
| `steps`               | `Array[]`                                          | Array of Tour objects defining each step of the onboarding                                                    |
| `navigationAdapter`   | `NavigationAdapter`                                | Optional. Router adapter for navigation (defaults to Next.js on NextStep and window adapter on NextStepReact) |
| `showNextStep`        | `boolean`                                          | Controls visibility of the onboarding overlay                                                                 |
| `shadowRgb`           | `string`                                           | RGB values for the shadow color surrounding the target area                                                   |
| `shadowOpacity`       | `string`                                           | Opacity value for the shadow surrounding the target area                                                      |
| `cardComponent`       | `React.ComponentType`                              | Custom card component to replace the default one                                                              |
| `cardTransition`      | `Transition`                                       | Motion transition object for step transitions                                                                 |
| `onStart`             | `(tourName: string \| null) => void`               | Callback function triggered when the tour starts                                                              |
| `onStepChange`        | `(step: number, tourName: string \| null) => void` | Callback function triggered when the step changes                                                             |
| `onComplete`          | `(tourName: string \| null) => void`               | Callback function triggered when the tour completes                                                           |
| `onSkip`              | `(step: number, tourName: string \| null) => void` | Callback function triggered when the user skips the tour                                                      |
| `clickThroughOverlay` | `boolean`                                          | Optional. If true, overlay background is clickable, default is false                                          |
| `disableConsoleLogs`  | `boolean`                                          | Optional. If true, console logs are disabled, default is false                                                |
| `scrollToTop`         | `boolean`                                          | Optional. If true, the page will scroll to the top when the tour ends, default is true                        |
| `noInViewScroll`      | `boolean`                                          | Optional. If true, the page will not scroll to the target element when it is in view, default is false        |

```tsx
<NextStep
  steps={steps}
  showNextStep={true}
  shadowRgb="55,48,163"
  shadowOpacity="0.8"
  cardComponent={CustomCard}
  cardTransition={{ duration: 0.5, type: 'spring' }}
  onStepChange={(step, tourName) => console.log(`Step changed to ${step} in ${tourName}`)}
  onComplete={(tourName) => console.log(`Tour completed: ${tourName}`)}
  onSkip={(step, tourName) => console.log(`Tour skipped: ${step} in ${tourName}`)}
  clickThroughOverlay={false}
>
  {children}
</NextStep>
```

## useNextStep Hook

useNextStep hook allows you to control the tour from anywhere in your app.

```tsx
import { useNextStep } from 'nextstepjs';
....

const { startNextStep, closeNextStep } = useNextStep();

const onClickHandler = (tourName: string) => {
  startNextStep(tourName);
};
```

## Keyboard Navigation

NextStep supports keyboard navigation:

- Right Arrow: Next step
- Left Arrow: Previous step
- Escape: Skip tour

## Localization

NextStep is a lightweight library and does not come with localization support. However, you can easily switch between languages by supplying the `steps` array based on locale.

## Testing

This library includes comprehensive testing infrastructure to ensure reliability and correctness.

### Running Tests

```bash
# Run unit and component tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Test Structure

The project includes three types of tests:

#### 1. Unit Tests (`src/__tests__/positioning.test.ts`)
Tests the core positioning logic that prevents cards from being cut off by viewport edges:
- Tests all 12 positioning variations (top, bottom, left, right, and combinations)
- Tests cutoff detection for all viewport edges
- Tests position flipping behavior when cards would overflow
- Tests the 256px threshold used for cutoff calculations
- Tests mobile viewport scenarios
- **39 test cases** covering edge cases and null handling

#### 2. Component Tests (`src/__tests__/DefaultCard.test.tsx`)
Tests the DefaultCard component functionality:
- Basic rendering of title, content, icon, and arrow
- Progress bar display and step counter
- Navigation button visibility and states
- "Previous" button disabled state on first step
- "Next" button changes to "Finish" on last step
- "Skip Tour" button visibility based on configuration
- User interaction callbacks (nextStep, prevStep, skipTour)
- Edge cases like single-step tours and empty content
- **30 test cases** ensuring UI correctness

#### 3. End-to-End Tests (`e2e/positioning.spec.ts`)
Tests the complete onboarding flow in a real browser with Next.js:
- Tour initialization and navigation
- Positioning behavior for elements at all viewport edges (top-left, top-right, bottom-left, bottom-right, left, right, center)
- Card visibility without cutoff for all positions
- Skip tour functionality
- Backward navigation with Previous button
- Finish button on last step
- Step counter accuracy
- Spotlight effect on target elements
- **18 test scenarios** covering real-world usage

### Test Demo Application

A full Next.js demo application is available in `examples/nextjs-app/` to manually test the library:

```bash
# Navigate to the demo app
cd examples/nextjs-app

# Install dependencies
npm install

# Run the demo
npm run dev
```

Visit `http://localhost:3000` to see the positioning demo that showcases:
- Elements positioned at all viewport edges
- Automatic card repositioning to prevent cutoff
- Tour navigation and controls
- Visual demonstration of the positioning fix

### Testing Philosophy

The comprehensive test suite ensures:
1. **Positioning Logic Correctness**: The core algorithm that prevents cards from being cut off is thoroughly tested with precise boundary conditions
2. **Component Reliability**: All UI components work correctly with various configurations and edge cases
3. **Real-World Validation**: E2E tests verify the library works as expected in actual Next.js applications
4. **Regression Prevention**: Tests catch breaking changes during development

### Coverage

The test suite provides excellent coverage of:
- Core positioning algorithm (checkSideCutOff function)
- DefaultCard component rendering and interactions
- Tour navigation and state management
- Edge cases and boundary conditions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Credits

- [Onborda](https://github.com/uixmat/onborda) for the inspiration and some code snippets.
