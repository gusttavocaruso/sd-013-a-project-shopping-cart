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

const renderTotalPrice = (price) => {
  const place = document.querySelector('.total-price');
  place.innerText = price;
};

const setTotalPrice = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  const allPrices = [];
  allCartItems.forEach((current) => {
    const split = current.innerText.split(' ');
    const price = split[split.length - 1];
    allPrices.push(parseFloat(price.replace('$', '')));
  });
  renderTotalPrice(allPrices.reduce((accumulator, current) => accumulator + current, 0));
};

const cartItems = '.cart__items';

const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems); // resgatando ol
  const text = ol.innerHTML; // acessar html
  localStorage.setItem('cartList', ''); // limpando o que tinha antes
  localStorage.setItem('cartList', JSON.stringify(text)); // pegar todo o texto de dentro da variável e transforma no formato JSON // obs: localStorage.setItem('cartList', ol.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  setItemsLocalStorage();
  setTotalPrice();
}

const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); // recupera o item criado no requisito 4 // obs: recuperar ol, ol.innerHTML = localStorage.getItem('nomeDaChave')
  const ol = document.querySelector(cartItems); // pegar onde tem os itens
  ol.innerHTML = getLocalStorage; // e colocar os itens que já tinham sido salvos
  ol.addEventListener('click', (event) => { // se algum elemento da ol for clicado
    if (event.target.className === 'cart__item') { // e contiver a classe cart__item
      cartItemClickListener(event); // será apagado (usando a função do requisito 3)
    }
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then((obj) => {
      const { id: sku, title: name, price: salePrice } = obj;
      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(createCartItemElement({ sku, name, salePrice }));
      setItemsLocalStorage();
      setTotalPrice();
      });
    });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  button.addEventListener('click', () => {
    addToCart(sku);
  });

  section.appendChild(button);

  return section;
}

const addItensToSection = (items) => {
  const getLoading = document.querySelector('.loading');
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
    getLoading.remove(); // retirando a classe .loading
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

window.onload = () => {
  fetchML();
  getItemsLocalStorage();
};
