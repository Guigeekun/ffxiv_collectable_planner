# FFXIV Collectable Planner

Tool to plan your next collectable farm for your party.

## Features

This tool allows you to see which collectables (mounts or minions) your party members have and which ones they don't have, and then plan your next collectable farm accordingly.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ffxiv_collectable_planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Usage

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## API Integration

The application uses the [LalaAchievements API](https://lalachievements.com/api) for game data and character information.
Huge thanks to them!

### Proxy Configuration

The development server is configured to proxy API requests to `https://lalachievements.com`:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'https://lalachievements.com',
    changeOrigin: true,
    secure: true,
  }
}
```