describe('WishlistPage (e2e)', () => {
  const wishlistId = 123;
  const API_URL = 'http://localhost:3000';

  const wishlistMock = {
    id: wishlistId,
    title: 'My Test Wishlist',
    description: 'Some description',
    user_id: 1,
  };

  const itemsMock = [
    { id: 1, name: 'Item One', price: 100, link: 'https://example.com', wishlist_id: wishlistId },
    { id: 2, name: 'Item Two', price: 200, wishlist_id: wishlistId },
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/profile', {
      statusCode: 200,
      body: { id: 1, username: 'TestUser' },
    });

    cy.intercept('GET', `${API_URL}/wishlists/${wishlistId}`, {
      statusCode: 200,
      body: wishlistMock,
    }).as('getWishlist');

    cy.intercept('GET', `${API_URL}/items?wishlist_id=${wishlistId}`, {
      statusCode: 200,
      body: itemsMock,
    }).as('getItems');

    cy.visit(`/wishlist/${wishlistId}`);
  });

  it('renders wishlist title, description and items', () => {
    cy.wait('@getWishlist');
    cy.wait('@getItems');

    cy.get('[class*="title"]').should('contain', wishlistMock.title);
    cy.get('[class*="description"]').should('contain', wishlistMock.description);

    cy.get('[class*="itemCard"]').should('have.length', itemsMock.length);
    cy.get('[class*="itemName"]').first().should('contain', itemsMock[0].name);
    cy.get('[class*="itemPrice"]').first().should('contain', `$${itemsMock[0].price}`);
  });

  it('owner can see Add Items and Delete Wishlist buttons', () => {
    cy.get('[class*="addItemButton"]').should('exist');
    cy.get('[class*="deleteWishlist"]').should('exist');
  });

  it('deletes an item and removes it from the DOM', () => {
    cy.intercept('DELETE', `${API_URL}/items/1`, { statusCode: 200 }).as('deleteItem');

    cy.get('[class*="deleteButton"]').first().click();
    cy.wait('@deleteItem');

    cy.get('[class*="itemCard"]').should('have.length', itemsMock.length - 1);
  });

  it('deletes wishlist and navigates to /user', () => {
    cy.on('window:confirm', () => true);

    cy.intercept('DELETE', `${API_URL}/wishlists/${wishlistId}`, { statusCode: 200 }).as('deleteWishlist');
    cy.intercept('GET', `${API_URL}/items?wishlist_id=${wishlistId}`, { statusCode: 200, body: itemsMock }).as('getItemsForDelete');
    cy.intercept('DELETE', `${API_URL}/items/*`, { statusCode: 200 }).as('deleteItemRequests');

    cy.get('[class*="deleteWishlist"]').click();

    cy.wait('@deleteWishlist');
    cy.wait('@getItemsForDelete');
    cy.wait('@deleteItemRequests');

    cy.url().should('include', '/user');
  });

  it('View button opens link if exists and is disabled otherwise', () => {
    cy.get('[class*="viewButton"]').first().should('not.be.disabled');
    cy.get('[class*="viewButton"]').last().should('be.disabled');
  });
});
