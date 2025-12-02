import React from "react";
import Header from "../../src/components/Header";
import { MemoryRouter } from "react-router-dom";

describe("Header component", () => {
  it("renders header component", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.get("header").should("exist");
  });

  it("renders avatar if user is authenticated", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.get("img").should("exist");
  });

  it("renders login/signup if guest", () => {
    cy.mount(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    cy.contains("Login").should("exist");
    cy.contains("Sign up").should("exist");
  });
});