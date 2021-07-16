// Requisitando a fetch lista de produtos:
const fetchCart = (pesquisa) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((response) => response.json())
    .then((data) => appendData(data.results))
    .catch((error) => (error, 'error'));
};

// Criando os elementos:
const appendData = (results) => {
  results.forEach((result) => {
    const createItem = createProductItemElement(result);
    const itemList = document.querySelector(".items");
    itemList.appendChild(createItem);
  });
};

function createProductImageElement(imageSource) {
  const img = document.createElement("img");
  img.className = "item__image";
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
  const section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement("button", "item__add", "Adicionar ao carrinho!")
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  return li;
}

// Adicionar ao carrinho:
const btnAddCart = () => {
  const section = document.querySelector('.items')
  section.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      fetchItemId(event)
    }
  })
}

// Adicionando na lista:
const fetchItemId = (botao) => {
  const elementoBotao = botao.target;
  const elementoPai = elementoBotao.parentElement;
  const pegarId = elementoPai.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${pegarId}`)
  .then((response) => response.json())
  .then((data) => {
    const criarLi = createCartItemElement(data)
    const addOl = document.querySelector('.cart__items')
    addOl.appendChild(criarLi)
  })
}

window.onload = () => {
  fetchCart("computador");
  btnAddCart();
};
