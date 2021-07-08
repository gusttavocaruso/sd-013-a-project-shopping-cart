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

// function cartItemClickListener(event) {
// }

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

async function jogarItens() {
  try {
    const itens = await getJsonFromProduct();
    itens.forEach((cadaItem) => {
      // console.log(createProductItemElement(cadaItem));
      document.querySelector('.items').appendChild(createProductItemElement(cadaItem));
    });
  } catch (err) {
    console.log(err);
  }
} 

// function createCartItemElement({
//   sku,
//   name,
//   salePrice,
// }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = () => {
  jogarItens();
};