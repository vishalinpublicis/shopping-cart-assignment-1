const myRequest = new Request('src/json/products.json');
const Handlebars = require("handlebars");

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    createProductHtml(data);
  })
  .catch(console.error);

//   create html for category function
function createProductHtml(categoryData){
    var template = document.getElementById('productTemplate').innerHTML;
    var compiledTemplate = Handlebars.compile(template);
    var ourGeneratedTemplate = compiledTemplate(categoryData);

    var categoryContainer = document.getElementById('productContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate
}