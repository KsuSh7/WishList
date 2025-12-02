import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/Home'

describe('Home Component', () => {
  it('renders title and subtitle', () => {
    cy.mount(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    cy.contains('Make a Wish').should('exist')
    cy.contains('No more guessing gifts').should('exist')
  })

  it('has a button that links to /auth', () => {
    cy.mount(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    cy.get('a[href="/auth"]').should('exist')
    cy.contains("Let's go").should('exist')
  })
})