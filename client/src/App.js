import React, { Component } from 'react';
import ContractApi from './services/contract_api';

// style
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import AddProduct from './components/AddProduct';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      products: [],
      balanceol: 0,
      balanceWeb3: 0,
      hasMetamask: (typeof window.ethereum == 'undefined' ? false : true)
    }
    this.updateProducts = this.updateProducts.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  async loadData() {
    const account = await ContractApi.getAccount()
    const products = await ContractApi.getProducts()
    const balance = await ContractApi.getBalance()
    this.setState({
      account: account,
      products: products,
      balanceWeb3: balance,
    })
  }

  async componentDidMount() {
    const _this = this
    await ContractApi.init()
    if(typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', async () => {
        _this.loadData()
      })
    }
    _this.loadData()
  }

  updateProducts(products) {
    this.setState({
      products: products
    })
  }

  async handlePayment(e, id) {
    e.preventDefault()
    const _this = this
    const { products } = this.state
    const account = await ContractApi.getAccount()
    const elIndex = products.findIndex((p) => {
      return p.id === id
    })
    await ContractApi.Marketplace.methods.purchaseProduct(id).send({ 
      from: account, 
      value: ContractApi.web3.utils.toWei(products[elIndex].price, 'ether') 
    }, (e, txId) => {
      if(txId) {
        setTimeout(async () => {
          const balance = await ContractApi.getBalance()
          _this.setState({
            balanceWeb3: balance,
          })
        }, 500)
      }
    })
    const newArrayProducts = [...products]
    newArrayProducts[elIndex] = { ...newArrayProducts[elIndex], purchased: true }
    this.setState({
      products: newArrayProducts,
    })
  }

  render() {
    const { products, account, balanceWeb3, hasMetamask } = this.state
    return (
      <>
        <Navbar bg="light" expand="lg">
          <div className="container">
            <Navbar.Brand href="/">Blockchain Marketplace</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="#">{account} ({balanceWeb3} ETH)</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <div className="container">
          {hasMetamask && (
            <AddProduct updateProducts={this.updateProducts} />
          )}
          
          <div className="list-product">
            {!hasMetamask ? (
              <Alert variant="danger">
                <Alert.Heading className="text-center">You have to install Metamask on your browser</Alert.Heading>
              </Alert>
            ) : (
              <ul>
                {products.map((product) => (
                  <li key={product.id} className="clearfix">
                    <div className="float-left">
                      <div className="name">{product.name}</div>
                      <div className="price">{product.price} ETH</div>
                      <div className="seller">Seller: {product.seller}</div>
                    </div>
                    <div className="float-right buy">
                      {this.state.account !== product.seller && 
                        (
                          product.purchased ? 
                          'purchased' : 
                          <a href="#" onClick={(e) => this.handlePayment(e, product.id)}>Buy</a>
                        )
                      }
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default App;
