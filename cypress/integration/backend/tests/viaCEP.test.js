import * as viaCEPRequest  from '../requests/viaCEP.request';
import CEPInformationsMock from '../mocks/CEPInformationsJSON-valid.mock.json';

describe('This test should validate Via CEP API', () => {
    it('Should return an object about the CEP in Via CEP API and 200 Status Code', () => {
        const cep = '01001000';

        viaCEPRequest.findCep(cep).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.deep.eq(CEPInformationsMock);
        });
    });
});