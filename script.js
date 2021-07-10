// const fetch = require('node-fetch');
const cart = '.cart__items';// como sempre vai chamar .cart__items(representa a ol)

function TotalPrice() {
  const span = document.querySelector('.total-price');
  let price = 0;
  const allLi = document.querySelectorAll('li');
  allLi.forEach((item) => {
    const computer = item.innerText.split('$');// posição 0- é tudo que vem antes do cifrão
    price += Number(computer[1]);// só o price
    span.innerHTML = `${(Math.round((price * 100)) / 100)}`;
});
}

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // colocar o item da api aqui 
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// requisito 4
const addLocalStorage = () => { // só salva no local storage , chama a funcao para pegar o item salvo na linha 63
  const ol = document.querySelector(cart);
  const textList = ol.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(textList));// local storage só aceita string
};
// Função que pega os 50 pcs da API Requisito 1
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
  TotalPrice();// ao remover chame o total price para ele somar de novo pc por pc.
  addLocalStorage();// add ao local storage 
 }

 const getLocalStorage = () => {
  const getStorage = JSON.parse(localStorage.getItem('cartList'));// chama de volta o item e transforma com o parse o que ele era antes. exe: era objeto virou string volta a ser objeto
  const ol = document.querySelector(cart);
  ol.innerHTML = getStorage;
  ol.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') { // evento for no filho- li 
      cartItemClickListener(event);// chama o evento de remover as li , porque ao recuperar precisa poder clicar e apagar de novo as li.
    }
  });
};

// Requisito 2
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;//  pega o elemento com a classe item get sku pega o texto/id  "MLB1341706310"
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // colocando os nomes como está na api 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // essa função é responsável por deixar os dados do pc com id, nome e preço
  li.addEventListener('click', cartItemClickListener); // chama a função que remove o item do carrinho
  return li;
}
  const getComputertoCart = async (id) => { // ao pegar o id da função sku, chamamos a api
    const apiOnePc = await fetch(`https://api.mercadolibre.com/items/${id}`); // só pega a id de um pc
    const apiJson = await apiOnePc.json();
    return apiJson;
  };
  
  const buttonAddCart = () => {
    const section = document.querySelector('.items'); // Colocou para a seção ou seja os 50 computadores
    section.addEventListener('click', async (event) => {
      if (event.target.className === 'item__add') { // se o evento de click for no botao adicionar ao carrinho 
        const ParentButton = event.target.parentElement;// acessar a section item, que é pai do botao adicionar ao carrinho
        const buttonId = getSkuFromProductItem(ParentButton);// jogar esse item na função getsku que me retorna um id
        const buttonData = await getComputertoCart(buttonId);// joga o id na função getComputertoCart pega os dados de um pc na api através desse id
        const createComputer = createCartItemElement(buttonData);// coloca os dados do pc nessa função
        document.querySelector(cart).appendChild(createComputer);// na aba do carrinho de compras coloca os dados do único pc no formato id, nome, preço 
        addLocalStorage();// salva os itens
        TotalPrice();// chama o preço para já ir atualizando
      }
    });
  };

// const buttonRemoveAll = () => {
//   const getButtonRemoveAll = document.querySelector('.empty-cart');
//   getButtonRemoveAll.addEventListener('click', () => {
//   const ol = document.querySelector(cartItems);
//   while (ol.firstChild) {
//   ol.removeChild(ol.firstChild);
//   TotalPrice();
//   setItemsLocalStorage();
//   }
//   });
//   }; 

window.onload = () => {
ComputersonApi();
buttonAddCart();
getLocalStorage();
TotalPrice();
};
