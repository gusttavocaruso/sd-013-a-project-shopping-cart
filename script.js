// Requisitos 4 a 7 desenvolvidos com ajuda da Aline Hoshino

const ol = document.querySelector('.cart__items');

// REQUISITO 5: ======================================================

const totalPrice = () => {
  const spanOfTotalPrice = document.querySelector('.total-price');

  let price = 0;

  const allComputerLis = document.querySelectorAll('.cart__item'); // chama as lis pela classe

  allComputerLis.forEach((commputerLi) => {
    const textOfComputerLi = commputerLi.innerText;// pega o texto da li do computador
    const arrayOfStrings = textOfComputerLi.split('$');// posição 0 - é tudo que vem antes do cifrão que é isso aqui ---> SKU: MLB1218701240 | NAME: Computador Pc Completo Intel 8gb Hd 500gb Monitor 18 Wind 10 | PRICE:, posição 1: 1269(preço)

    price += Number(arrayOfStrings[1]);// só o price do arrayOfStrings
  });
  spanOfTotalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`;// arredonda o preço (os centavos) 
};

// REQUISITO 4: ======================================================

// Função que SALVA os produtos da ol no Local Storage:
const saveToLocalStorage = () => {
  const olInnerHTML = ol.innerHTML; // pega todas as lis que tem dentro da ol
  localStorage.setItem('cartProducts', ''); // localStorage.setItem('CHAVE'*, 'VALOR'*); // feito por padrão, não necessário
  localStorage.setItem('cartProducts', JSON.stringify(olInnerHTML)); // O local storage só aceita string
};

function cartItemClickListener(event) {
  event.target.remove(); // (REQUISITO 3)
  totalPrice(); // soma os preços dos computadores restantes
  saveToLocalStorage(); // salva as lis que restaram, ou seja, atualiza a parada
}

// Função que RESGATA os produtos salvos no Local Storage:
const retrieveLocalStorage = () => {
  const retrieveStorage = JSON.parse(localStorage.getItem('cartProducts'));// chama de volta o item e transforma com o parse o que ele era antes (ex: era objeto e virou string, dae volta a ser objeto)

  ol.innerHTML = retrieveStorage;

  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') { // se evento for no filho- li 
      cartItemClickListener(event); // chama o evento de remover as lis , porque ao recuperar precisa poder clicar e apagar de novo as lis.
    }
  });
};

// REQUISITO 2: ======================================================

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const appendItem = ($ItemID) => {
  fetch(`https://api.mercadolibre.com/items/${$ItemID}`)
    .then((response) => {
      response.json().then((data) => {
        ol.appendChild(createCartItemElement(data));
        saveToLocalStorage(); // salva as lis atuais (incluindo a que acabou de ser adicionada), ou seja, atualiza a parada
        totalPrice();
      });
    });
};

const getProductId = (event) => {
  const getId = getSkuFromProductItem(event.target.parentNode); // para pegar o id    
  appendItem(getId);
};

const addToCart = () => {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => {
    button.addEventListener('click', (getProductId));
  });
};

// REQUISITO 1: ======================================================

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

const addItemsToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); // item === produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
    addToCart();
  });
};

const fetchML = (query) => {
  const loading = document.querySelector('.loading'); // (REQUISITO 7)

  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { //  response traz todas as informações
      response.json().then((data) => {
        console.log(data.results);
        addItemsToSection(data.results);
        loading.remove(); // (REQUISITO 7)
      });
    });
};

// REQUISITO 6: ======================================================

const eraseAll = () => {
  ol.innerHTML = '';
  const spanOfTotalPrice = document.querySelector('.total-price');
  spanOfTotalPrice.innerText = 0.00;
  saveToLocalStorage();
};

const emptyCart = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', eraseAll);
};

// ======================================================

window.onload = () => {
  fetchML('computador');
  retrieveLocalStorage();
  totalPrice();
  emptyCart();
};
