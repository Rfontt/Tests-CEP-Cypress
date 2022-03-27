# Configurar o ambiente

Você deve ter o node e o npm(ou yarn) instalado para prosseguir.

- Instalar node: https://nodejs.org/en/download/

# Iniciando o projeto

Antes de instalamos as dependências é preciso iniciar um projeto com o node e para isso usamos o seguinte comando:

**OBS:** Isso só vai servir se você estiver começando o projeto do zero, caso esteja fazendo um clone desse projeto do github, não precisa rodar esse comando, certo?

```
npm init -y
```

Se você for baixar esse repositório e começar com todos os testes já feitos até aqui use:

```
npm ci ou npm install
```

# Dependências

Com o node instalado e algum gerenciador de pacote(npm ou yarn) você precisa instalar o cypress no projeto.

```
npm install cypress -D our yarn add cypress -D
```

# package.json

Para que tudo possamos dá início ao projeto com cypress precisamos colocar o seguinte script no package.json:

```
"scripts": {
    "test": "npx cypress open"
}
```

# Configs

URLS que servirão como base para realizar os testes

Frontend: https://www.correios.com.br/
Backend: https://viacep.com.br/

# Cypress

Para gerar as páginas do cypress você precisa ir no seu terminal e rodar o seguinte comando:

```
npm run dev
```

Ele vai gerar algumas pastas, mas a que iremos focar é a **integration**

# Integration 

Na pasta integration, para esse projeto, vamos criar a seguinte estrutura de pastas:

- integration
  - frontend -> Ficará responsável por testar o site dos correios
  - backend -> Ficará responsável por testar a API do Via CEP

# Frontend

Verificando o cenário que foi proposto percebi que para não repetir código é possível criar um arquivo que faz toda a operação de ir no site e pegar o input que recebe o CEP e setar nele o valor do CEP, para isso é preciso receber como parâmetro uma variável cep.

Então coloquei na pasta **utils**, e agora esse código pode ser reutilizado e usado em diferentes lógicas de validações.

- Página utils
  - CEPCorreios.util.js

**Códigos:**

```js
// Esse trecho é a importação do cypress para usarmos seus métodos futuramente
/// <reference types="cypress" />

// Essa é a função que será reutilizada em qualquer lugar da pasta frontend de acordo com a lógica de negócio. Ela recebe como parâmetro uma variável cep
function findCEPCorreios(cep) {
    // Nesse trecho usamos um método do cypress chamo visit para visitar o website dos Correios
    cy.visit('https://www.correios.com.br');
    // Aqui pegamos um elemento pelo seu id, esse elemento é um input e pode ser inspecionado no site dos correios, ele tem o id nomeado como: relaxation, o método get serve para pegar esse elemento e o método type serve para escrever algo dentro dele(nesse caso, escreve porque ele é um input) e dentro do type colocamos a variável cep e assim não se prendemos a um cep apenas e sim ao que quem enviar pelo parâmetro digitar, fica dinâmico!
    cy.get('[id=relaxation]').type(cep);
    // Vale ressaltar, que pelo fato do website dos correios ter mais de um button com a mesma class precisei encontrar um método que pegasse esse button em específico, ele era o 2 button, mas na ordem da programação é começado a contagem com 0, então ele virava o 1 button, por isso do método eq(). O método click() faz com que o button seja clicado
    // OBS: o .campo(é uma div que tem a class nomeada como campo) e o ">" representa que a seguinte informação que eu passar estará dentro dessa class, ou seja o button com a class .bt-link-ic está dentro da div .campo
    cy.get('.campo > .bt-link-ic').eq(1).click();
}

// Aqui exportamos a função para que possa ser usada em qualquer lugar que for chamada
export { findCEPCorreios };
```

- findCEPCorreios.test.js

Agora vamos para o teste em si. Aqui estamos em outro arquivo que validará um CEP no site dos Correios.

