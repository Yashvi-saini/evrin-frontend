# EVRIN --- Frontend-First Implementation Guide

## Regime-Aware Rainfall Intelligence

**Problem Statement:** SIH 2026 --- PS 26080\
**Title:** Regime-Aware AI Post-Processing of Monsoon Rainfall
Forecasts\
**Current phase:** Frontend-first prototype with simulated backend.

------------------------------------------------------------------------

# 1. Purpose

This document is the implementation contract for EVRIN.

We are currently building a frontend prototype for a demo. The real
ML/backend pipeline will take time, so the first version will simulate
backend responses.

However, this must NOT become a collection of hardcoded React
components.

The frontend must be architected as if a real backend already exists:

``` text
UI
  ↓
Domain contracts
  ↓
Repository/API interface
  ↓
Mock implementation today
  ↓
Real HTTP implementation later
```

The UI must not care whether data comes from mock fixtures or a
production backend.

------------------------------------------------------------------------

# 2. Understand the Problem

Rainfall forecast errors over India vary with weather regimes such as
active monsoon, break monsoon, monsoon lows/depressions, orographic
rainfall, coastal rainfall and western disturbances.

A single bias-correction method may not work equally well in all
situations.

The challenge is to build an AI/ML rainfall post-processing system that
first identifies the prevailing weather regime and then applies a
suitable correction to the raw NWP rainfall forecast.

The goal is to improve district/grid-level rainfall forecasts,
especially heavy and very heavy rainfall events.

Expected outputs include:

-   Weather regime classifier
-   Bias-corrected rainfall forecast
-   Probability of rainfall exceeding operational thresholds
-   District-level rainfall table/map
-   Verification using RMSE, ETS, CSI, POD, FAR and FSS

------------------------------------------------------------------------

# 3. What EVRIN Actually Does

EVRIN does **not** replace the NWP model.

It is a post-processing layer:

``` text
Raw NWP Forecast
       ↓
Atmospheric Features
       ↓
Weather Regime Identification
       ↓
Regime-Aware Correction
       ↓
Extreme-Rain Calibration
       ↓
Uncertainty Estimation
       ↓
EVRIN Forecast
```

The frontend must communicate this story clearly.

A user should be able to understand:

1.  What is the current weather regime?
2.  What did raw NWP predict?
3.  What does EVRIN predict after correction?
4.  Why did EVRIN change the forecast?
5.  How confident is the result?
6.  What is the probability of heavy/very heavy rainfall?
7.  How does EVRIN compare with raw NWP?

------------------------------------------------------------------------

# 4. Demo Strategy

## Stage A --- Now

``` text
Next.js
  ↓
Feature-Sliced frontend
  ↓
Repository/API interface
  ↓
Mock repository
  ↓
Scenario fixtures
```

## Stage B --- Later

``` text
Next.js
  ↓
Same repository/API interface
  ↓
HTTP API client
  ↓
EVRIN backend
  ↓
ML/data pipeline
  ↓
NWP + observations + atmospheric data
```

The UI should require little or no modification when Stage B arrives.

------------------------------------------------------------------------

# 5. What NOT to Do

Do not:

-   put large forecast objects directly inside JSX;
-   hardcode rainfall values across components;
-   call `fetch()` from random UI components;
-   couple widgets directly to mock data;
-   put API URLs directly inside components;
-   create one giant `utils.ts`;
-   put everything in `components/`;
-   build authentication for the demo;
-   build a database for the demo;
-   build Kubernetes/Docker infrastructure before the UI works;
-   train the real ML pipeline before the demo architecture is stable;
-   implement the entire application in one step.

------------------------------------------------------------------------

# 6. Technology Direction

Recommended:

``` text
Next.js
TypeScript
App Router
Tailwind CSS
shadcn/ui
Lucide
Recharts (or another suitable chart library)
```

For the map, choose a GIS-capable library only after checking the actual
requirements. Possible choices include MapLibre, Leaflet or deck.gl.

