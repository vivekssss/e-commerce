describe('ShopWave Components & Pages', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  describe('Home Page Components', () => {
    it('should show categories and handle selection', () => {
      cy.get('.flex.gap-4.overflow-x-auto').should('be.visible');
      cy.get('[data-testid^="filter-"]').should('have.length.at.least', 2);
    });

    it('should have a functional modern sort dropdown', () => {
      cy.contains('Quick Sort').click();
      cy.get('.absolute.z-50').should('be.visible'); // Dropdown menu
      cy.contains('Price: High to Low').click();
      cy.contains('Price: High to Low').should('be.visible'); // Selected state
    });

    it('should display product skeletons while loading', () => {
      // Re-visit to catch initial loading if fast
      cy.visit('http://localhost:3000');
      cy.get('.shimmer-bg', { timeout: 5000 }).should('exist');
    });
  });

  describe('Cart Page & Checkout', () => {
    it('should show empty cart state', () => {
      cy.get('[data-testid="cart-btn"]').should('not.exist');
      cy.visit('http://localhost:3000/cart');
      cy.contains('Your cart is empty').should('be.visible');
      cy.contains('Start Shopping').click();
      cy.url().should('eq', 'http://localhost:3000/');
    });

    it('should handle quantity adjustments in cart', () => {
      // Add a product first
      cy.get('[data-testid^="product-card-"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]').click();
      cy.visit('http://localhost:3000/cart');

      // Check quantity
      cy.get('.min-w-\\[20px\\]').should('contain', '1');
      
      // Increment
      cy.get('button').find('svg').filter((i, el) => el.innerHTML.includes('M12 4v16m8-8H4')).parent().click();
      cy.get('.min-w-\\[20px\\]').should('contain', '2');
      cy.contains('Added another').should('be.visible');

      // Decrement
      cy.get('button').find('svg').filter((i, el) => el.innerHTML.includes('M20 12H4')).parent().click();
      cy.get('.min-w-\\[20px\\]').should('contain', '1');
      cy.contains('Removed one').should('be.visible');
    });
  });

  describe('Responsive Checks', () => {
    it('should adjust layout for mobile view', () => {
      cy.viewport('iphone-xr');
      cy.get('h1').should('be.visible');
      cy.get('[data-testid="search-input"]').should('be.visible');
      
      // Header should stack
      cy.get('header .flex-col').should('exist');
    });
  });
});
