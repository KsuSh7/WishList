import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import AddItem from '../../src/pages/AddItem'

describe('AddItem Component', () => {
  it('renders form inputs', () => {
    cy.mount(
      <MemoryRouter initialEntries={[{ pathname: '/add-item', state: { title: 'Test', description: 'Desc' } }]}>
        <AddItem />
      </MemoryRouter>
    )
    cy.contains('Add an Item').should('exist')
    cy.get('label').contains('Item name').should('exist')
    cy.get('label').contains('Price (optional)').should('exist')
    cy.get('label').contains('Link (optional)').should('exist')
  })

  it('shows alert if name is empty when adding item', () => {
    cy.mount(
      <MemoryRouter initialEntries={[{ pathname: '/add-item', state: { title: 'Test' } }]}>
        <AddItem />
      </MemoryRouter>
    )
    cy.contains('Add more items').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Item name is required')
    })
  })

    it('accepts valid item input and resets fields', () => {
    cy.mount(
        <MemoryRouter initialEntries={[{ pathname: '/add-item', state: { title: 'Test' } }]}>
        <AddItem />
        </MemoryRouter>
    )

    cy.contains('Item name').parent().within(() => {
        cy.get('input').eq(0).type('Shoes')
    })
    cy.contains('Price (optional)').parent().within(() => {
        cy.get('input').eq(0).type('100')
    })
    cy.contains('Link (optional)').parent().within(() => {
        cy.get('input').eq(0).type('http://example.com')
    })

    cy.contains('Add more items').click()

    cy.contains('Item name').parent().within(() => {
        cy.get('input').eq(0).should('have.value', '')
    })
    cy.contains('Price (optional)').parent().within(() => {
        cy.get('input').eq(0).should('have.value', '')
    })
    cy.contains('Link (optional)').parent().within(() => {
        cy.get('input').eq(0).should('have.value', '')
    })
    })
})