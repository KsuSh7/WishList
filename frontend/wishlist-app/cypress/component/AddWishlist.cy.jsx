import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import AddWishlist from '../../src/pages/AddWishlist'

describe('AddWishlist Component', () => {
  it('renders inputs and buttons', () => {
    cy.mount(
      <MemoryRouter>
        <AddWishlist />
      </MemoryRouter>
    )
    cy.contains('Make a Wish').should('exist')
    cy.get('input#title').should('exist')
    cy.get('button').contains('Add Items').should('exist')
  })

  it('alerts if title is empty', () => {
    cy.mount(
      <MemoryRouter>
        <AddWishlist />
      </MemoryRouter>
    )
    cy.get('button[type="submit"]').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Please enter a title')
    })
  })

  it('accepts title and description', () => {
    cy.mount(
      <MemoryRouter>
        <AddWishlist />
      </MemoryRouter>
    )
    cy.get('#title').type('Birthday Wishlist')
    cy.get('#description').type('My wishes')
    cy.get('#title').should('have.value', 'Birthday Wishlist')
  })
})