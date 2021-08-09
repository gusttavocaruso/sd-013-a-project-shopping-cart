function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, meuId) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.setAttribute('id', meuId);
  }

  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (ItemID) => {
    console.log(ItemID);
    fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((response) => {
        response.json().then((data) => {
            const productElement = createCartItemElement(data);
            const cart = document.querySelector('.cart__items');
            cart.appendChild(productElement);
        });
    });
};

const addEventbuttons = () => {
    const buttons = document.getElementsByClassName('item__add');
    const arrayButtons = Array.from(buttons);
    
    arrayButtons.forEach((button) => {
        // console.log(button);
        if (button === arrayButtons[arrayButtons.length - 1]) {
            button.addEventListener('click', () => {
                addToCart(button.id);
            });
        }
    });
};

const addProductToSection = (products) => {
    products.forEach((product) => {
        const productElement = createProductItemElement(product);
        const section = document.querySelector('.items');
        section.appendChild(productElement);
        addEventbuttons();
    });
};

/* ToDo
    inverter a ordem das funções
*/
const fetchMercadoLivre = (query) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
        response.json().then((data) => {
            addProductToSection(data.results);
        });
    });
};

window.onload = () => { 
    fetchMercadoLivre('computador');
    // addEventbuttons();
};
