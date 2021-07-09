// const fetch = require('node-fetch');

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

// Função que pega API

const ComputersonApi = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const Obj = await api.json();
  const arrayResult = Obj.results;
  arrayResult.forEach((computer) => document.querySelector('.items')
  .appendChild(createProductItemElement(computer)));
};

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();// removemos o item
 }

// Requisito 2
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;// get sku pega o texto/id  "MLB1341706310"
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {// colocando os nomes como está na api 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // essa função é responsável por deixar os dados do pc com id, nome e preço
  li.addEventListener('click', cartItemClickListener); // chama a função que remove o item do carrinho
  return li;
}
  const getComputertoCart = async (id) => {
    const apiOnePc = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const apiJson = await apiOnePc.json();
    return apiJson;
  };
  
  const buttonAddCart = () => {
    const section = document.querySelector('.items');// Colocou para a seção toda ouvir o evento, ou seja os 50 computadores
    section.addEventListener('click', async (event) => {
      if (event.target.className === 'item__add') { // se o evento de click for no botao adicionar ao carrinho 
        const ParentButton = event.target.parentElement;// acessar a section item, que é pai do botao adicionar ao carrinho
        const buttonId = getSkuFromProductItem(ParentButton);// jogar esse item na função getsku que me retorna um id
        const buttonData = await getComputertoCart(buttonId);// joga o id na função getComputertoCart pega os dados de um pc na api através desse id
        const createComputer = createCartItemElement(buttonData);// coloca os dados do pc nessa função
        document.querySelector('.cart__items').appendChild(createComputer);// na aba do carrinho de compras coloca os dados do único pc no formato id, nome, preço 
      }
    });
  };

window.onload = () => {
ComputersonApi();
buttonAddCart();
 };
