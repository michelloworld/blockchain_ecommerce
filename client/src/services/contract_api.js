import Web3 from 'web3';

import MarketplaceContractMeta from '../contracts/Marketplace.json';

export default class ContractApi {
  static async init() {
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
    this.web3 = web3

    const marketplaceContract = new web3.eth.Contract(MarketplaceContractMeta.abi, MarketplaceContractMeta.networks[5777].address)
    this.Marketplace = marketplaceContract
  }

  static async getAccount() {
    const accounts = await this.web3.eth.getAccounts()
    let account = null
    if(accounts.length === 1) {
      account = accounts[0]
    }
    return account
  }

  static async getProductCount() {
    return await this.Marketplace.methods.productCount().call()
  }

  static async getProducts() {
    const productCount = await this.getProductCount()
    const products = []
    for(let i = productCount; i > 0; i--) {
      const product = await this.Marketplace.methods.products(i).call()
      products.push(product)
    }
    return products
  }

  static async getBalance() {
    const account = await this.getAccount()
    if(account) {
      const balanceWeb3 = await this.web3.eth.getBalance(account)
      const balance = this.web3.utils.fromWei(balanceWeb3, 'ether')
      return parseFloat(balance).toFixed(2)  
    }
    return 0
  }
}