Do not add a heavy dependency without a reason.

------------------------------------------------------------------------

# 7. Feature-Sliced Design

Use Feature-Sliced Design.

``` text
src/
├── app/
├── widgets/
├── features/
├── entities/
├── shared/
└── mocks/
```

Meaning:

``` text
app       → Next.js routing and page composition
widgets   → large page-level UI blocks
features  → user actions/interactions
entities  → domain concepts
shared    → generic reusable code
mocks     → temporary backend simulation
```

Do not finalize the exact structure blindly. The coding LLM must inspect
the existing repository first and propose the final architecture before
implementation.

------------------------------------------------------------------------

# 8. Product Modules

Initial routes:

``` text
/overview
/forecast
/regimes
/extremes
/verification
/models
/data
```

The root route can redirect to `/overview`.

The most important modules are:

-   Overview
-   Forecast
-   Regimes
-   Extremes
-   Verification

Models and Data can remain lightweight for the demo.

------------------------------------------------------------------------

# 9. Overview Dashboard

The Overview page is the main demo screen.

Conceptually:

``` text
Topbar
│
├── Current Regime
├── Heavy Rainfall Risk
├── Correction Impact
└── Forecast Confidence
│
├──────────────────────────────────────┐
│                                      │
│              INDIA MAP               │
│                                      │
├──────────────────────┬───────────────┤
│ Regime Diagnosis     │ Target        │
│                      │ Inspection    │
├──────────────────────┴───────────────┤
│ Correction Drivers                   │
└──────────────────────────────────────┘
```

------------------------------------------------------------------------

# 10. KPI Cards

Use four primary metrics:

``` text
CURRENT REGIME
ACTIVE MONSOON
78% confidence
```

``` text
HEAVY RAINFALL RISK
124 mm
HIGH
```

``` text
CORRECTION IMPACT
+26 mm
EVRIN correction
```

``` text
FORECAST CONFIDENCE
87%
HIGH
```

These are prototype values until real model outputs exist.

------------------------------------------------------------------------

# 11. India Map

The map is the primary visualization.

Required layers:

``` text
Raw NWP
EVRIN Corrected
Difference
Heavy Rain Probability
Regime
Uncertainty
```

When a district is selected, show:

``` text
District
Current regime
Raw NWP rainfall
EVRIN rainfall
Correction
Heavy-rain probability
Very-heavy probability
Confidence
Uncertainty
```

The map should look like scientific GIS, not a cyberpunk AI dashboard.

------------------------------------------------------------------------

# 12. Weather Regimes

Minimum demo regimes:

``` text
Active Monsoon
Break Monsoon
Monsoon Depression
Orographic Convection
Coastal Rainfall
Western Disturbance
Transition / Mixed
```

Do not only display one hard label.

Show regime probabilities:

``` text
Active Monsoon          78%
Monsoon Depression      14%
Orographic Convection     5%
Break Monsoon             3%
```

Domain model:

``` ts
type RegimeProbability = {
  regime: Regime;
  probability: number;
};
```

------------------------------------------------------------------------

# 13. Regime Timeline

Show:

``` text
Past              Now               Next 72h

Break ───────── Active ───────── Active
                  ↑
                Current
```

The timeline must be driven by data rather than hardcoded markup.

------------------------------------------------------------------------

# 14. Raw vs EVRIN

This is one of the most important UI elements.

Example:

``` text
                    RAW NWP      EVRIN

24h rainfall         52 mm       78 mm
P75                  64 mm       94 mm
P90                  88 mm      112 mm
```

Show the correction:

``` text
+26 mm
```

The visual story is:

``` text
Raw forecast
    ↓
Regime-aware correction
    ↓
EVRIN forecast
```

------------------------------------------------------------------------

# 15. Uncertainty

Do not make the system appear purely deterministic.

Show:

``` text
P50 = 78 mm
P75 = 94 mm
P90 = 112 mm

Uncertainty:
52 — 112 mm

Confidence:
87%
```

