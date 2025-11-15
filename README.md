# Kameleoon A/B Test Line Chart

An interactive React + TypeScript application for visualizing A/B test statistics with conversion rate charts. Built with **Recharts** for charts and **CSS Modules** for styling.

## Features

- **Interactive Line Chart**: Display conversion rate (%) for multiple A/B test variations.
- **Variation Selector**: A custom-built, theme-aware dropdown to toggle which variations to display. At least one variation must always be selected.
- **Data Granularity**: Aggregate data by **Day** or **Week**. The chart axes adapt automatically.
- **Interactive Tooltip**: A styled tooltip shows detailed daily data on hover, accompanied by a vertical cursor line for clarity.
- **4 Line Style Options**: Customize the chart's appearance with four distinct styles:
  - **Line**: Standard linear line chart.
  - **Smooth**: A curved line chart using a monotone interpolator.
  - **Area**: A filled area chart to emphasize volume.
  - **Shadow**: A smooth line with a drop-shadow for a modern look.
- **Zoom and Pan**: Zoom in and out for a closer look at the data, and pan across the chart by clicking.
- **Export to PNG**: Download the current chart view as a PNG image, preserving the selected theme and styles.
- **Light / Dark Theme**: Switch between light and dark modes for optimal viewing comfort.

## Tech Stack

- **React 19** + **TypeScript**
- **Recharts 3.4** for chart rendering
- **CSS Modules** for component-scoped styling
- **date-fns 4.1** for date parsing and week aggregation
- **html2canvas** for PNG export

## Setup & Running Locally

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app will reload on file changes.

### Production Build

```bash
npm run build
```

Creates an optimized production bundle in the `dist/` folder.

### Run Tests

```bash
npm test
```

Launches the test runner in watch mode.

## Project Structure

```
src/
├── App.tsx                           # Main app component with state management
├── App.css                           # Global styles + CSS variables + theme
├── index.tsx                         # Entry point
├── index.css                         # Base styles
├── custom.d.ts                       # TypeScript definitions for CSS Modules
├── types.ts                          # Core data types (RawData, RawVariation, etc.)
├── components/
│   ├── Chart/
│   │   ├── Chart.tsx                 # Recharts ComposedChart wrapper
│   │   ├── Chart.module.css          # Chart-specific styles
│   │   └── useChartPan.ts            # Custom hook for chart panning logic
│   ├── ChartControls/
│   │   └── ChartControls.tsx         # Component for all chart controls
│   ├── CustomTooltip/
│   │   ├── CustomTooltip.tsx         # Custom tooltip component for the chart
│   │   └── CustomTooltip.module.css  # Styles for the custom tooltip
│   ├── VariationsDropdown/
│   │   ├── VariationsDropdown.tsx    # Custom multi-select dropdown component
│   │   └── VariationsDropdown.module.css  # Dropdown styles
│   └── ZoomControls/
│       └── ZoomControls.tsx          # Component for zoom controls
├── utils/
│   └── dataProcessor.ts              # Data aggregation (day/week), conversion rate calc
├── data.json                         # Sample A/B test data
```

## Usage

1. **Select Variations**: Click on the dropdown to open multi-select with checkboxes. Select/uncheck variations you want to display (min 1 required)
2. **Granularity**: Use "Day" or "Week" selector to aggregate data
3. **Line Style**: Choose visualization style:
   - **Line**: Standard linear line chart
   - **Smooth**: Smooth monotone curves
   - **Area**: Filled area under the curves (opacity 0.15)
   - **Shadow**: Smooth curves with subtle drop-shadow effect
4. **Dark Theme**: Click the ☀️/🌙 button to toggle between light and dark themes
5. **Export PNG**: Click "📥 Export" to download the current chart as a PNG image

### Dependencies Added

- `html2canvas` — PNG export
- `date-fns` — Date utilities
- `recharts` — Chart library
