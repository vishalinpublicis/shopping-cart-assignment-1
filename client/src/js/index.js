// Home page js
const myRequest = new Request('src/json/categories.json');
const Handlebars = require("handlebars");
import '../../scss/styles.css';

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
