describe('AddWishlist (e2e)', () => {
  it('shows validation alert when title is empty', () => {
    cy.visit('/add-wishlist');

    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Please enter a title');
    });

    cy.get('button[type="submit"]').click();
  });

  it('navigates to /add-item with state when title provided', () => {
    cy.visit('/add-wishlist');

    cy.get('input#title').type('My Wishlist');
    cy.get('input#description').type('A short caption');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/add-item');
  });

  it('allows simulating file upload (UI interaction, no real upload)', () => {
    cy.visit('/add-wishlist');

    cy.get('button').contains('Upload cover').should('exist');
    cy.get('input[type="file"]').should('exist');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test.jpg', { force: true });
  });
});
