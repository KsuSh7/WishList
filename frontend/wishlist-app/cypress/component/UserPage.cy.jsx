import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import UserPage from '../../src/pages/UserPage'

describe('UserPage Component', () => {
  it('renders user info and empty wishlists message', () => {
    cy.mount(
      <MemoryRouter>
        <UserPage />
      </MemoryRouter>
    )
    cy.contains("TestUser's page").should('exist')
    cy.contains('There are no wishlists yet').should('exist')
  })

})