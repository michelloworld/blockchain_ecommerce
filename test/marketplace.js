const { assert } = require("console");

const Marketplace = artifacts.require("Marketplace");
const a = require('assert');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Marketplace", function (accounts) {
  before(async () => {
    this.seller = accounts[1]
    this.buyer = accounts[2]
    this.Marketplace = await Marketplace.deployed()
  })

  it("should deployed successfully", async () => {
    const address = await this.Marketplace.address
    a.notEqual(address, 0x0)
    a.notEqual(address, '')
    a.notEqual(address, null)
    a.notEqual(address, undefined)
  });

  it('create product', async () => {
    const result = await this.Marketplace.createProduct('Orange', 5, { from: this.seller });
    const productId = await this.Marketplace.productCount();
    a.equal(productId.toNumber(), 2);
    const event = result.logs[0].args;
    a.equal(event.id.toNumber(), 2);
    a.equal(event.name, 'Orange');
    a.equal(event.price, 5);
    a.equal(event.purchased, false);
  })

  it('purchase product', async () => {
    // const sellerBalance = await web3.eth.getBalance(this.seller);
    // const buyerBalance = await web3.eth.getBalance(this.buyer);
    // console.log(sellerBalance)
    // console.log(buyerBalance)

    const result = await this.Marketplace.purchaseProduct(2, { from: this.buyer });
    const event = result.logs[0].args;
  
    a.equal(event.id.toNumber(), 2);
    a.equal(event.purchased, true);
  })
});