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
        console.log(productId);
        console.log(productData[productId]);
        cartNumber(productData[productId]);
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
  console.log(productData);
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

function setProductItems(){

}