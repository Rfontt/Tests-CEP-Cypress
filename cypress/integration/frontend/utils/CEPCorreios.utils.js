/// <reference types="cypress" />

function findCEPCorreios(cep) {
    cy.visit('https://www.correios.com.br');
    cy.get('[id=relaxation]').type(cep);
    cy.get('.campo > .bt-link-ic').eq(1).click();
}

export { findCEPCorreios };