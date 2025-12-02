import React from "react";
import BackgroundLogo from "../../src/components/BackgroundLogo";

describe("BackgroundLogo component", () => {
  it("renders logo image", () => {
    cy.mount(<BackgroundLogo />);
    cy.get("img").should("exist");
    cy.get("img").should("have.attr", "alt", "background logo");
  });
});
