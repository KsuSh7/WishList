describe('AddItem (e2e)', () => {
  beforeEach(() => {
    cy.intercept('POST', '/wishlists', (req) => {
      req.reply({
        statusCode: 200,
        body: { id: 123, title: req.body.title || 'Test Wishlist', description: req.body.description || '' },
      });
    }).as('saveWishlist');

    cy.intercept('POST', '/items', (req) => {
      req.reply({
        statusCode: 200,
        body: { id: 456, ...req.body },
      });
    }).as('saveItem');

    cy.intercept('POST', '/items/cover/*', (req) => {
      req.reply({
        statusCode: 200,
        body: { cover: '/uploads/item_covers/cover.png' },
      });
    }).as('uploadItemCover');
  });

  it('creates wishlist with one item including file and navigates correctly', () => {
    cy.visit('/add-item', {
      onBeforeLoad(win) {
        const state = { title: 'My Wishlist', description: 'Desc', coverFile: null, wishlist_id: null };
        win.history.replaceState(state, '');
      },
    });

    cy.get('[data-testid="item-name"]').type('Cool Book');
    cy.get('[data-testid="item-price"]').type('150');
    cy.get('[data-testid="item-link"]').type('https://example.com');
    cy.get('#itemCoverInput').selectFile('cypress/fixtures/test.jpg', { force: true });

    cy.contains('Done').click();

    cy.wait('@saveWishlist');
    cy.wait('@saveItem');
    cy.wait('@uploadItemCover');
    cy.url().should('include', '/wishlist/123');
  });

  it('shows alert when item name is empty', () => {
    cy.visit('/add-item', {
      onBeforeLoad(win) {
        const state = { title: 'My Wishlist', description: 'Desc', coverFile: null, wishlist_id: null };
        win.history.replaceState(state, '');
      },
    });

    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Item name is required');
    });

    cy.contains('Add more items').click();
  });

  it('shows error alert when wishlist save fails', () => {
    cy.intercept('POST', '/wishlists', { statusCode: 500, body: { message: 'fail' } }).as('saveFail');

    cy.visit('/add-item', {
      onBeforeLoad(win) {
        const state = { title: 'My Wishlist', description: 'Desc', coverFile: null, wishlist_id: null };
        win.history.replaceState(state, '');
      },
    });

    cy.get('[data-testid="item-name"]').type('Only Item');

    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Saving failed');
    });

    cy.contains('Done').click();
    cy.wait('@saveFail');
  });
});
