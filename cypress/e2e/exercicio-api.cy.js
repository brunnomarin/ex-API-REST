/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

const { faker } = require('@faker-js/faker');

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
           }) 
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(30)
          })

     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nomeFaker = faker.person.fullName()
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()

          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nomeFaker,
                    "email": emailFaker,
                    "password": senhaFaker,
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })

     })

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario('João Lima', 'jlima@teste.com', 'teste', 'true')
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })

     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[7]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    failOnStatusCode: false,
                    body: {
                         "nome": "Carlos Almeida A",
                         "email": 'calmeida@teste.com',
                         "password": "teste1",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nomeFaker = faker.person.fullName()
          let emailFaker = faker.internet.email()
          let senhaFaker = faker.internet.password()

          cy.cadastrarUsuarioFaker(nomeFaker, emailFaker, senhaFaker)
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })

               })
     });


});
