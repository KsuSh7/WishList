import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import WishlistPage from '../../src/pages/WishlistPage'

describe('WishlistPage Component', () => {

  it('renders wishlist title and description', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:id" element={<WishlistPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.contains('Birthday').should('exist')
    cy.contains('Party stuff').should('exist')
  })

  it('renders items list with item name and price', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:id" element={<WishlistPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.contains('Shoes').should('exist')
    cy.contains('$100').should('exist')
    cy.contains('View').should('exist')
  })


  it('shows owner buttons when user is owner', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:id" element={<WishlistPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.contains('Add Items').should('exist')
    cy.contains('Delete Wishlist').should('exist')
  })
})