function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
} 

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

async function cartWithItem(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resolve) => resolve.json())
  .then((json) => {
    const specifications = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
      const cartItem = createCartItemElement(specifications);
      const cartItens = document.querySelector('.cart__items');
      cartItens.appendChild(cartItem);
  });
}

function cartItemClickListener(event) { 
  if (event.target.className === 'item__add') {
    const id = event.target.parentNode.firstChild.innerText;
    cartWithItem(id);
  }
}

const eventWithItem = () => {
  const allItems = document.querySelector('.items');
  allItems.addEventListener('click', (event) => {
    cartItemClickListener(event);
  });
};

const addItemList = (itens) => {
  itens.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const itemList = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItemList(data.results);
      });
    });
};

window.onload = () => { };
  itemList('computador');
  eventWithItem();

// Requisito 1 - Havia feito dentro de uma função só, mas ficou bem melhor quando dividi o código fazendo semelhante a forma como o tio Jack fez;
// Requisito 2 - Fiz a função eventWithItem que um evento para os meus itens, ela chama a função cartItemClickListener que vai verificar se a classe do item target (item que estou clicando) é igual a classe já pré definida 'item__add. Se sim, é criada uma constante chamada id que recebe o texto do primeiro filho do seu elemento pai, esta função envoca a função cartWithItem com o id como parametro. Esta função é async (não havia pensado em usar, mas apareceu ... ao lado do parametro dizendo que é uma função assync), ela faz a consulta a API, retorna positivamente, extraio apenas o json dela e atribuo as especificações de cada item (sku, name, salePrice) os respectivos dados json vindos da API. 