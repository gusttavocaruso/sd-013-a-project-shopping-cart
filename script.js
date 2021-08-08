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

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (ItemID) => {
  try {
    const merliv = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
    const jsonFiltrado = await merliv.json();
    const result = createCartItemElement(jsonFiltrado);
    document.querySelector('.cart__items').appendChild(result);
  } catch (error) {
    console.log(error);
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', () => fetchItem(sku));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const fetchProducts = async (QUERY = 'computador') => {
  try {
    const merliv = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
    const jsonFiltrado = (await merliv.json()).results;
    jsonFiltrado.forEach((item) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(item));
    });
  } catch (error) {
    alert(error);
  }
};

window.onload = () => {
  fetchProducts();
};
