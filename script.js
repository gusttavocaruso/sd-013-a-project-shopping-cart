// =========== localstorage
function saveLocalStorage() {
  const arrayDeposito = []; 
  const acessaLis = document.querySelectorAll('.cart__item');
  if (acessaLis !== null && acessaLis.length > 0) {
  acessaLis.forEach((li) => {
    arrayDeposito.push(li.innerText);
  });
  console.log(arrayDeposito);
   localStorage.setItem('itemCarr', JSON.stringify(arrayDeposito));
  }
}
  saveLocalStorage();
// ======== função resolve problema
function acessaOls() {
  return document.querySelector('.cart__items');
}

function loadLocalStorage() {
const recupered = JSON.parse(localStorage.getItem('itemCarr'));
console.log(recupered);
if (recupered !== null && recupered.length > 0) {
  recupered.forEach((item) => {
    const criaLi = document.createElement('li');
    criaLi.innerText = item;
    acessaOls().appendChild(criaLi);
  });
}
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.remove();
  saveLocalStorage();
}

function createCartItemElement(result) {
  fetch(`https://api.mercadolibre.com/items/${result}`)
      .then((response) => response.json())
      .then((ObjResult) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${ObjResult.id} | NAME: ${ObjResult.title} | PRICE: $${ObjResult.price}`;
  acessaOls().appendChild(li);
  li.addEventListener('click', (event) => { 
  cartItemClickListener(event.target);
});
saveLocalStorage();
  return li;
});
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
const b = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  b.addEventListener('click', function (event) {
    const itemAdd = event.target.parentNode.firstChild.innerText;
    createCartItemElement(itemAdd);
  });
const sectionCriada = document.querySelector('.items');
sectionCriada.appendChild(section);
  return section;
  }

function promessa(event) {
  new Promise((resolve, reject) => {
    if (event !== 'computador') {
      reject();
    } else {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${event}`)
      .then((resolv) => resolv.json())
      .then((result) => resolve(result.results));
    }
  })
  .then((result) => {
    for (let index = 0; index < result.length; index += 1) {
      createProductItemElement(result[index]);
    }
  })
  .catch((erro) => console.log(erro));
}

// ========== questão 06
window.addEventListener('load', function () {
const acessaButton = document.querySelector('.empty-cart');
const acessaPaiCarrinho = document.querySelector('.cart__items');
acessaButton.addEventListener('click', function () {
  acessaPaiCarrinho.innerText = '';
});
});

// ========== questão 05
function calculaPgto() {

}
/*  // acesso a section 
 const sectionPreco = document.querySelector('.cart');
 const criaSaldoFinal = document.createElement('p');
 criaSaldoFinal.innerText = /* functiomn.... */
 /* sectionPreco.appendChild(criaSaldoFinal); */
 /* */ 
function loading() {
  const body = document.querySelector('body');
  body.appendChild(createCustomElement('h1', 'loading', 'loading'));
}

function endLoading() {
  const body = document.querySelector('body');
  const h1 = document.querySelector('.loading');
  body.removeChild(h1);
}

function pro() {
  endLoading();
  promessa('computador');
}

window.onload = async () => {
  await loading();
  await setTimeout(pro, 3000);
  loadLocalStorage();
 };
