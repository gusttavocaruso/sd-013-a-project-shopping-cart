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
  section.id = sku;

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
  li.id = document.querySelectorAll('.cart__item').length;
  return li;
}

const results = (items) => {
  items.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector(".items");
    section.appendChild(element);
  });
};

const search = (query) => {
  const tests = fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${query}`
  )
    .then((response) => response.json())
    .then((body) => {
      results(body.results);
    });
};

const saveContent = () => {
  const list = { item: [] };
  document.querySelectorAll("li").forEach((listItem) => {
    list.item.push(listItem.textContent);
  });
  localStorage.setItem('item', JSON.stringify(list));
};

const adicionaClick = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then((data) => {
      const newProduct = createCartItemElement(data);
      document.querySelector(".cart__items").appendChild(newProduct);
      saveContent();
    });
  });
};

const load = () => {
  const objects = JSON.parse(localStorage.getItem('item'));
 objects.item.forEach((liContent) => {
    const creatLi = document.createElement('li');
    creatLi.textContent = liContent;
    console.log(creatLi);
    creatLi.addEventListener("click", cartItemClickListener);
    document.querySelector('.cart__items').appendChild(creatLi);
  });
};

window.onload = () => {
  if (Storage) {
    const objects = JSON.parse(localStorage.getItem('item'));
    if (objects) load();
  };
  search("computador");
  document.querySelector(".items").addEventListener("click", (event) => {
    if (event.target.className === "item__add")
      adicionaClick(event.target.parentNode.id);
  });
};