These are simulated values for the prototype.

------------------------------------------------------------------------

# 16. Extreme Rainfall

Create:

``` text
HEAVY RAINFALL
P(Rain > operational threshold)

82%
```

and:

``` text
VERY HEAVY RAINFALL

61%
```

Also show a district table:

``` text
District             Heavy Risk

Meerut                  82%
Muzaffarnagar           76%
Saharanpur              71%
Dehradun                89%
```

These values are demo fixtures until actual model outputs are available.

------------------------------------------------------------------------

# 17. Correction Drivers

Create an explainability section:

``` text
CORRECTION DRIVERS

01  Active monsoon regime
02  High low-level moisture
03  Historical NWP bias
04  Orographic influence
```

Use structured data:

``` ts
type CorrectionDriver = {
  id: string;
  title: string;
  description?: string;
  contribution?: number;
};
```

Do not scatter explanatory strings throughout JSX.

------------------------------------------------------------------------

# 18. Verification

The Verification page should show the metrics named in the problem
statement:

``` text
RMSE
ETS
CSI
POD
FAR
FSS
```

Prototype example:

  Metric     Raw NWP   EVRIN
  -------- --------- -------
  RMSE          42.8    34.9
  ETS           0.31    0.45
  CSI           0.41    0.57
  POD           0.62    0.74
  FAR           0.38    0.29
  FSS           0.52    0.68

These MUST be labelled as simulated/prototype results until actual
verification is performed.

Never present simulated scientific results as real measured performance.

------------------------------------------------------------------------

# 19. Regime-Wise Verification

Because EVRIN is regime-aware, show verification by regime.

Example:

``` text
                  Raw NWP     EVRIN

Active Monsoon      0.42       0.61
Break Monsoon       0.51       0.64
Depression          0.36       0.58
Orographic          0.39       0.63
Coastal             0.44       0.59
```

The exact metric and real values can be decided when actual verification
is implemented.

------------------------------------------------------------------------

# 20. Demo Scenarios

Create at least:

``` text
active-monsoon
break-monsoon
monsoon-depression
orographic
coastal
```

A scenario should contain:

``` ts
type ForecastScenario = {
  id: string;
  name: string;

  location: {
    district: string;
    state: string;
    latitude: number;
    longitude: number;
  };

  regime: RegimeResult;
  forecast: ForecastResult;
  extremes: ExtremeRiskResult;
  uncertainty: UncertaintyResult;
  correctionDrivers: CorrectionDriver[];
  verification: VerificationResult;
};
```

Switching the scenario must update the whole dashboard.

------------------------------------------------------------------------

# 21. Demo Scenario Selector

Add:

``` text
Demo Scenario

[ Active Monsoon ▼ ]
```

Example changes:

``` text
Active Monsoon
52 mm → 78 mm

Break Monsoon
42 mm → 28 mm

Monsoon Depression
86 mm → 128 mm
```

This demonstrates that correction behavior changes with regime.

------------------------------------------------------------------------

# 22. Run EVRIN

Create a `Run EVRIN` feature.

When clicked, show:

``` text
01 Loading NWP forecast              ✓
02 Extracting atmospheric features   ✓
03 Detecting weather regime          ✓
04 Selecting correction strategy     ✓
05 Calibrating extreme rainfall      ✓
06 Estimating uncertainty            ✓
07 Generating EVRIN forecast         ✓
```

Then:

``` text
EVRIN FORECAST READY
```

This is a frontend simulation.

Do not pretend the browser is actually running the ML model.

The sequence should be controlled by a feature/state machine or
structured configuration rather than scattered timers.

------------------------------------------------------------------------

# 23. The Most Important Technical Decision: Mock Backend

The mock backend must behave like a backend boundary.

Bad:

``` ts
const forecast = {
  rainfall: 78,
  regime: "active"
};
```

inside a component.

Better:

``` text
UI
 ↓
Feature / hook
 ↓
Repository interface
 ↓
Mock repository
 ↓
Scenario data
```