```js
// Aqui importamos o arquivo util que fizemos no passo anterior
import * as Utils from './utils/CEPCorreios.utils';

// Importamos a referência do cypress para usarmos os métodos dessa tecnologia.
/// <reference types="cypress" />

// O describe é um método para descrevermos o que vamos fazer na estrutura geral do arquivo(um BDD)
describe('Find for CEP in https://www.correios.com.br website', () => {
    // O it representa apenas um teste em si, ele deve fazer apenas uma coisa em específico, ele também tem um descrição que é colocada bem no início do método(BDD também)
    it('Should visit the Correios page and type a correct CEP', () => {
        // Aqui criamos uma variável de cep com um cep válido
        const cep = '62375000';

        // Aqui chamamos a função que irá fazer tudo que desejamos: validar o cep que estamos enviando por parâmetro
        Utils.findCEPCorreios(cep);
    });
});
```

# Backend

- backend
  - mocks: Fica responsável por representar o que desejamos receber no corpo da requisição da API(ou seja o retorno que a API nos devolve)
  - requests: São funções que fazem as requisições para a api, usam métodos GET, POST, PUT, PACTH, DELETE
  - tests: São os testes em si, em que chamamos as requisições e dizemos o que esperamos delas

**mocks**

Nessa pasta vamos guardar o que desejamos receber. 

Nesse teste em específico eu usei o cep 01001000 que devolve o seguinte resultado:

- CEPInformationsJSON-valid.mock.json

```json
{
    "cep": "01001-000",
    "logradouro": "Praça da Sé",
    "complemento": "lado ímpar",
    "bairro": "Sé",
    "localidade": "São Paulo",
    "uf": "SP",
    "ibge": "3550308",
    "gia": "1004",
    "ddd": "11",
    "siafi": "7107"
}
```

Então o arquivo CEPInformationsJSON-valid.mock.json vai armazenar apenas esse json que queremos receber como resposta quando enviarmos o cep 01001-000.

**requests:**

```js
// Importação da referência do cypress para usarmos seus métodos
/// <reference types="cypress" />

// Função que recebe uma variável cep como parâmetro
function findCep(cep) {
    // cy.request faz uma requisição para uma determinada API de acordo com a url
    return cy.request({
        // Método da requisição
        method: 'GET',
        // URL da API que queremos testar, nesse caso passo como parâmetro da url, o cep nos informados no parâmetro da função
        url: `viacep.com.br/ws/${cep}/json/`,
        // Para não se basear apenas nos status code o teste
        failOnStatusCode: false
    }).as('Response');
    // .as(nome que queremos dar a essa requisição) => nomea a requisição
}

// Exporta a função
export { findCep };
```

**tests:**

```js
// Importa todas as funções de request(nesse caso temos apenas uma, mas você pode fazer mais requests)
import * as viaCEPRequest  from '../requests/viaCEP.request';
// Importa o mock(json) que criamos na pasta mocks
import CEPInformationsMock from '../mocks/CEPInformationsJSON-valid.mock.json';

// Método describe que engloba todos os testes e possui uma descrição do que os testes irã fazer
describe('This test should validate Via CEP API', () => {
    // Método it que recebe a descrição do teste e uma função com os passos a passos do teste
    it('Should return an object about the CEP in Via CEP API and 200 Status Code', () => {
        // Variável cep com um cep válido
        const cep = '01001000';

        // Aqui usamos a função criada na pasta requests e como ela retorna um método do cypress podemos usar outros métodos dele para validar o nosso teste, nesse caso usamos o should que recebe a response do API, ou seja, ele vai conter o body, o status code e tudo que a api devolve.
        viaCEPRequest.findCep(cep).should((response) => {
            // Aqui usamos o método expect que verifica se o status code é igual a 200
            expect(response.status).to.eq(200);
            // Aqui o método expect verifica se o body é stritamente igual ao nosso mock(ou seja, o que desejamos receber)
            expect(response.body).to.be.deep.eq(CEPInformationsMock);
        });
    });
});
```

# Dicas para a evolução dos testes

**Frontend:** 

- Verificar mais CEPS, tanto válidos, quanto inválidos

**Backend:**

- Verificar mais CEPS, válidos e inválidos
- Criar mais mocks para esses testes
- Criar mocks em xml ou outros formatos que a API devolve e ver se os resultados batem