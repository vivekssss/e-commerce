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
    
    cy.contains('Pay').click();
    
    cy.get('h2', { timeout: 10000 }).should('contain', 'Order Confirmed');
    cy.contains('Continue Shopping').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('filters products by category', () => {
    cy.get('[data-testid^="filter-"]').eq(1).invoke('text').then((categoryName) => {
      cy.get('[data-testid^="filter-"]').eq(1).click();
      cy.get('[data-testid^="product-card-"]').first().find('span').should('contain', categoryName.trim());
    });
  });
});
