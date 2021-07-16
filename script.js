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
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const adComputer = (compItem) => {
  compItem.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

/* Fazendo a requisição da API
Link de apoio para o requisito: https://www.youtube.com/watch?v=m3K8DP4kVXQ&t=24s&ab_channel=hcode
Vídeo feito durante o fechamento pelo especialista Jackson Pires */
const fetchComputer = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
    .then((response) => response.json())
    .then((computer) => {
      adComputer(computer.results);
  });
};

window.onload = () => {
  fetchComputer();
};
