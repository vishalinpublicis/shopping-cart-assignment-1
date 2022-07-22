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

//   create html for category function
function createProductHtml(categoryData){
    var template = document.getElementById('productTemplate');
    if(template)
    var productTemplate = template.innerHTML;
    var compiledTemplate = Handlebars.compile(productTemplate);
    var ourGeneratedTemplate = compiledTemplate(categoryData);

    var categoryContainer = document.getElementById('productContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate
}