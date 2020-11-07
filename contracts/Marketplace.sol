// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Marketplace {
  uint public productCount = 0;

  struct Product {
    uint id;
    string name;
    uint price;
    address payable seller;
    bool purchased;
  }

  mapping(uint => Product) public products;

  constructor() public {
    productCount++;
    address myAddress = 0x904fae5a65E9ecCF44559348c546Af6a1dE7801A;
    products[1] = Product(productCount, "Perfume", 5, address(uint160(myAddress)), false);
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address payable seller,
    bool purchased
  );

  function createProduct(string memory _name, uint _price) public {
    productCount++;
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    emit ProductCreated(productCount, _name, _price, msg.sender, false);
  }

  event PurchaseProduct(
    uint id,
    bool purchased
  );

  function purchaseProduct(uint _id) public payable {
    Product memory _product = products[_id];
    require(msg.sender != _product.seller, "can't buy your own product");
    require(msg.sender.balance >= _product.price, "you have no money");
    _product.purchased = true;
    products[_id] = _product;

    // for some reason "transfer" function did not work
    _product.seller.send(_product.price * 1000000000000000000);
    emit PurchaseProduct(_id, _product.purchased);
  }

  function getBalance() public view returns (uint) {
    return msg.sender.balance;
  }
}