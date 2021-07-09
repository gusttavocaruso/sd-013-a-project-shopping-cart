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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  return li;
}
// Adiciona os produtos
const addAllProducts = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector(".items");
    section.appendChild(itemElement);
  });
};
// Recupera a API no servidor
const getMercadoLivrePromise = (query) => {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador").then(
    (response) =>
      response.json().then((data) => {
        addAllProducts(data.results);
      })
  );
};

const BotãoAdicionaProduto = document.querySelector('.item__add');
const addProductCart =  () => {
  return new Promise((resolve, reject) => {
    const item = document.querySelector('.item__sku');
    const text = item.innerHTML;
    const url = `https://api.mercadolibre.com/items/${text}`
    if (url === undefined) {
      reject('Houve uma falha')
    } else {
      fetch(url)
      .then((response) => response.json())
      .then((data) => {
        createCartItemElement(data)
        resolve();
      })
    };
  });
}
getMercadoLivrePromise("computer");
// BotãoAdicionaProduto.addEventListener('click', addProductCart)

