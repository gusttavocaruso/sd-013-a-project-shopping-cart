const olMain = document.querySelector('.cart__items');
const esvaziar = document.querySelector('.empty-cart');
const somaPrice = document.querySelector('.total-price');

const teste = async () => {
  const sil = document.querySelectorAll('.cart__item');
  let aculador = 0;
  if (sil.length === 0) {
    somaPrice.innerHTML = 0;
    const z = somaPrice.innerHTML;
    localStorage.setItem('preco', z);
  }
  sil.forEach((itemNaLi) => {
    const a = itemNaLi.innerHTML;
    const t = parseFloat(a.substring(a.indexOf('$') + 1)); // indexOf pega a posição do $ + 1 para ser o porximo caractere após o $
    aculador += t;  
    somaPrice.innerHTML = Math.round(aculador * 100) / 100;
    const z = somaPrice.innerHTML;
    localStorage.setItem('preco', z);
  });
};
// console.log(teste());

function salvaLocal() {
  const x = olMain.innerHTML;
  localStorage.setItem('key', x);
  teste();
}

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove(event);
  salvaLocal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  olMain.appendChild(li);
  salvaLocal();
  return li;
}
function addItemNaLi(id) { // fazendo requisição do item selecionado.
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => createCartItemElement(data));
  }

function recuperaId() {
  const botaoAddCarinho = document.querySelectorAll('.item__add');
  const item = document.querySelectorAll('.item__sku');
  botaoAddCarinho.forEach((botao, index) => {
    botao.addEventListener('click', () => {
       addItemNaLi(item[index].innerText);
         // usado para dar target no id que está no innerText de item__sku
    });
  });
}

function selecioOsObjetos(objetos) {
  const sectionItems = document.querySelector('.items');
  objetos.forEach((objeto) => {
    sectionItems.appendChild(createProductItemElement(objeto));
  });
  recuperaId();
}

function buscaNaApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => selecioOsObjetos(data.results));
}
function carregarLocal() {
  const x = localStorage.getItem('key');
  olMain.innerHTML = x;
  const z = localStorage.getItem('preco');
  somaPrice.innerHTML = z;
  const li = document.querySelectorAll('.cart__item');
  li.forEach((cartItem) => {
    cartItem.addEventListener('click', cartItemClickListener);
  });
}

esvaziar.addEventListener('click', () => {
  olMain.innerHTML = ''; // zerando o html da olMain aprendido na aula Casa de Câmbio
  salvaLocal();
});

window.onload = () => {
  buscaNaApi();
  carregarLocal();
};
