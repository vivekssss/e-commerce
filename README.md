# ShopWave - Premium E-commerce Experience

ShopWave is a state-of-the-art, responsive e-commerce application built with a focus on premium aesthetics, smooth animations, and a seamless user experience. It leverages modern web technologies to provide a high-performance shopping platform.

## 🚀 Features

### 1. Modern Discovery System
- **Intelligent Search**: Real-time search with a debounced input and visual feedback ("Searching..." indicators and spinners).
- **Premium Sort Dropdown**: A custom-built, animated dropdown for sorting products by Price (Low/High) and Name (A-Z/Z-A), featuring Glassmorphism effects.
- **Dynamic Category Filtering**: Fluid category selection with automatic product grid updates.

### 2. Product Experience
- **Interactive Product Cards**: Hover-responsive cards with quick-add functionality.
- **Skeleton Loading**: High-end loading states for a better perceived performance during data fetching.
- **Detailed View**: Comprehensive product detail pages with full-quality imagery and descriptions.

### 3. Cart & Checkout Flow
- **Real-time Cart Management**: Powered by MobX for instantaneous state updates across all components.
- **Flying Cart Animation**: Visual feedback when adding items to the cart.
- **Global Cart Footer**: A persistent footer showing the current cart status (total price and item count).
- **Seamless Checkout**: A dedicated order success flow with celebratory UI elements.

### 4. Robust Foundation
- **Responsive Design**: Tailored for Mobile, Tablet, and Desktop using Tailwind CSS.
- **End-to-End Testing**: Comprehensive test coverage using Cypress to ensure core user flows remain unbroken.

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Core** | [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/) |
| **State Management** | [MobX](https://mobx.js.org/), [MobX-React](https://github.com/mobxjs/mobx-react) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **HTTP Client** | [Ky](https://github.com/sindresorhus/ky) |
| **Testing** | [Cypress](https://www.cypress.io/), [React Testing Library](https://testing-library.com/) |
| **UI Utilities** | [React Toastify](https://fkhadra.github.io/react-toastify/), [Lucide React](https://lucide.dev/) |

## 🔄 Project Flow

1. **Initialization**: The app initializes the MobX store and fetches categories and initial products from the [Platzi Fake Store API](https://api.escuelajs.co/).
2. **Browsing**: Users can filter products by category or use the search bar. The URL is automatically synchronized with the search and filter state for shareability.
3. **Cart Interaction**: Adding a product triggers a "flying" animation and updates the global `StoreContext`. Toasts provide immediate feedback.
4. **Checkout**: From the Cart page, users can clear their cart or proceed to "Checkout," which leads to the Order Success screen.
5. **Testing**: Developers can run `npx cypress open` to execute automated tests covering search, cart additions, and navigation.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vivekssss/e-commerce.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run E2E Tests**:
   ```bash
   npx cypress open
   ```

## 🎨 Design Philosophy
ShopWave follows a **Premium Dark/Light Hybrid** aesthetic, utilizing deep indigo gradients, glassmorphism, and generous white space to create a "ShopWave" brand identity that feels both modern and trustworthy.

## 📝 Key Considerations

### 🧠 Assumptions
- **API Reliability**: The application assumes the [Platzi Fake Store API](https://api.escuelajs.co/) is active. Error boundaries and "Reconnect" triggers are in place to handle unexpected downtime.
- **Client-Side Sorting**: Sorting is performed client-side on the fetched dataset to provide near-instantaneous transitions and avoid unnecessary network roundtrips.
- **Image Sanitization**: Assumes some API images might have malformed URLs; a `cleanImageUrl` utility is used to sanitize and fix common path issues.

### ⚠️ Limitations
- **API Filtering**: The search functionality is currently limited by the API's query parameter support (primarily title-based searching).
- **Pagination**: As this is a showcase application, it currently loads a significant number of products upfront rather than using infinite scroll or traditional pagination.
- **Static Checkout**: The checkout process is a visual demonstration and does not integrate with a real payment gateway.

### ✨ Additional Features Implemented
- **Glassmorphism Sort Dropdown**: A completely custom UI component replacing the standard HTML select for a premium feel.
- **Animated Search Feedback**: Real-time state indicators (spinners and status badges) that provide feedback during the debounce and fetch phases.
- **Flying Product Feedback**: A sophisticated Framer Motion animation that visually "flies" a product image into the cart when added.
- **Cohesive UI Scaling**: Precision-matched heights (`58px`) for all header controls to ensure a perfectly balanced visual rhythm.
