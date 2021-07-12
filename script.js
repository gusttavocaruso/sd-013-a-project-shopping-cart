

function createProductImageElement(imageSource) {     // função para exercico 1: cria imagens
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {    // função: cria elemnetos html
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id:sku, title:name, thumbnail:image }) { //função cria a section, ex.1
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));    // apendi ex.1
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//resolve desafio1 - (com ajuda da Aline Hoshino)
const addProducts = (itens) => {
  itens.forEach((item) => {
    const product = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(product);
  });
};

const mercadoLivre = ((query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((resposta) => {
  resposta.json().then((data)=> {
   addProducts(data.results);
  }); 
  });
});

//desafio 2
const mercado = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json()
    });
}
document.querySelector(".item__add")






 window.onload = () => { 
  mercadoLivre ('computador');
};
