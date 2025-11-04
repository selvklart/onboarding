'use client';

import { OnboardingProvider, useOnboarding, OnboardingReact } from '@selvklart/onboarding';
import type { Tour } from '@selvklart/onboarding';

const tours: Tour[] = [
  {
    tour: 'norwegian-demo',
    steps: [
      {
        icon: <></>,
        title: 'Velkommen!',
        content: 'Dette er en demonstrasjon av norsk oversettelse. Klikk Neste for å fortsette.',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Steg 2',
        content: 'Dette er det andre trinnet i guidet omvisning.',
        selector: '[data-tour="top-left"]',
        side: 'bottom',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Siste steg',
        content: 'Gratulerer! Du har fullført den norske omvisningen.',
        showControls: true,
        showSkip: false,
      },
    ],
  },
  {
    tour: 'positioning-demo',
    steps: [
      {
        icon: <></>,
        title: 'Welcome!',
        content: 'This tour demonstrates the positioning cutoff prevention feature. Click Next to continue.',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Top Left Corner',
        content: 'This element is in the top-left corner. The card should flip to bottom to avoid cutoff.',
        selector: '[data-tour="top-left"]',
        side: 'left',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Top Right Corner',
        content: 'This element is in the top-right corner. The card should adjust position to stay visible.',
        selector: '[data-tour="top-right"]',
        side: 'top',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Bottom Left Corner',
        content: 'This element is in the bottom-left corner. The card should flip to top.',
        selector: '[data-tour="bottom-left"]',
        side: 'bottom',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Bottom Right Corner',
        content: 'This element is in the bottom-right corner. The card adjusts to prevent overflow.',
        selector: '[data-tour="bottom-right"]',
        side: 'bottom',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Left Edge',
        content: 'This element is on the left edge. Card should position to the right.',
        selector: '[data-tour="left-edge"]',
        side: 'left',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Right Edge',
        content: 'This element is on the right edge. Card should position to the left.',
        selector: '[data-tour="right-edge"]',
        side: 'right',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Center Element',
        content: 'This element is in the center. All positions should work here.',
        selector: '[data-tour="center"]',
        side: 'bottom',
        showControls: true,
        showSkip: true,
      },
      {
        icon: <></>,
        title: 'Tour Complete!',
        content: 'You have seen how the positioning system automatically prevents cards from being cut off by viewport edges.',
        showControls: true,
        showSkip: false,
      },
    ],
  },
];

function DemoContent() {
  const { startOnboarding } = useOnboarding();

  return (
    <div style={{ minHeight: '200vh', padding: '20px', position: 'relative' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Onboarding Library Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
          Test the positioning cutoff prevention feature
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            data-testid="start-norwegian-tour-button"
            onClick={() => startOnboarding('norwegian-demo')}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#10b981',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            Start Norwegian Tour (Norsk)
          </button>
          <button
            data-testid="start-tour-button"
            onClick={() => startOnboarding('positioning-demo')}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#2563eb',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            Start Positioning Tour
          </button>
        </div>
      </header>

      {/* Grid of positioned elements */}
      <div style={{ position: 'relative', minHeight: '150vh' }}>
        {/* Top Left */}
        <div
          data-tour="top-left"
          data-testid="element-top-left"
          style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            padding: '1rem 1.5rem',
            backgroundColor: '#fbbf24',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Top Left
        </div>

        {/* Top Right */}
        <div
          data-tour="top-right"
          data-testid="element-top-right"
          style={{
            position: 'absolute',
            top: '50px',
            right: '50px',
            padding: '1rem 1.5rem',
            backgroundColor: '#f87171',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Top Right
        </div>

        {/* Bottom Left */}
        <div
          data-tour="bottom-left"
          data-testid="element-bottom-left"
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50px',
            padding: '1rem 1.5rem',
            backgroundColor: '#34d399',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Bottom Left
        </div>

        {/* Bottom Right */}
        <div
          data-tour="bottom-right"
          data-testid="element-bottom-right"
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '50px',
            padding: '1rem 1.5rem',
            backgroundColor: '#a78bfa',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Bottom Right
        </div>

        {/* Left Edge */}
        <div
          data-tour="left-edge"
          data-testid="element-left-edge"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50px',
            transform: 'translateY(-50%)',
            padding: '1rem 1.5rem',
            backgroundColor: '#60a5fa',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Left Edge
        </div>

        {/* Right Edge */}
        <div
          data-tour="right-edge"
          data-testid="element-right-edge"
          style={{
            position: 'absolute',
            top: '50%',
            right: '50px',
            transform: 'translateY(-50%)',
            padding: '1rem 1.5rem',
            backgroundColor: '#fb923c',
            borderRadius: '0.5rem',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          Right Edge
        </div>

        {/* Center */}
        <div
          data-tour="center"
          data-testid="element-center"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '2rem 3rem',
            backgroundColor: '#10b981',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1.25rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          Center Element
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <OnboardingProvider>
      <OnboardingReact steps={tours}>
        <DemoContent />
      </OnboardingReact>
    </OnboardingProvider>
  );
}
