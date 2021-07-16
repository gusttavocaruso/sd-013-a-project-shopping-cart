function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.id = sku;
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumProducts = (sum) => {
  const searchTotalPrice = document.querySelector('.total-price');
  if (searchTotalPrice) searchTotalPrice.remove();
  const section = document.createElement('section');
  section.className = 'total-price';
  document.querySelector('.cart').appendChild(section);
  const h4 = document.createElement('h4');
  h4.textContent = `${sum}`;
  document.querySelector('.total-price').appendChild(h4);
};

const totalPrice = () => {
  let i = 0;
  let concatenation = '';
  let sum = 0;
  document.querySelectorAll('li').forEach((li) => {
    i = li.textContent.indexOf('$') + 1;
    for (i; i < li.textContent.length; i += 1) {
      concatenation += li.textContent[i];
    }
    sum += Number(concatenation);
    concatenation = '';
  });
  sumProducts(sum);
};

const deleteItem = (item) => {
  const products = document.querySelectorAll('li');
  const newObject = { items: [] };
  products.forEach((product) => {
    if (product.id !== item) newObject.items.push(product.textContent);
  });
  localStorage.setItem('items', JSON.stringify(newObject.items));
};

function cartItemClickListener(event) {
  deleteItem(event.target.id);
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = document.querySelectorAll('.cart__item').length;
  return li;
}

const results = (items) => {
  items.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

const status = (control) => {
  let returnFalse;
  const searchP = document.querySelector('.loading');
  if ((!searchP) && (control === true)) {
    const h1 = document.createElement('h1');
    h1.classList = 'loading';
    h1.textContent = 'loading';
    document.querySelector('.items').appendChild(h1);
    setTimeout(() => {
      returnFalse = false;
    }, 3000);
    return returnFalse;
  }
};

const searches = (query) => {
  status(true);
  setTimeout(() => {
    document.querySelector('.loading').remove();
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((jsonBody) => {
        results(jsonBody.results);
    });
  }, 600);
};

const saveCar = () => {
  const list = { items: [] };
  document.querySelectorAll('li').forEach((item) => {
    list.items.push(item.textContent);
  });
  localStorage.setItem('items', JSON.stringify(list));
};

const addList = (e) => {
  fetch(`https://api.mercadolibre.com/items/${e.target.parentNode.id}`)
    .then((response) => response.json())
    .then((data) => {
      const newProduct = createCartItemElement(data);
      document.querySelector('.cart__items').appendChild(newProduct);
      saveCar();
      totalPrice();
    });
};

const loadLocalStorage = () => {
  const object = JSON.parse(localStorage.getItem('items'));
  object.items.forEach((li, i) => {
    const newLi = document.createElement('li');
    newLi.textContent = Object.values(object)[0][i];
    newLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(newLi);
  });
};

const clearList = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
};

const addProducts = () => {
  document.querySelector('.items').addEventListener('click', (e) => {
    if (e.target.className === 'item__add') addList(e);
  });
};

window.onload = () => {
  if (Storage) {
    const object = JSON.parse(localStorage.getItem('items'));
    if ((object) && (Object.values(object).length > 0)) loadLocalStorage();
  }
  searches('computador');
  addProducts();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
  totalPrice();
};
