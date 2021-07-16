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

const addTotal = (sum) => {
  const searchS = document.querySelector('.total-price');
  if (searchS) searchS.remove();
  const section = document.createElement('section');
  section.className = 'total-price';
  const h3 = document.createElement('h3');
  h3.className = 'h3';
  h3.textContent = `${sum}`;
  document.querySelector('.cart').appendChild(section);
  document.querySelector('.total-price').appendChild(h3);
};

const operationSum = () => {
  let sum = 0;
  let position = ''; 
  let concat = '';
  document.querySelectorAll('li').forEach((li) => {
    position = li.textContent.indexOf('$') + 1;
    for (position; position < li.textContent.length; position += 1) {
      concat += li.textContent[position];
    }
    concat = Number(concat).toFixed(2);
    sum += Number(concat);
    concat = '';
  });
  addTotal(sum);
};

const deletFromStorage = (idItem) => {
  const lists = document.querySelectorAll('li');
  const newObject = { item: [] };
  lists.forEach((list) => {
    if (idItem !== list.id) newObject.item.push(list.textContent);
  });
  localStorage.setItem('item', JSON.stringify(newObject.item));
};

function cartItemClickListener(event) {
  event.target.remove();
  deletFromStorage(event.target.id);
  operationSum();
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

const loadingApi = () => {
  const h1 = document.createElement('h1');
  h1.className = 'loading';
  h1.textContent = 'loading';
  document.querySelector('.items').appendChild(h1);
};

const search = (query) => {
  loadingApi();
  setTimeout(() => {
    document.querySelector('.loading').remove();
    const tests = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((body) => {
      results(body.results);
    });
  }, 3000);
};

const saveContent = () => {
  const list = { item: [] };
  document.querySelectorAll('li').forEach((listItem) => {
    list.item.push(listItem.textContent);
  });
  localStorage.setItem('item', JSON.stringify(list));
};

const adicionaClick = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then((data) => {
      const newProduct = createCartItemElement(data);
      document.querySelector('.cart__items').appendChild(newProduct);
      saveContent();
      operationSum();
    });
  });
};

const load = () => {
  const objects = JSON.parse(localStorage.getItem('item'));
  objects.item.forEach((liContent) => {
    const creatLi = document.createElement('li');
    creatLi.textContent = liContent;
    creatLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(creatLi);
  });
};

const cleanAll = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
  operationSum();
};

const saveItemsOnLoad = () => {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.className === 'item__add') { 
      adicionaClick(event.target.parentNode.id);
    }
  });
};

window.onload = () => {
  operationSum();
  if (Storage) {
    const objects = JSON.parse(localStorage.getItem('item'));
    if (objects && Object.values(objects).length > 0) load();
  }
  search('computador');
  saveItemsOnLoad();
  document.querySelector('.empty-cart').addEventListener('click', cleanAll);
  operationSum();
};
