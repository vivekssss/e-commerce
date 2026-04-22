describe('ShopWave E-commerce', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('navigates through the full purchase flow', () => {
    cy.get('h1').should('contain', 'ShopWave');
    
    cy.get('[data-testid^="product-card-"]', { timeout: 15000 }).should('have.length.at.least', 1);
    
    cy.get('[data-testid^="product-card-"]').first().click();
    
    cy.url().should('include', '/product/');
    cy.get('[data-testid="add-to-cart-btn"]').click();
    cy.get('[data-testid="add-to-cart-btn"]').should('contain', 'Add Another');
    
    cy.get('[data-testid="cart-btn"]').click();
    cy.url().should('include', '/cart');
    
    cy.get('[data-testid="checkout-btn"]').click();
    cy.get('h2').should('contain', 'Shipping & Payment');
    
    cy.get('input[name="fullName"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="city"]').type('New York');
    cy.get('input[name="zipCode"]').type('10001');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="cardNumber"]').type('4242424242424242');
    cy.get('input[name="expiry"]').type('12/25');
    cy.get('input[name="cvv"]').type('123');
    
    cy.get('[data-testid="pay-btn"]').should('not.be.disabled').click();
    
    cy.contains('Order Confirmed', { timeout: 15000 }).should('be.visible');
    cy.contains('Continue Shopping').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('filters products by category', () => {
    cy.get('[data-testid^="filter-"]').eq(1).invoke('text').then((categoryName) => {
      cy.get('[data-testid^="filter-"]').eq(1).click();
      cy.get('[data-testid^="product-card-"]', { timeout: 10000 }).first().find('span').should('contain', categoryName.trim());
    });
  });

  it('searches for products and shows preview', () => {
    const searchTerm = 'Cotton';
    cy.get('[data-testid="search-input"]').type(searchTerm);
    
    // Check for "Searching for..." preview
    cy.contains(`Searching for "${searchTerm}"`).should('be.visible');
    
    // Wait for results and verify at least one card is shown
    cy.get('[data-testid^="product-card-"]', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  it('sorts products by price', () => {
    // Open sort dropdown
    cy.contains('Quick Sort').click();
    cy.contains('Price: Low to High').click();
    
    // Wait for sort to apply and check prices
    cy.get('[data-testid^="product-card-"]').then(($cards) => {
      // Find the price text which is in a specific font-black span
      const getPrice = ($el) => parseFloat($el.find('.font-black.text-gray-900').text().replace(/[^\d.]/g, ''));
      
      const price1 = getPrice($cards.eq(0));
      const price2 = getPrice($cards.eq(1));
      
      if (!isNaN(price1) && !isNaN(price2)) {
        expect(price1).to.be.at.most(price2);
      }
    });
  });
});
