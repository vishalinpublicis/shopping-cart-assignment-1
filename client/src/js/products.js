//imports
const Handlebars = require("handlebars");
const productJsonRequest = new Request('src/json/products.json');
const CategoryJsonRequest = new Request('src/json/categories.json');
import '../json/categories.json';
import '../json/products.json';

//select element
const productsEl = document.querySelector(".product-cards");
let cartItemsEl = document.querySelector('.cart-content .product-list');
const subtotalEl = document.querySelector(".cartTotalVal");
const totalItemsInCartEl = document.querySelector(".card-items-count");
const loaderEl = document.querySelector('.loader');
let cartPopup = document.querySelector('#cartModal');
let cartBtn = document.querySelector('.add-cart-btn');
let emptyCartEl = document.querySelector('.empty-cart-section');
let emptyCartBtn = document.querySelector('.empty-cart-btn');
let filledCartBtn = document.querySelector('.filled-cart-btn');
let cartCountHeaderEl = document.querySelector('.cart-count');

// product array
let productData = [];

//fetching product data from api
fetch(productJsonRequest)
  .then(response => response.json())
  .then(data => {
    if(data){
      createProductHtml(data);
      loaderEl.style.display= 'none';
      productData = data;
    }
  })
  .catch(console.error);

//product html with handelbarjs template engine
function createProductHtml(productData){
    if(productData.length){
      var template = document.getElementById('productTemplate');
      if(template)
      var productTemplate = template.innerHTML;
      var compiledTemplate = Handlebars.compile(productTemplate);
      var ourGeneratedTemplate = compiledTemplate(productData);
  
      var categoryContainer = document.getElementById('productContainer');
      categoryContainer.innerHTML = ourGeneratedTemplate;
  
      // add to cart
      addTocartListener();
    } else {
      var template = document.getElementById('emptyProduct');
      if(template)
      var productTemplate = template.innerHTML;
      var compiledTemplate = Handlebars.compile(productTemplate);
      var ourGeneratedTemplate = compiledTemplate(productData);
  
      var categoryContainer = document.getElementById('productContainer');
      categoryContainer.innerHTML = ourGeneratedTemplate;
    }
}

// cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();


//attach addTocart event to elements
function addTocartListener(){
  let addToCartBtn = document.querySelectorAll('.addToCart');
    for(let i=0;i < addToCartBtn.length;i++){
      addToCartBtn[i].addEventListener( 'click', () => {
        let productId = addToCartBtn[i].getAttribute('data-id');
        addToCart(productId);
      })
    }
}

// add to cart 
function addToCart(id) {
  // check if prodcut already exist in cart
  if (cart.some((item) => item.id === id)) {
    for (var i = 0; i < cart.length; i++) {
      let stockBoolean = (cart[i].numberOfUnits < cart[i].stock);
      if(id === cart[i].id && stockBoolean ){  //look for match with name
          cart[i].numberOfUnits += 1;
      }
   }

  } else {
    const item = productData.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }

  updateCart();
}

// update cart
function updateCart() {
  renderCartItems();
  renderSubtotal();
  removeCartItem();

  // save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
function renderSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });

  subtotalEl.innerHTML = ` Rs ${totalPrice.toFixed(2)}`;
  totalItemsInCartEl.innerHTML = totalItems;
  cartCountHeaderEl.innerHTML = totalItems
}


// render cart items
function renderCartItems() {
  cartItemsEl.innerHTML = ""; // clear cart element
  cart.forEach((item) => {
    cartItemsEl.innerHTML += `
        <div class="popup-item" data-id="${item.id}">
        <button class="delete-item" title="Remove Item" data-id="${item.id}"><i class="fa fa-times" aria-hidden="true"></i></button>
        <div class="item-img">
          <img src="${item.imageURL}" alt="${item.name}">
        </div>
        <div class="item-info">
          <div class="item-title">${item.name}</div>
          <div class="item-count">
            <div class="decrement updateUnit" data-stock="${item.stock}" data-action="minus" data-id="${item.id}" aria-label="Decrement Button">-</div>
            <div class="number" data-stock="${item.stock}"> ${item.numberOfUnits} </div>
            <div class="increment updateUnit" data-stock="${item.stock}" data-action="plus" data-id="${item.id}" aria-label="Increment Button">+</div>
            <span class="cross">x</span>
            <div class="item-price" data-price="${item.price}">Rs. ${item.price}</div>
          </div>
        </div>
        <div class="item-total-price" data-totalPrice="${item.price * item.numberOfUnits}">${item.price * item.numberOfUnits}</div>
      </div>
      `;
    });
    // updateNumberListner();
    updateUnitNumber();
}

