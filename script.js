const botaoEsvaziar = document.querySelector('button.empty-cart');
const listaDeItens = document.querySelector('ol.cart__items');

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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.carrinho = listaDeItens.innerHTML;
}

function getJsonFromProduct() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((resposta) => {
        resposta.json()
          .then((respostajson) => {
            const resultado = respostajson.results;
            resolve(resultado);
          });
      });
  });
}

function chamarFetchId(id) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((resposta) => {
        resposta.json()
          .then((respostajson) => {
            const resultado = respostajson;
            resolve(resultado);
          });
        });
      });
}

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // localStorage.carrinho = listaDeItens.innerHTML;
  // console.log(localStorage.carrinho);
  return li;
}

function enviarItem() {
  const botoes = document.querySelectorAll('.item__add');
  for (let index = 0; index < botoes.length; index += 1) {
    botoes[index].addEventListener('click', function () {
      const botaoAtual = botoes[index].parentNode.firstElementChild.innerHTML;
      chamarFetchId(botaoAtual).then((value) => {
        document.querySelector('.cart__items')
          .appendChild(createCartItemElement((value)));
          localStorage.carrinho = listaDeItens.innerHTML;
      });
    });
  }
}

const body = document.querySelector('body');

async function jogarItens() {
  try {
    const loading = document.createElement('li');
    loading.className = 'loading';
    const itens = await getJsonFromProduct();
    body.appendChild(loading);
    setTimeout(() => {
      loading.remove();
    }, 500);
    itens.forEach((cadaItem) => {
      document.querySelector('.items').appendChild(createProductItemElement(cadaItem));
    });
    enviarItem();
  } catch (err) {
    console.log(err);
  }
}

jogarItens();

function apagarItens() {
  listaDeItens.innerHTML = '';
  localStorage.clear();
}

botaoEsvaziar.addEventListener('click', apagarItens);

if (localStorage.carrinho) {
  listaDeItens.innerHTML = localStorage.carrinho;
  console.log(localStorage.carrinho);
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

window.onload = () => {

};