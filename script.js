// Projeto realizado com ajuda de alguns colegas, estive tendo muita dificuldade.
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
  // .addEventListener('click', addCar);
  
  return section;
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

// const save = () => {
//   const carrin = document.querySelectorAll('.cart__item');
//   localStorage.setItem('objeto', carrin.innerHTML);
// }

// const carrinhoCheio = () => {
//   const carrinho = localStorage.getItem('objeto');
//   document.querySelector('.cart__items').innerHTML = carrinho;
// };

  const save = () => {
    const carrin = document.querySelectorAll('.cart__item');
    localStorage.clear();
    for (let i = 0; i < carrin.length; i += 1) {
      localStorage.setItem(`objeto${[i]}`, carrin[i].textContent);
    }
  };
  
  const carrinhoCheio = () => {
    const retorna = document.querySelector('.cart__items');
    for (let i = 0; i < localStorage.length; i += 1) {
      const getLocal = localStorage.getItem(`objeto${[i]}`);
      retorna.appendChild(createCartItemElement({ id: undefined }, getLocal));
  }
};

// requisito 3

function cartItemClickListener(event) {
  event.target.remove();
  save();
};

// 

function createCartItemElement({ id: sku, title: name, price: salePrice }, getLocal) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  if (sku) li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  if(!sku) li.innerText = getLocal;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  requisito 2

const lista = async (id) => {
  const objetos = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objeto = await objetos.json();
  const item = document.querySelector('.cart__items');
  item.appendChild(createCartItemElement(objeto));
  save();
};

const pc = (func) => {
  const buttons = document.querySelectorAll('.item__add');
  const itemId = document.querySelectorAll('.item__sku');
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
      func(itemId[i].innerText);
  });
  });
};

// requisito 1

  const r1 = async (produto) => {
  const computers = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`);
  const computer = await computers.json();
  computer.results.forEach((element) => {
    const setcomputer = document.querySelector('.items');
    setcomputer.appendChild(createProductItemElement(element));
  });
  pc(lista);
};

window.onload = () => {
  r1('computador');
  carrinhoCheio();
};