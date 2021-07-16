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

const createTotal = (sum) => {
  const searchSection = document.querySelector('.total-price');
  if (searchSection) searchSection.remove();
  const section = document.createElement('section');
  section.className = 'total-price';
  const h3 = document.createElement('h3');
  h3.className = 'h3';
  h3.textContent = `${sum}`;
  document.querySelector('.cart').appendChild(section);
  document.querySelector('.total-price').appendChild(h3);
};

const priceSum = () => {
  let sum = 0;
  let position = '';
  let concatenar = '';
  document.querySelectorAll('li').forEach((li) => {
    position = li.textContent.indexOf('$') + 1;
    for (position; position < li.textContent.length; position += 1) {
      concatenar += li.textContent[position];
    }
    concatenar = Number(concatenar).toFixed(2);
    sum += Number(concatenar);
    concatenar = '';
  });
  createTotal(sum);
};

const deletar = (idItem) => {
  const produtos = document.querySelectorAll('li');
  const newObjeto = { item: [] };
  produtos.forEach((produto) => {
    if (produto.id !== idItem) newObjeto.item.push(produto.textContent);
  });
  localStorage.setItem('item', JSON.stringify(newObjeto));
};

function cartItemClickListener(event) {
  event.target.remove();
  deletar(event.target.id);
  priceSum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = document.querySelectorAll('.cart__item').length;
  return li;
}

const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

const save = () => {
  const lista = { item: [] };
  document.querySelectorAll('.cart__item').forEach((li) => {
    lista.item.push(li.textContent);
  });
  localStorage.setItem('item', JSON.stringify(lista));
};

const addClick = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json().then((data) => {
        const novoProduto = createCartItemElement(data);
        console.log(data);
        document.querySelector('.cart__items').appendChild(novoProduto);
        save();
        priceSum();
      });
    });
};

const load = () => {
  const object = JSON.parse(localStorage.getItem('item'));
  object.item.forEach((liContent) => {
    const creatLi = document.createElement('li');
    creatLi.textContent = liContent;
    creatLi.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(creatLi);
  });
};
const clearList = () => {
  document.querySelectorAll('li').forEach((li) => li.remove());
  localStorage.clear();
};

const haha = () => {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.className === 'item__add') addClick(event.target.parentNode.id);
  });
};

window.onload = () => {
  if (Storage) {
    const object = JSON.parse(localStorage.getItem('item'));
    if (object && Object.values(object).length > 0) load();
  }
  haha();
  fetchML('computador');
  document.querySelector('.empty-cart').addEventListener('click', clearList);
  priceSum();
};