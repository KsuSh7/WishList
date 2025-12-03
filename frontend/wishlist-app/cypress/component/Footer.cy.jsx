import React from "react";
import Footer from "../../src/components/Footer";

describe("Footer component", () => {
  it("renders footer text", () => {
    cy.mount(<Footer />);
    cy.contains("© 2025 WishList App").should("exist");
  });
});
