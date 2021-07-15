/* const TESTreturnfetch = (sku) => {
   return fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((data) => console.log (data.json()))
  .then((dado) => console.log(dado.attributes));
  //.then(() => console.log(title));
  //.then(({id}) => console.log(data))//.forEach((element) => createProductItemElement(element)))
  }; */
  const carri = '.cart__items';

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
  const sectionItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';  

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return sectionItems.appendChild(section);
}

const returnfetch = async (query) => {
 const rFetch = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
const mercadJson = await rFetch.json();
mercadJson.results.forEach((element) => createProductItemElement(element));
};
// resolve o requisito 3 remove o alvo clicado

// resolve o requisito 2 onde li é colocado como filho da class cart items
// e desestrutura algumas chaves do paramentro 
// 2a

// 2b

// pega o id que vai ser usado na fetch da funçao realizarRequis
//

function salvaLocalSto() {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', JSON.stringify(cart.innerHTML));
}

function apagarCarrinho() {
const botao = document.querySelector('.empty-cart');
botao.addEventListener('click', () => {
  const ol = document.querySelector('ol.cart__items');
  ol.innerHTML = '';
  salvaLocalSto();
});
}

function cartItemClickListener(event) {
  event.target.remove();
  salvaLocalSto();
}

function carrinhoClient() {
  const item1 = document.querySelector(carri);
  
  const filhosOl = localStorage.getItem('cart');
  const filhao = JSON.parse(filhosOl);
  item1.innerHTML = filhao;
  item1.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; 
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}

const realizarRequis = async (itemId) => {
  // const cart = document.querySelector('ol.cart__items');
  const olLista = document.querySelector(carri);
  const mlbAPI = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const ApJson = await mlbAPI.json();
        olLista.appendChild(createCartItemElement(ApJson)); 
        salvaLocalSto();
};
      
const getSkuFromProductItem = (click) => {
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    realizarRequis(id);
  }
};

/* function productItemClickListener() {
  const botaos = document.querySelectorAll('button.item__add')
  .forEach((buton) => buton.addEventListener('click', getSkuFromProductItem));
} */

function eventos() {
  // productItemClickListener();
  document.addEventListener('click', getSkuFromProductItem);
}

window.onload = () => { 
  returnfetch('computador');
  eventos();
  carrinhoClient();
  apagarCarrinho();
  // createCartItemElement(); 
  // TESTreturnfetch("MLB1341706310");
  // createCartItemElement();
  // realizarRequis();
  // cartItemClickListener();
};
