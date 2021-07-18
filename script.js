// A maior parte do código foi feita com a ajuda de Júlia, Luiza, Carol, Lanai, Pedro, Juliane. 
// const fetch = require('node-fetch');
const cart = '.cart__items';// como sempre vai chamar .cart__items(representa a ol)

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice() {
  const span = document.querySelector('.total-price');
  let price = 0;
  const allLi = document.querySelectorAll('.cart__item');// chamando as li pela classe
  allLi.forEach((item) => {
  const inner = item.innerText;// pegando o texto da li
  const arrayofLi = inner.split('$');// posição 0- é tudo que vem antes do cifrão que é isso aqui SKU: MLB1218701240 | NAME: Computador Pc Completo Intel 8gb Hd 500gb Monitor 18 Wind 10 | PRICE:, posição 1: 1269(preço)
  price += Number(arrayofLi[1]);// só o price
  });
  span.innerHTML = `${(Math.round((price * 100)) / 100)}`;// arredondar os centavos 
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

// Função que pega os 50 pcs da API Requisito 1
const computersonApi = async () => {
  const load = document.querySelector('.loading');
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const Obj = await api.json();
  const arrayResult = Obj.results;
  load.remove();
  arrayResult.forEach((computer) => document.querySelector('.items')
  .appendChild(createProductItemElement(computer)));
}; 
// Requisito 2
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;//  pega o elemento com a classe item get sku pega o texto/id  "MLB1341706310"
}

const getComputertoCart = async (id) => { // ao pegar o id da função sku, chamamos a api
  const apiOnePc = await fetch(`https://api.mercadolibre.com/items/${id}`); // só pega a id de um pc
  const apiJson = await apiOnePc.json();
  return apiJson;
};

// requisito 4
const addLocalStorage = () => { // só salva no local storage 
  const ListOl = document.querySelector(cart);// chamei ol
  const olHtml = ListOl.innerHTML;// peguei tudo que tem na ol
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(olHtml));// local storage só aceita string
};
 
// Requisito 3
function cartItemClickListener(event) {
  event.target.remove(); // removemos o item
  totalPrice(); // ao remover chame o total price para ele somar de novo pc por pc.
  addLocalStorage(); // salva no local storage 
 }

 const getLocalStorage = () => {
  const getStorage = JSON.parse(localStorage.getItem('cartList'));// chama de volta o item e transforma com o parse o que ele era antes. exe: era objeto virou string volta a ser objeto
  const ListOl = document.querySelector(cart);
  ListOl.innerHTML = getStorage;
  ListOl.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') { // evento for no filho- li 
      cartItemClickListener(event);// chama o evento de remover as li , porque ao recuperar precisa poder clicar e apagar de novo as li.
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // colocando os nomes como está na api 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // essa função é responsável por deixar os dados do pc com id, nome e preço
  li.addEventListener('click', cartItemClickListener); // chama a função que remove o item do carrinho
  return li;
}

  const buttonAddCart = () => {
    const section = document.querySelector('.items'); // Colocou para a seção ou seja os 50 computadores
    section.addEventListener('click', async (event) => {
      if (event.target.className === 'item__add') { // se o evento de click for no botao adicionar ao carrinho 
        const parentButton = event.target.parentElement;// acessar a section item, que é pai do botao adicionar ao carrinho
        const id = getSkuFromProductItem(parentButton);// jogar esse item na função getsku que me retorna um id
        const data = await getComputertoCart(id);// joga o id na função getComputertoCart pega os dados de um pc na api através desse id
        const createComputer = createCartItemElement(data);// coloca os dados do pc nessa função
        document.querySelector(cart).appendChild(createComputer);// na aba do carrinho de compras coloca os dados do único pc no formato id, nome, preço 
        addLocalStorage();// salva os itens
        totalPrice();// chama o preço para já ir atualizando
      }
    });
  };
// Código feito em grupo com explicação da Luiza, gostei muito do código e vou deixar aqui para fins de estudo
// const buttonRemoveAll = () => {
//   const listAgain = document.querySelector(cart);
//   const getButtonRemoveAll = document.querySelector('.empty-cart');
//   getButtonRemoveAll.addEventListener('click', () => {
//     while (listAgain.firstChild) {
//       listAgain.removeChild(listAgain.firstChild);
//       totalPrice();
//       addLocalStorage();
//     }
//   });
// }; 

function eraseAll() { // Usei o mesmo código que usei no projeto lista de tarefas, refatorei ele usando um forEach, no lugar do for.
  const List = document.querySelector(cart); // seria a ol
  const getButtonRemoveAll = document.querySelector('.empty-cart'); // botão esvaziar carrinho
  getButtonRemoveAll.addEventListener('click', () => {
    const ListAgain = document.querySelectorAll('li');
    ListAgain.forEach((computador) => { // para cada li, ou seja cada pc, remove filho por filho da ol
      List.removeChild(computador);
      totalPrice();
      addLocalStorage();
    });
  });
}

window.onload = () => {
computersonApi();
buttonAddCart();
getLocalStorage();
totalPrice();
eraseAll();
};
