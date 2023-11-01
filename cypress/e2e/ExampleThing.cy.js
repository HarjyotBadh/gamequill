describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:3000')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('Logging In', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('localhost:3000');
    cy.get('#email').clear('b');
    cy.get('#email').type('badhHarjyot99@gmail.com');
    cy.get('#password').clear();
    cy.get('#password').type('something');
    cy.get('.login-button').click();
    /* ==== End Cypress Studio ==== */
  });
})