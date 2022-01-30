const http = require("http");
const url = require("url");
const fs = require("fs");
const { type } = require("os");
("use strict");

//Reading JSON
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
//Convert data into a JS Object
const dataObj = JSON.parse(data);

//Getting the Index pg
const indexCard = fs.readFileSync("./Index.html", "utf-8");
//Getting the Product pg
const productCard = fs.readFileSync("./product.html", "utf-8");
//Getting the Index-template pg
const indexTemp = fs.readFileSync("./Index-template.html", "utf-8");

//replacetemplate function to replace the template with the data from the JSON file
const replaceTemplate = function (template, currentElement) {
  let output = template.replace(/{%productName%}/g, currentElement.productName);

  //If carnivore
  if (currentElement.type == "Carnivore") {
    output = output.replace(/{%typeCarn%}/g, "typeCarn");
  }
  //If Vegan
  if (currentElement.type == "Vegan") {
    output = output.replace(/{%typeCarn%}/g, "typeVegan");
  }
  //If Vegetarian
  if (currentElement.type === "Vegeterian") {
    output = output.replace(/{%typeCarn%}/g, "typeVegeterian");
  }
  //If Mix
  if (currentElement.type === "Mix") {
    output = output.replace(/{%typeCarn%}/g, "typeMix");
  }
  output = output.replace(/{%id%}/g, currentElement.id);
  output = output.replace(/{%image-front%}/g, currentElement.imageFront);
  output = output.replace(/{%quantity%}/g, currentElement.quantity);
  output = output.replace(/{%price%}/g, currentElement.price);
  output = output.replace(/{%description%}/g, currentElement.description);
  output = output.replace(/{%type%}/g, currentElement.type);
  output = output.replace(/{%metEng%}/g, currentElement.metEng);
  output = output.replace(/{%crudeP%}/g, currentElement.crudeP);
  output = output.replace(/{%crudeFa%}/g, currentElement.crudeFa);
  output = output.replace(/{%crudeFi%}/g, currentElement.crudeFi);
  output = output.replace(/{%moisture%}/g, currentElement.moisture);
  const ingr = currentElement.ingredients.map((i) => {
    return `<li class="ingredient-item">
        <span>🐾${i}</span>
      </li>`;
  });
  output = output.replace(/%ingredient%/g, ingr);
  return output;
};

//Creating a server for the first time
const server = http.createServer(function (request, response) {
  //Send back a response to the client

  //Get the request url
  const { pathname, searchParams } = new URL(
    request.url,
    `https://${request.headers.host}`
  );
  //Store the key value pair id
  const query = Object.fromEntries(searchParams);

  //Routing to the home page or overview
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });

    //Map over the dataObject to show all the items
    //replaceTemplate function takes in the template to be replaced and the currentElement from the JSON file
    //indexHtml returns an array, therefore convert it into a string
    const indexHtml = dataObj
      .map((el) => replaceTemplate(indexTemp, el))
      .join("");
    //Replace the card in Index.html with the above string
    const outputIndex = indexCard.replace(`{%INDEX-CARD%}`, indexHtml);
    response.end(outputIndex);
  }
  //Routing to the product page
  else if (pathname === "/product") {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });

    //Get the product based on the id
    const product = dataObj[query.id];
    const output = replaceTemplate(productCard, product);
    response.end(output);
  }
  //Routing 404's
  else {
    response.writeHead(404, {
      "Content-type": "text/html",
    });
    response.end("<h1>Page Not Found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to yo ur stupid server...");
});
