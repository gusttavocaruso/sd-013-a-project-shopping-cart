/* const TESTreturnfetch = (sku) => {
   return fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((data) => console.log (data.json()))
  .then((dado) => console.log(dado.attributes));
  //.then(() => console.log(title));
  //.then(({id}) => console.log(data))//.forEach((element) => createProductItemElement(element)))
  }; */

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

const returnfetch = (query) =>
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
.then((response) => response.json())
.then((data) => data.results.forEach((element) => createProductItemElement(element)));
// resolve o requisito 3 remove o alvo clicado
function cartItemClickListener(event) {
  event.target.remove();
}
// resolve o requisito 2 onde li é colocado como filho da class cart items
// e desestrutura algumas chaves do paramentro 
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; 
  li.addEventListener('click', cartItemClickListener);
  const olLista = document.querySelector('.cart__items');
  olLista.appendChild(li);
  return li;
}

function realizarRequis(itemId) {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => {
      response.json().then((data) => {
      createCartItemElement(data); 
      // vira o objeto que é trabalhado na linha 46 
      });
    });
}
// pega o id que vai ser usado na fetch da funçao realizarRequis
const addCar = (click) => {
  if (click.target.classList.contains('item__add')) {
    const id = ((click.target).parentNode.firstChild).innerText;
    realizarRequis(id);
  }
};

function getSkuFromProductItem(item) {
  const sku = item.querySelector('span.item__sku').innerText;
  realizarRequis(sku);
 }
// adiciona o eventlistenner a todos os botoes que tem a classe item__add que estao dentro da classe .item
 function productItemClickListener() {
  const products = document.querySelectorAll('.item');
  products.forEach((product) => product.querySelector('button.item__add')
    .addEventListener('click', getSkuFromProductItem));
}

function eventos() {
  document.addEventListener('click', addCar);
}

window.onload = () => { 
  returnfetch('computador');
  eventos();
  // createCartItemElement(); 
  // TESTreturnfetch("MLB1341706310");
  // createCartItemElement();
  // realizarRequis();
  // cartItemClickListener();
};
