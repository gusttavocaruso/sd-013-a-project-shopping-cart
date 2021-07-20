const items = document.querySelector('.items');

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
// Requisito 1 
const addItems = (pc) => {
  pc.forEach((elements) => {
    const item = createProductItemElement(elements);
    items.appendChild(item);
  });
};
// pega a api 
const getItemsPromises = async (item) => {
  try {
    const getItem = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
    const product = await getItem.json();
    const result = product.results;
    addItems(result);
  } catch (error) {
      alert(error);
  }
};

const getFetch = async () => {
  await getItemsPromises('computador');
};
  
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ id: sku, title: name, price: salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = () => { 
  getFetch();  
};