Define an interface:

``` ts
interface ForecastRepository {
  getForecast(
    request: ForecastRequest
  ): Promise<ForecastResult>;

  getRegime(
    request: RegimeRequest
  ): Promise<RegimeResult>;

  getVerification(
    request: VerificationRequest
  ): Promise<VerificationResult>;
}
```

Current implementation:

``` text
MockForecastRepository
```

Future implementation:

``` text
HttpForecastRepository
```

------------------------------------------------------------------------

# 24. Future Backend Integration

Current:

``` text
Overview
  ↓
useForecast()
  ↓
ForecastRepository
  ↓
MockForecastRepository
  ↓
Scenario fixture
```

Future:

``` text
Overview
  ↓
useForecast()
  ↓
ForecastRepository
  ↓
HttpForecastRepository
  ↓
EVRIN Backend
```

The UI should not change.

If backend response shapes differ from domain models, transform them in
the repository/API layer.

Never expose backend-specific DTOs throughout the UI.

------------------------------------------------------------------------

# 25. API Contracts

Define contracts early.

Example request:

``` ts
type ForecastRequest = {
  locationId: string;
  forecastHour: number;
  scenarioId?: string;
};
```

Example response:

``` ts
type ForecastResult = {
  location: Location;
  validTime: string;

  raw: {
    rainfall24h: number;
  };

  corrected: {
    rainfall24h: number;
    p50: number;
    p75: number;
    p90: number;
  };

  correction: {
    delta: number;
  };

  confidence: number;
};
```

The future backend should eventually conform to these contracts, or the
repository should adapt the backend response.

------------------------------------------------------------------------

# 26. Domain Types vs UI Types

Do not make components define the domain model.

Avoid:

``` ts
type CardProps = {
  value: string;
  color: string;
};
```

Prefer domain models:

``` ts
type ForecastResult = {
  raw: RawForecast;
  corrected: CorrectedForecast;
  correction: CorrectionResult;
};
```

Widgets decide how those domain objects are presented.

------------------------------------------------------------------------

# 27. Mock Data Location

Keep all temporary data isolated.

Recommended:

``` text
src/mocks/
├── scenarios/
│   ├── active-monsoon.ts
│   ├── break-monsoon.ts
│   ├── depression.ts
│   ├── orographic.ts
│   └── coastal.ts
├── forecasts.ts
├── regimes.ts
├── districts.ts
├── verification.ts
└── mock-api.ts
```

Prefer scenario-level fixtures because the dashboard needs internally
consistent values.

------------------------------------------------------------------------

# 28. Future ML Architecture

The eventual model can be represented conceptually as:

``` text
Atmospheric state
       ↓
Regime classifier
       ↓
Regime probabilities
       ↓
Regime-specific experts
       ↓
Weighted/mixture correction
       ↓
Extreme-event calibration
       ↓
Uncertainty estimation
       ↓
Final forecast
```

The frontend should explain this pipeline, but should not falsely claim
that the real ML pipeline already runs in the browser.

------------------------------------------------------------------------

# 29. Design Direction

EVRIN should feel like:

``` text
Scientific Meteorological Operations Center
        +
Modern GIS
        +
Enterprise SaaS
```

Avoid:

-   cyberpunk,
-   neon,
-   gaming HUD,
-   excessive gradients,
-   purple glow,
-   holographic effects,
-   fake telemetry,
-   excessive rounded cards.

Prefer:

-   restrained colors,
-   strong typography,
-   whitespace,
-   scientific visualization,
-   subtle borders,
-   clean maps,
-   clear hierarchy.

The design should communicate:

``` text
Scientific
Precise
Calm
Trustworthy
Operational
Data-driven
```

------------------------------------------------------------------------

# 30. Recommended FSD Direction

Initial direction:

``` text
src/
│
├── app/
│
├── widgets/
│   ├── app-shell/
│   ├── forecast-map/
│   ├── forecast-summary/
│   ├── regime-panel/
│   ├── district-inspection/
│   ├── correction-drivers/
│   ├── extreme-center/
│   └── verification-dashboard/
│
├── features/
│   ├── run-forecast/
│   ├── select-location/
│   ├── select-scenario/
│   ├── switch-map-layer/
│   └── compare-forecast/
│
├── entities/
│   ├── forecast/
│   ├── regime/
│   ├── district/
│   ├── rainfall/
│   └── verification/
│
├── shared/
│   ├── ui/
│   ├── lib/
│   ├── hooks/
│   ├── config/
│   └── types/
│
└── mocks/
    ├── scenarios/
    ├── forecasts/
    ├── regimes/
    ├── districts/
    └── verification/
```

This is a starting proposal, not an instruction to create every file
immediately.

------------------------------------------------------------------------

# 31. Implementation Order

## Phase 0 --- Architecture

Do only:

-   inspect repository,
-   inspect Next.js version and dependencies,
-   inspect existing components,
-   propose final FSD structure,
-   define boundaries,
-   define domain types,
-   define API contracts,
-   define repository interfaces,
-   define mock/real implementation boundary.

Do not build the entire UI.

------------------------------------------------------------------------

## Phase 1 --- Foundation

Implement:

-   Next.js setup,
-   TypeScript,
-   Tailwind,
-   shadcn/ui,
-   fonts,
-   design tokens,
-   AppShell,
-   Sidebar,
-   Topbar,
-   navigation.

------------------------------------------------------------------------

## Phase 2 --- Domain Models

Implement:

-   Forecast types,
-   Regime types,
-   District types,
-   Rainfall types,
-   Extreme-risk types,
-   Verification types,
-   Scenario types.

------------------------------------------------------------------------

## Phase 3 --- Mock Data Layer

Implement:

-   scenario fixtures,
-   mock repository,
-   repository interfaces,
-   simulated latency,
-   loading states,
-   error states.

At this stage the frontend should behave as if it is consuming an API.

------------------------------------------------------------------------

## Phase 4 --- Overview

Implement:

-   KPI cards,
-   India map,
-   map layers,
-   regime panel,
-   district inspection,
-   rainfall comparison,
-   correction drivers,
-   confidence.

------------------------------------------------------------------------

## Phase 5 --- Demo Interaction

Implement:

-   scenario selector,
-   location selector,
-   Run EVRIN,
-   processing sequence,
-   state transitions,
-   forecast update.

------------------------------------------------------------------------

## Phase 6 --- Extremes

Implement:

-   heavy rainfall probability,
-   very heavy rainfall probability,
-   district risk table,
-   risk map.

------------------------------------------------------------------------

## Phase 7 --- Verification

Implement:

-   metrics table,
-   raw vs EVRIN,
-   regime-wise verification,
-   skill heatmap,
-   charts.

------------------------------------------------------------------------

## Phase 8 --- Forecast

Implement:

-   24/48/72-hour timeline,
-   rainfall evolution,
-   uncertainty,
-   forecast comparison.

------------------------------------------------------------------------

## Phase 9 --- Models and Data

Implement lightweight technical explanation pages.

------------------------------------------------------------------------

## Phase 10 --- Demo Polish

Only after functionality works:

-   animation,
-   spacing,
-   responsive behavior,
-   loading states,
-   empty states,
-   error states,
-   accessibility,
-   final visual polish.

------------------------------------------------------------------------

# 32. Testing Requirements

Every important component should handle:

``` text
Loading
Success
Empty
Error
```

Do not design only the happy path.

------------------------------------------------------------------------

# 33. Environment Configuration

Future API URL must be configurable.

Example:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Never hardcode:

``` ts
"http://localhost:8000"
```

inside UI components.

------------------------------------------------------------------------

# 34. Demo Data Honesty

The prototype can simulate:

-   rainfall,
-   regime probabilities,
-   correction,
-   risk probabilities,
-   uncertainty,
-   verification metrics.

But the UI should distinguish:

``` text
Prototype / Simulated Output
```

