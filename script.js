const carShop = document.querySelector('.cart__items');
// const priceOfPay = document.querySelector('.total-price');

const saveLs = () => {
  localStorage.setItem('Produto', carShop.innerHTML);
  // localStorage.setItem('Ṕrice', priceOfPay.innerHTML);
};

const catchCarShop = () => {
  carShop.innerHTML = localStorage.getItem('Produto');
  // priceOfPay.innerHTML = localStorage.getItem('Price');
};

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

// requisito 3
function cartItemClickListener(event) {
  const evento = event.target;
  evento.remove();
  saveLs();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // requisito 3, evento pra remover um item criado
 
  const getOl = document.querySelector('.cart__items');
  getOl.appendChild(li);
  saveLs();
}

// const totalPrice = () => {

// }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// requisito 2
const addcart = (event) => {
  const sectionItem = event.target.parentNode;
  const id = getSkuFromProductItem(sectionItem);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => createCartItemElement(data))
    .catch((error) => {
      alert(error.message);
   });
};

const buttonEmptyCar = document.querySelector('.empty-cart');

const emptyCar = () => {
  carShop.innerHTML = '';
  saveLs();
};

buttonEmptyCar.addEventListener('click', emptyCar);

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addcart); // alocado evento dentro do create product

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  
  return section;
}

const loadingId = document.querySelector('.loading');
const itemsSection = document.querySelector('.items');

const fetchProdutos = (query) => {
  // Conecta na API e busca o item query
  // Posiciona o elemento dentro do .items (que é o noome do grupo onde vai estar todos itens)
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`) // chama a API
    .then((response) => response.json())
    .then((produtos) => {
      produtos.results.forEach((item) => {
        itemsSection.appendChild(createProductItemElement(item));
      });
      loadingId.remove(); // requisito 07
    });
};

const getProdutos = async () => {
  // requisito 01
  try {
    await fetchProdutos('computador'); // Conjunto de itens a procurar
  } catch (error) {
    alert('Ocorreu um erro ao buscar o produto');
  }
};

catchCarShop();
getProdutos();
