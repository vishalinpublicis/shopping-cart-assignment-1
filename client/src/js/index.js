// Home page js
const myRequest = new Request('src/json/categories.json');
const Handlebars = require("handlebars");

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    createCategoryHtml(data);
  })
  .catch(console.error);

//   create html for category function
function createCategoryHtml(categoryData){
    var template = document.getElementById('categoryTemplate');
    if(template)
    var categoryTemplate = template.innerHTML;
    var compiledTemplate = Handlebars.compile(categoryTemplate);
    var ourGeneratedTemplate = compiledTemplate(categoryData);

    var categoryContainer = document.getElementById('categoryContainer');
      categoryContainer.innerHTML = ourGeneratedTemplate;
}

// product page js
const productJsonRequest = new Request('src/json/products.json');

fetch(productJsonRequest)
  .then(response => response.json())
  .then(data => {
    createProductHtml(data);
  })
  .catch(console.error);

//   create html for product function
function createProductHtml(productData){
    var template = document.getElementById('productTemplate');
    if(template)
    var productTemplate = template.innerHTML;
    var compiledTemplate = Handlebars.compile(productTemplate);
    var ourGeneratedTemplate = compiledTemplate(productData);

    var categoryContainer = document.getElementById('productContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate;

    // add to cart funct
    if(productData){
      addTocartListener(productData);
    }

}


// add to cart functionality
function addTocartListener(productData){
  let addToCart = document.querySelectorAll('.addToCart');
    for(let i=0;i < addToCart.length;i++){
      addToCart[i].addEventListener( 'click', () => {
        let productId = addToCart[i].getAttribute('data-id');
        let itemInProduct = productData.find(element => element.id == productId);
        cartNumber(itemInProduct);
        totalCartValue(itemInProduct.price);
      })
    }
}

//check if cart item is there in local storage
function onLoadCartData(){
  let productNum = localStorage.getItem('cartNumber');
  if(productNum){
    document.querySelector('.card-items-count').textContent = productNum;
  }
}

// add cart item in local storage and in cart
function cartNumber(productData){
  // console.log(productData);
  let productNumbers = localStorage.getItem('cartNumber');
  productNumbers = parseInt(productNumbers);

  if(productNumbers){
    localStorage.setItem('cartNumber', productNumbers + 1);
    document.querySelector('.card-items-count').textContent = productNumbers + 1;

  } else{
    localStorage.setItem('cartNumber', 1);
    document.querySelector('.card-items-count').textContent = 1;
  }

  setProductItems(productData);
}


//calling onload cart func
onLoadCartData();

function setProductItems(productData){
  let cartItem = localStorage.getItem('product');
  cartItem = JSON.parse(cartItem);

  if(cartItem != null){
      if(cartItem[productData.id] == undefined){
        cartItem = {
          ...cartItem,
          [productData.id] : productData
        }
      }
    cartItem[productData.id].inCart += 1;
  } else {
    productData.inCart = 1;
    cartItem ={
      [productData.id]: productData
    }
  }

  localStorage.setItem('product', JSON.stringify(cartItem));

}


//open add to cart popup
function openAddToCartPopup(){
  let addToCartBtn = document.querySelector('.add-cart-btn');
  let cartPopup = document.querySelector('#cartModal');
  let emptyCart = document.querySelector('.empty-cart-section');
  let emptyCartbtn = document.querySelector('.empty-cart-btn');
  let filledCartbtn = document.querySelector('.filled-cart-btn');
  let productList = document.querySelector('.product-list');

  addToCartBtn.addEventListener('click', function(){
    cartPopup.style.display = 'block';
    displayCart();
    if ("product" in localStorage) {
      emptyCart.style.display = 'none';
      emptyCartbtn.style.display= 'none';
      filledCartbtn.style.display= 'flex';
      productList.style.display = 'block';
    } else {
      emptyCart.style.display = 'flex';
      emptyCartbtn.style.display= 'block';
      filledCartbtn.style.display= 'none';
      productList.style.display = 'none';
    }
  })
}
//open cart popup listener
openAddToCartPopup();

// close popup
function closePopup(){
  let closeBtn = document.querySelector('#cartModal .close');
  let cartPopup = document.querySelector('#cartModal');
  closeBtn.addEventListener('click', function(){
    cartPopup.style.display = 'none';
  })
}

//close add to cart modal
closePopup();


// total product cost in cart popup
function totalCartValue(price){
  let cartTotalElement = document.querySelector('.cartTotalVal');
  let cartCost = localStorage.getItem('totalCost');
  if(cartCost != null){
    localStorage.setItem('totalCost', parseInt(cartCost) + parseInt(price));
    cartTotalElement.textContent = 'Rs '+ parseInt(cartCost) + parseInt(price);
  } else {
    localStorage.setItem('totalCost', parseInt(price));
    cartTotalElement.textContent = 'Rs ' + parseInt(price);
  }
}

function displayCart(){
  let cartItems= localStorage.getItem('product');
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector('.cart-content .product-list');

  if(cartItems && productContainer){
    productContainer.innerHTML ='';
    Object.values(cartItems).map( item => {
      productContainer.innerHTML += `
      <div class="popup-item">
        <div class="item-img">
          <img src="${item.imageURL}" alt="${item.name}">
        </div>
        <div class="item-info">
          <h3>${item.name}</h3>
          <div class="item-count">
            <div class="decrement">-</div>
            <div class="number" data-stock="${item.stock}"> ${item.inCart} </div>
            <div class="increment">+</div>
            <span class="cross">x</span>
            <div class="item-price">Rs.${item.price}</div>
          </div>
        </div>
        <div class="item-total-price">Rs.${item.price * item.inCart}</div>
      </div>
      `
    })

  let cartCost = localStorage.getItem('totalCost');
  let cartTotalElement = document.querySelector('.cartTotalVal');
  cartTotalElement.textContent = 'Rs ' + parseInt(cartCost);
    incrementCart();
    decrementCart();
  }
}

incrementCart();
decrementCart();

// increment 
function incrementCart(){
  let incrementBtn = document.querySelectorAll('.increment');
  let itemVal = document.querySelectorAll('.number');
  for(let i=0; i< incrementBtn.length; i++){
    incrementBtn[i].addEventListener('click', () => {
      let itemNum = itemVal[i].innerText;
      let maxValue = itemVal[i].getAttribute('data-stock');
      var value= parseInt(itemNum,10);
      value= isNaN(value) ? '0': value;
      if(value < maxValue){
          value++;
          itemVal[i].innerHTML = value;
      } else {
        alert(`max stock for this Product is ${maxValue}`)
      }
      
    })
  }
}


function decrementCart(){
  let decrementBtn = document.querySelectorAll('.decrement');
  let itemVal = document.querySelectorAll('.number');
  for(let i=0; i< incrementBtn.length; i++){
    decrementBtn[i].addEventListener('click', () => {
      let itemNum = itemVal[i].innerText;
      var value= parseInt(itemNum,10);
      value= isNaN(value) ? '0': value;
      if(value > 1){
          value--;
          itemVal[i].innerHTML = value;
      }
      
    })
  }
}