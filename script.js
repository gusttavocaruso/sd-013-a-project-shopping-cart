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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json()
  .then((data) => data.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    const card = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const items = document.querySelector('.items');
    items.appendChild(card);
  })));

const getProduct = (query) => fetch(`https://api.mercadolibre.com/items/${query}
`)
  .then((response) => response.json()
  .then((data) => console.log(data)));

const itemAdd = async () => {
  try {
    await getProducts('computador');
    const product = document.querySelectorAll('.items');
    console.log(product);
    product.forEach((button, index) => {
      button.addEventListener('click', () => {
        const sections = document.querySelectorAll('.item');
        const idSection = sections[index].firstChild.innerText;
        console.log(getProduct(idSection));
      });
    });
  } catch (error) {
    alert(`Erro ao adicionar produto ao carrinho: ${error}`);
  }
};

window.onload = () => {
  itemAdd();
};
