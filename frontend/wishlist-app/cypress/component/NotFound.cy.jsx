import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../../src/pages/NotFound'

describe('NotFound Component', () => {
  it('renders error message', () => {
    cy.mount(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    cy.contains('Oops...').should('exist')
    cy.contains('Wish there was a page like this').should('exist')
  })

  it('has a back button linking to home', () => {
    cy.mount(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    cy.get('a[href="/"]').should('exist')
    cy.contains('Back on the main').should('exist')
  })
})