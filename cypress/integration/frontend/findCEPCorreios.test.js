import * as Utils from './utils/CEPCorreios.utils';

/// <reference types="cypress" />

describe('Find for CEP in https://www.correios.com.br website', () => {
    it('Should visit the Correios page and type a correct CEP', () => {
        const cep = '62375000';

        Utils.findCEPCorreios(cep);
    });
});