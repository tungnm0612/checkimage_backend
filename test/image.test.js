const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');

let accounts;
let imagecontract;
const INITIAL_THINGS = ['1','hash1'];

beforeEach(async () => {
    //get a list of all accounts
    accounts = await web3.eth.getAccounts();

    imagecontract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: INITIAL_THINGS })
        .send({from: accounts[0], gas: '1000000'})
    
        imagecontract.setProvider(provider);
})

describe('ImageContract', () => {
    it('deploys a contract', () => {
        assert.ok(imagecontract.options.address);
    });

    it('has a default image', async () => {
        const Images = await imagecontract.methods.getImage().call();
        assert.equal(Images, INITIAL_THINGS);
    });

    it('can change the image', async () =>{
        await imagecontract.methods.addImage('iduser1', 'hashimage1').send({from: accounts[0]});
        const Images = await imagecontract.methods.getImage().call();
        assert.equal(Images, 'iduser1', 'hashimage1')
    })
})