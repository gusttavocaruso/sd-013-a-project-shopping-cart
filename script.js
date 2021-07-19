const cartItems = '.cart__items';
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
// Requisito 4 Ajuda da bianca na monitoria
const local = () => { // Eu chamo essa função na addProductShoppingCart p/ add e na cartItemClickListener para remover
  const ol = document.querySelector(cartItems);
  const olHTML = ol.innerHTML;
  localStorage.setItem('cartList', olHTML);
  };
// Requisito 3 
// Referência https://catalin.red/removing-an-element-with-plain-javascript-remove-method/
function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.remove();
  local(); 
}
// Requisito4 Ajuda da bianca na monitoria
const getLocalStorage = () => {
  const newOl = document.querySelector(cartItems);
  newOl.innerHTML = localStorage.getItem('cartList');
  newOl.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') { // Ajuda da Lanai Conceição
      cartItemClickListener(event); 
    }
  });
};
function createCartItemElement({ id, title, price }) { // desestruturação feita. É selecionado apenas o id, title e price.
  const li = document.createElement('li'); // criação da const 'li'
  li.className = 'cart__item'; // add classe na 'li'
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`; // Isso é para pegar apenas o texto de cada elemento
  li.addEventListener('click', cartItemClickListener);
  const cartItens = document.querySelector('.cart__items'); // Criação da const referente a classe cart__items
  cartItens.appendChild(li); // li vai ser filho do cartItens
  return li;
}
// Requisito 1
const addItems = (items) => { // criar itens la no html
  items.forEach((item) => {
    const itemElement = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};
// Requisito 2  requisição para o endpoint
const addProductShoppingCart = (event) => { // Essa função é ativada quando o botão é clicado. 
  const id = event.target.parentNode.firstChild.innerText; // Essa const é criada para pegar o ID de quando é clicado no produto(vou até o pai e pego o primeiro filho)
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => { // Permissão
      response.json()
      .then((data) => { // Permissão
        createCartItemElement(data); 
        local(); // Eu vou pegar esses e mandar para essa função da linha 34.
      });
    });
};
// Requisito 2 => criação do botão. Após o clique o botão vai realizar uma requisição para a função addProductShoppingCart
const buttonItem = () => {
  const buttons = document.querySelectorAll('.item__add'); // Aqui está sendo capturado todos os botões
// Logo abaixo, foi add um forEach para que o addEventListener fosse passa por todos os botões.
  buttons.forEach((button) => button.addEventListener('click', addProductShoppingCart));
};
// Requisito 1
const productList = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)// vai até o site atrás das informações através de uma permissão
    .then((response) => { // permissão
      response.json()
      .then((data) => { // permissão
      addItems(data.results);// Resultado dos computadores
      buttonItem(); 
      });
    });
};

window.onload = () => {
  productList('computador');
  getLocalStorage();
};
