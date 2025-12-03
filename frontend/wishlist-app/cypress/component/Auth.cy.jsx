import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Auth from '../../src/pages/Auth'

describe('Auth Component', () => {
  it('renders login form by default', () => {
    cy.mount(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    cy.contains('Login').should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  it('switches to signup form', () => {
    cy.mount(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    cy.contains('Sign up here').click()
    cy.contains('Sign Up').should('exist')
    cy.get('input[type="text"]').should('exist')
  })

  it('alerts on invalid email', () => {
    cy.mount(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    cy.get('input[type="email"]').type('invalidemail')
    cy.get('input[type="password"]').type('123456')
    cy.contains("Let's go").click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Invalid email format')
    })
  })
})