//open add to cart popup
function openAddToCartPopup(){
  cartBtn.addEventListener('click', function(){
    cartPopup.style.display = 'block';
    updateCart();
    
    if (cart.length) {
      emptyCartEl.style.display = 'none';
      emptyCartBtn.style.display= 'none';
      filledCartBtn.style.display= 'flex';
      productsEl.style.display = 'block';
    } else {
      emptyCartEl.style.display = 'flex';
      emptyCartBtn.style.display= 'block';
      filledCartBtn.style.display= 'none';
    }
  })
}

openAddToCartPopup();


// close cart popup
function closePopup(){
  let closeBtn = document.querySelector('#cartModal .close');
  closeBtn.addEventListener('click', function(){
    cartPopup.style.display = 'none';
  })
}

closePopup();


// update product unit in cart 
function updateUnitNumber(){
  let updateUnitBtn = document.querySelectorAll('.updateUnit');

  for(let i=0; i< updateUnitBtn.length; i++){
    updateUnitBtn[i].addEventListener('click', () => {
      let btnAction = updateUnitBtn[i].getAttribute('data-action');
      let productId = updateUnitBtn[i].getAttribute('data-id');
      let inStock = updateUnitBtn[i].getAttribute('data-stock');

      cart = cart.map((item) => {
        let numberOfUnits = item.numberOfUnits;
        if (item.id === productId) {
          if (btnAction === "minus" && numberOfUnits > 1) {
            numberOfUnits--;
          } else if (btnAction === "plus" && numberOfUnits < inStock) {
            numberOfUnits++;
          }
        }
    
        return {
          ...item,
          numberOfUnits,
        };
      });
    
      updateCart();

    })
  }
}

updateUnitNumber();

//attach event remove item 
function removeCartItem(){

  let deleteItemBtn = document.querySelectorAll('.delete-item');

  for(let i=0; i< deleteItemBtn.length; i++){
    let productId = deleteItemBtn[i].getAttribute('data-id');
    deleteItemBtn[i].addEventListener('click', () => {
      console.log('clikc hua');
      removeItemFromCart(productId);
    })
  }
}


// remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  openAddToCartPopup();
  updateCart();
}


// category list api call
fetch(CategoryJsonRequest)
  .then(response => response.json())
  .then(data => {
    createCategoryHtml(data);
  filterCategoryListner();

  })
  .catch(console.error);

  //category list html using handelbar template
function createCategoryHtml(categoryData){
  const allCategoryObj = {
    "name": "All",
    "id": ""
  }
  let newCategoryData = [allCategoryObj, ...categoryData];
  const template = document.getElementById('categoryTemplate');
  if(template)
  var categoryTemplate = template.innerHTML;
  var compiledTemplate = Handlebars.compile(categoryTemplate);
  var ourGeneratedTemplate = compiledTemplate(newCategoryData);

  var categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate;

  //once item render then call
  filterCategoryListner();
}

//attach click event to category links
function filterCategoryListner(){
  var link = document.getElementById('categoryContainer').getElementsByTagName('a');
  for(let i=0; i< link.length; i++){
    link[i].addEventListener('click', function(event){
      event.preventDefault();
      let categoryId = link[i].getAttribute('data-category');
      filterProduct(categoryId)
    }, false)
  }
}


function filterProduct(id){
  if(id === undefined || id === null || id === ''){
    createProductHtml(productData);
  } else {
    let productArray = productData.filter( (product) =>{
      return product.category === id;
    })
    createProductHtml(productArray);
  }
}