import React, { Component } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ContractApi from '../services/contract_api'

class AddProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: {
        name: '',
        price: '',
      }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { input } = this.state
    const account = await ContractApi.getAccount()
    await ContractApi.Marketplace.methods.createProduct(input.name, input.price).send({ from: account })
    const products = await ContractApi.getProducts()
    this.props.updateProducts(products)
  }

  handleChange(e) {
    const { input } = this.state
    const name = e.target.name
    const value = e.target.value
    this.setState({
      input: {
        ...input, [name]: value
      }
    })
  }

  render() {
    const { input } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" name="name" onChange={this.handleChange} value={input.name} />
        </Form.Group>
  
        <Form.Group controlId="price">
          <Form.Label>Product Price</Form.Label>
          <Form.Control type="number" name="price" onChange={this.handleChange} value={input.price} />
        </Form.Group>
  
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    ) 
  }
}

export default AddProduct