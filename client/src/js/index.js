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
        totalCartValue(itemInProduct.price)
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

  localStorage.setItem('product', JSON.stringify(productData));

}

function getProductData() {
 let data = localStorage.getItem('product')
  console.log(data);
}

//open add to cart popup
function openAddToCartPopup(){
  let addToCartBtn = document.querySelector('.add-cart-btn');
  let cartPopup = document.querySelector('#cartModal');
  addToCartBtn.addEventListener('click', function(){
    cartPopup.style.display = 'block'
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
    cartTotalElement.textContent = parseInt(cartCost) + parseInt(price);
  } else {
    localStorage.setItem('totalCost', parseInt(price));
    cartTotalElement.textContent = parseInt(price);
  }

}