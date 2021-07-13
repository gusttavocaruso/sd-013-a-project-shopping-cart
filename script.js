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
//  return item.querySelector('span.item__sku').innerText;
// }

const savePage = () => {
  localStorage.setItem('cartList', document.getElementsByClassName('cart__items')[0].innerText);
};

const totalPrice = () => {
 let salePrice = 0;
 const getPrice = document.querySelectorAll('.cart__item');
 const precoTotal = document.querySelector('.total-price');
 getPrice.forEach((preco) => {
   const removePrice = preco.innerText.split('$');
   salePrice += Number(removePrice[1]);
 });
  precoTotal.innerHTML = `${Math.round(salePrice * 100) / 100}`;
};

 function cartItemClickListener(event) {
  const elementoClicado = event.target;
  const ol = document.getElementsByClassName('cart__items');
  ol[0].removeChild(elementoClicado);
  totalPrice();
  savePage();
 }

const addItems = (produtos) => {
  produtos.forEach((produto) => {
    const section = document.querySelector('.items');
    const items = createProductItemElement(produto);
    section.appendChild(items);
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li'); 
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
 }

const fetchComputerId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json().then((dataId) => {
      const ol = document.querySelector('.cart__items');
      const produtos = createCartItemElement(dataId);
      ol.appendChild(produtos);
      totalPrice();
      savePage();
    });
  });
};

const clearCart = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  const preco = document.querySelector('.total-price');
  buttonEmpty.addEventListener('click', () => {
    cartItems.innerHTML = '';
    preco.innerHTML = 0;
    savePage();
  });
};

function addCart(event) {
  const elementoClicado = event.target;
  fetchComputerId(elementoClicado.parentNode.firstChild.innerHTML);
  totalPrice();
  savePage();
}

const fetchComputerML = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => {
    response.json().then((data) => {
      addItems(data.results);
      const buttonAdd = document.querySelectorAll('.item__add');
      buttonAdd.forEach((button) => {
        button.addEventListener('click', addCart);
      });
    });
  });
};

const loadPage = () => {
  let lists = 0;
  const arrayId = [];
  if (localStorage.getItem('cartList')) {
    lists = localStorage.getItem('cartList').split(/[\s,]+/);
    lists.forEach((list) => {
      if (list.startsWith('MLB')) {
        arrayId.push(list);
      }
    });
  }
  if (arrayId.length > 0) {
    arrayId.forEach((id) => {
      fetchComputerId(id);
    });
  }
};

window.onload = () => { 
  fetchComputerML();
  clearCart();
  totalPrice();
  loadPage();
};