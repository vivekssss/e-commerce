# ShopWave Premium E-commerce

A high-end e-commerce application built with React, TypeScript, MobX, and Tailwind CSS.

## Features
- **Modern UI**: Professional design with gradient accents, glassmorphism, and premium typography (Inter).
- **TypeScript**: Full type safety across the entire application.
- **Tailwind CSS**: Utility-first styling for a clean and responsive layout.
- **Class Components**: Implemented using React Class Components as per specific project requirements.
- **MobX State Management**: Centralized cart state with persistence.
- **Full Checkout Flow**: Multi-step checkout including order review, shipping/payment form, and order confirmation.
- **Dynamic Routing**: Seamless navigation between Home, Product Details, and Checkout.
- **Animations**: Page transitions, staggered product loading, and interactive cart feedback.

## Tech Stack
- **Framework**: React 18 (Create React App + CRACO)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: MobX
- **Routing**: React Router v6
- **Testing**: Cypress

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

4. **Run E2E Tests**
   ```bash
   npx cypress run
   ```

## Assumptions and Limitations
- **Data Persistence**: Cart state is persisted in `localStorage`.
- **Checkout Processing**: Payment processing is simulated with a 2-second timeout.
- **Image URLs**: Custom sanitization logic handles malformed image URLs from the Platzi API.
- **Class Components**: All page and component logic is encapsulated within Class Components.
