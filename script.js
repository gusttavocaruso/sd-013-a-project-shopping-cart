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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  return li;
}

const getAPI = async (item) => {
  try {
    const linkAPI = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
    ((await (await fetch(linkAPI))
      .json()).results).forEach((item2) => {
        document.querySelector('.items')
          .appendChild(createProductItemElement(item2));
      });
  } catch (error) {
    alert('Um erro ae');
  }
};

const getItem = async (item) => {
  try {
    const linkItem = `https://api.mercadolibre.com/items/${item}`;
    const retorno = await (await fetch(linkItem)).json();
    createCartItemElement(retorno);
  } catch (error) {
    alert('Outro erro ae');
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // Agradecimentos ao Matheus Duarte que me mostrou e explicou essa forma de usar o botão.
  section.lastElementChild.addEventListener('click', (event) => {
    getItem(event.target.parentElement.firstElementChild.innerText);
  });
  return section;
}

window.onload = () => {
  getAPI('computador');
};
