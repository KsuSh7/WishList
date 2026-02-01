describe('Auth (e2e)', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/profile', {
      statusCode: 200,
      body: null,
    });
    cy.visit('/auth');
  });

  it('shows validation alert when fields are empty', () => {
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Please fill in all fields.');
    });
    cy.get('button').contains("Let's go").click();
  });

  it('shows alert for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('123456');
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Invalid email format.');
    });
    cy.get('button').contains("Let's go").click();
  });

  it('shows alert for short password', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('123');
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Password must be at least 6 characters long');
    });
    cy.get('button').contains("Let's go").click();
  });

  it('switches to Sign Up form', () => {
    cy.get('span').click();
    cy.get('h2').should('contain', 'Sign Up');
    cy.get('input[type="text"]').should('exist');
  });

  it('shows alert when signup fails', () => {
    cy.get('span').click();

    cy.get('input[type="text"]').type('NewUser');
    cy.get('input[type="email"]').type('fail@example.com');
    cy.get('input[type="password"]').type('123456');

    cy.intercept('POST', '/api/register', {
      statusCode: 400,
      body: { message: 'Email already exists' },
    });

    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Authentication failed');
    });

    cy.get('button').contains("Let's go").click();
  });

  it('logs in successfully and navigates to /user', () => {
    // Інтерцепт до кліку
    cy.intercept('POST', '**/api/login', (req) => {
        expect(req.body).to.have.property('email', 'test@example.com')
        expect(req.body).to.have.property('password', 'qw123456')

        req.reply({
        statusCode: 200,
        body: {
            ok: true,
            user: {
            id: 1,
            username: 'TestUser',
            email: 'test@example.com',
            avatar: null
            }
        }
        })
    }).as('loginRequest')

    cy.get('input[type="email"]').clear().type('test@example.com')
    cy.get('input[type="password"]').clear().type('qw123456')

    cy.get('button').contains("Let's go").click()

    cy.wait('@loginRequest') // чекаємо на інтерцепт

    cy.url().should('include', '/user')
    })

});
