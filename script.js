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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getCart = () => document.querySelector('.cart__items');

function storeCart () { // Questão resolvida com ajuda do amigo Rodrigo Pova.
  localStorage.setItem('cartContent', getCart().innerHTML);
};

function retrieveCart() {
  getCart().innerHTML = localStorage.getItem('cartContent');
};

function emptyButton () {
  const emptyBtn = document.querySelector('.empty-cart')
  emptyBtn.addEventListener('click', () => {
    getCart().innerHTML = '';
  });
}

function cartItemClickListener(event) { // Questão resolvida com ajuda do amigo Rodrigo Pova.
  event.target.remove();
  storeCart();
}

function createCartItemElement({id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addNewItem (items) { // Questão resolvida com ajuda do amigo Rodrigo Pova.
  // A função addChild cria um novo item/elemento e coloca esse novo elemento como filho da classe .items.
  items.forEach((item) => {
    const newItem = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(newItem);
    // Busca pela calasse item add, no elemento criado, o botão de adicionar ao carrinho.
    const findButton = newItem.querySelector('.item__add');
    //
    findButton.addEventListener('click', addNewItemToCart);
  });
};

async function addNewItemToCart (event) { // Questão resolvida com ajuda do amigo Rodrigo Pova.
  const itemSku = getSkuFromProductItem(event.target.parentElement);
  const response = await fetch (`https://api.mercadolibre.com/items/${itemSku}`);
  const data = await response.json();
  const findOl = document.querySelector('.cart__items');
  findOl.appendChild(createCartItemElement(data));
  storeCart();
}

async function getApi (userInput) {
  // Primeiramente, declaramos a função utilizando o método async/await e, por meio da const response, recebemos uma promise do site MercadoLivre. No endereço da API, substituímos a parte final da URL, por meio de template literals, para que possamos atualizar a página com base no input fornecido pelo usuário.
  const response = await fetch (`https://api.mercadolibre.com/sites/MLB/search?q=${userInput}`);
  // Na sequência, declaramos uma constante chamada 'data' e atribuímos a ela a resposta obtida anteriormente, mas filtramos os dados utilizando o método json(). O resultado é uma nova promise que iremos retornar chamando pela constante data.
  const data = await response.json();
    // A constante data já está armazenando os dados do json() e, por tanto, basta chamar a função addNewItem e passar como parâmetro o conteúdo de data, filtrando pelos resultados.
    addNewItem(data.results);
};

window.onload = () => {
  getApi('computador');
  retrieveCart();
  emptyButton ();
}