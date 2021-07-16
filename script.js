// variaveis

const itemsCart = '.cart__items'; // atribui as tags <ol> na variavel

const somarPreco = () => {
  const precoTotal = document.querySelector('.total-price');
  let preco = 0;
  const listas = document.querySelectorAll('li');
  listas.forEach((lista) => {
    const produto = lista.innerText.split('$');
    preco += Number(produto[1]);
  });
  precoTotal.innerHTML = `${(Math.round((preco * 100)) / 100)}`;
};

const esvaziarCarrinho = () => {
  const btnEsvaziar = document.querySelector('.empty-cart');
  btnEsvaziar.addEventListener('click', () => {
    const tagOL = document.querySelector(itemsCart);
    tagOL.innerHTML = '';
  });
};

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

// Requisito 4

const setLocalStorageItems = () => {
  const listaOrdenada = document.querySelector(itemsCart); 
  const textoCarrinho = listaOrdenada.innerHTML;
  localStorage.setItem('lista', '');
  localStorage.setItem('lista', JSON.stringify(textoCarrinho));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// funcao remove o item ao clicar sobre ele no carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(); // requisito 3
  setLocalStorageItems(); // Requisito 4
  somarPreco(); // Requisito 5
}

// Requisito 4
const getLocalSto = () => {
  const getStorage = JSON.parse(localStorage.getItem('lista'));
  const ordenadaList = document.querySelector(itemsCart);
  ordenadaList.innerHTML = getStorage;
  ordenadaList.addEventListener('click', (ev) => {
    if (ev.target.className === 'cart__item') {
      cartItemClickListener(ev);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItensToSection = (items) => {
  items.forEach((item) => {
    const itemElement = createProductItemElement(item); // item é igual ao produto
    const section = document.querySelector('.items');
    section.appendChild(itemElement);
  });
};

const fetchML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`)
    .then((response) => { // response traz todas a informações porem de formato de bytes
      response.json().then((data) => {
        addItensToSection(data.results);
      });
    });
};

// Requisito 2 
// funcao retorna uma fetch que busca o ids da API e lidamos com ela usando o .then para retornar o Objeto 
function addProdutos(idItems) {
  return fetch(`https://api.mercadolibre.com/items/${idItems}`)
    .then((response) => response.json())
    .then((data) => data);
}

// requisito 2 continuacao ...
// funcao guarda na variavel allProducts todos os itens que contem a classe .items
// adicionamos um evento de clique assincrono no botao adiciona se o mesmo possuir a classe item__add
const btnAdicionaProdut = () => {
  const allProducts = document.querySelector('.items');

  allProducts.addEventListener('click', async (addclick) => {
    if (addclick.target.className === 'item__add') {
      const paiElement = addclick.target.parentElement; // atribui o elemento pai a variavel
      console.log(paiElement);
      const retornaId = getSkuFromProductItem(paiElement); // atribui 
      const retornaFuncAddProdutos = await addProdutos(retornaId);
      const adicionaLi = createCartItemElement(retornaFuncAddProdutos);
      document.querySelector(itemsCart).appendChild(adicionaLi);
      setLocalStorageItems(); // Requisito 4 
      somarPreco(); // Requisito 5 
    }
  });
};

window.onload = () => {
  fetchML('computador');
  // addProdutos('MLB1341706310')
  btnAdicionaProdut(); 
  getLocalSto(); // Requisito 4
  somarPreco(); // Requisito 5
  esvaziarCarrinho(); // Requisito 6;
};
