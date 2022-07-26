//imports
const Handlebars = require("handlebars");
const productJsonRequest = new Request('src/json/products.json');

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
    var template = document.getElementById('productTemplate');
    if(template)
    var productTemplate = template.innerHTML;
    var compiledTemplate = Handlebars.compile(productTemplate);
    var ourGeneratedTemplate = compiledTemplate(productData);

    var categoryContainer = document.getElementById('productContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate;

    // add to cart
    addTocartListener();
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
    alert('product already there')
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
        <div class="item-img">
          <img src="${item.imageURL}" alt="${item.name}">
        </div>
        <div class="item-info">
          <h3>${item.name}</h3>
          <div class="item-count">
            <div class="decrement updateUnit" data-stock="${item.stock}" data-action="minus" data-id="${item.id}">-</div>
            <div class="number" data-stock="${item.stock}"> ${item.numberOfUnits} </div>
            <div class="increment updateUnit" data-stock="${item.stock}" data-action="plus" data-id="${item.id}">+</div>
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

// update cart unit
function updateNumberListner(){
  let updateBtn = document.querySelectorAll('.updateUnit');
    for(let i=0;i < updateBtn.length;i++){
      updateBtn[i].addEventListener( 'click', () => {
        let productId = updateBtn[i].getAttribute('data-id');
        let btnAction = updateBtn[i].getAttribute('data-action');
        console.log(btnAction, productId);
        // changeNumberOfUnits(btnAction, productId);
      })
    }
}

// change number of units for an item
function changeNumberOfUnits(action, id) {
  console.log(action. id);
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits++;
      }
    }

    return {
      ...item,
      numberOfUnits,
    };
  });

  updateCart();
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
