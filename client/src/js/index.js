const myRequest = new Request('static/json/categories.json');
const Handlebars = require("handlebars");

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    createHtml(data);
  })
  .catch(console.error);

//   create html for category function
function createHtml(categoryData){
    var template = document.getElementById('categoryTemplate').innerHTML;
    var compiledTemplate = Handlebars.compile(template);
    var ourGeneratedTemplate = compiledTemplate(categoryData);

    var categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = ourGeneratedTemplate
}