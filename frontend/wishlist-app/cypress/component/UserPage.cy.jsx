import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UserPage from '../../src/pages/UserPage'

describe('UserPage Component', () => {
  it('renders user info', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.contains("TestUser's page").should('exist')
  })

  it('renders wishlist cards when wishlists exist', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.get('[class*="wishlistCard"]').should('have.length', 1)
    cy.contains('Birthday').should('exist')
    cy.contains('Party stuff').should('exist')
  })

  it('shows owner buttons for adding and sharing', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.contains('Make a new wish').should('exist')
    cy.contains('Share my page').should('exist')
  })

  it('renders avatar placeholder if no avatar', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    )
    cy.get('[class*="avatarPlaceholder"]').should('exist')
    cy.get('[class*="avatarImage"]').should('not.exist')
  })

  it('clicking "Add picture" triggers file input click', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/user']}>
        <Routes>
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </MemoryRouter>
    )

    cy.get('[class*="uploadLink"]').click({ force: true })
    cy.get('#avatarInput').should('exist')
  })

  it('clicking "Share my page" calls clipboard writeText', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()
      cy.mount(
        <MemoryRouter initialEntries={['/user']}>
          <Routes>
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </MemoryRouter>
      )
      cy.contains('Share my page').click().then(() => {
        expect(win.navigator.clipboard.writeText).to.have.been.calledOnce
      })
    })
  })
})