from:

``` text
Verified Model Output
```

Never present simulated scientific metrics as real model performance.

------------------------------------------------------------------------

# 35. Demo Video Flow

Recommended story:

``` text
Open EVRIN
    ↓
India map
    ↓
Select Meerut
    ↓
Raw NWP = 52 mm
    ↓
Run EVRIN
    ↓
Regime = Active Monsoon, 78%
    ↓
EVRIN = 78 mm
    ↓
Correction = +26 mm
    ↓
Heavy rainfall probability = 82%
    ↓
Show correction drivers
    ↓
Switch to another regime
    ↓
Show different correction behavior
    ↓
Open Verification
    ↓
Raw NWP vs EVRIN metrics
```

Final message:

> EVRIN does not replace the NWP forecast. It adapts rainfall
> post-processing to the prevailing weather regime.

------------------------------------------------------------------------

# 36. Mandatory Workflow for the Coding LLM

When this guide is supplied to a coding LLM, it must NOT immediately
generate the entire project.

### Step 1

Inspect the existing repository.

### Step 2

Understand the current Next.js setup.

### Step 3

Identify existing dependencies, routes, components and styling.

### Step 4

Propose the final Feature-Sliced architecture.

### Step 5

Explain every layer.

### Step 6

Explain dependency direction.

### Step 7

Define domain entities.

### Step 8

Define API/repository contracts.

### Step 9

Explain how mock implementation will be replaced by HTTP implementation.

### Step 10

List the first files to create.

### Step 11

WAIT FOR APPROVAL.

Do not implement the next phase until explicitly instructed.

------------------------------------------------------------------------

# 37. Implementation Rules

For every phase:

1.  Explain what we are building.
2.  Explain why it belongs in that FSD layer.
3.  Explain its future backend relationship.
4.  Implement only that phase.
5.  Verify the implementation.
6.  Report created/modified files.
7.  Do not silently refactor unrelated code.
8.  Wait for the next instruction.

------------------------------------------------------------------------

# 38. Architecture Checklist

Before implementation starts, confirm:

### Structure

-   Is FSD being used correctly?
-   Are boundaries clear?
-   Is dependency direction clear?

### Data

-   Are domain types independent from UI?
-   Is mock data isolated?
-   Can the mock repository be replaced by an HTTP repository?

### Backend readiness

-   Are API contracts defined?
-   Is API configuration environment-based?
-   Are backend-specific DTOs isolated?

### Product

-   Is the map the primary visual?
-   Is regime clearly visible?
-   Is Raw vs EVRIN obvious?
-   Are heavy-rain probabilities visible?
-   Is uncertainty visible?
-   Is correction reasoning visible?
-   Is verification visible?

### Demo

-   Can the entire demo run without a backend?
-   Can scenarios be switched?
-   Can different regimes be demonstrated?
-   Can verification be demonstrated?

------------------------------------------------------------------------

# 39. Golden Architecture Principle

The most important rule:

> Build the frontend today as a client of a future backend, not as a
> collection of mock-data components.

Today:

``` text
Next.js
  ↓
Domain contracts
  ↓
Repository interface
  ↓
Mock repository
  ↓
Scenario fixtures
```

Future:

``` text
Next.js
  ↓
Domain contracts
  ↓
Repository interface
  ↓
HTTP repository
  ↓
EVRIN backend
  ↓
ML pipeline
```

The UI should remain stable.

------------------------------------------------------------------------

# 40. FIRST TASK FOR THE IMPLEMENTATION LLM

Do NOT write the application yet.

First:

1.  Inspect the repository.
2.  Understand the existing Next.js setup.
3.  Propose the final Feature-Sliced folder architecture.
4.  Explain every layer.
5.  Define dependency direction.
6.  Define core domain entities.
7.  Define mock API/repository interfaces.
8.  Define the future backend integration boundary.
9.  Identify which files should be created first.
10. Wait for approval.

We will implement EVRIN **one phase at a time**.
