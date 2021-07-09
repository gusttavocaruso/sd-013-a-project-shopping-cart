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

}

function createCartItemElement(result) {
  fetch(`https://api.mercadolibre.com/items/${result}`)
      .then((response) => response.json())
      .then((ObjResult) => {
        console.log(ObjResult);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${ObjResult.id} | NAME: ${ObjResult.title} | PRICE: $${ObjResult.price}`;
  // acesso a ol, que é pai das li
  const cart = document.querySelector('.cart__items');
  // adciono a li criada a Ol
  cart.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

window.onload = () => {
  promessa('computador');
 };

/*  window.addEventListener('load', function () {
  const paiButton = document.querySelector('.items');
  paiButton.addEventListener('click', function(event) { 
  console.log('eai');
  });
}); */