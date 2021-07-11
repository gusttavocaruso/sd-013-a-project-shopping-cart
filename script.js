// const fetch = require('node-fetch');
// const listItens = document.querySelector('.cart__items');

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

function createProductItemElement({ sku, name, image }) {
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

function cartItemClickListener(event) {
  event.target.remove();
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const listItens = document.querySelector('.cart__items');
  localStorage.setItem('shop_cart', listItens.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ARROW FUNCTION QUE LISTA OS PRODUTOS NA SECTION E TRATA OS DADOS RECEBIDOS
const addItensInSection = (items) => {
  const sectionItems = document.querySelector('.items'); // INSTANCIA A sectionItems QUE LISTARÁ OS PRODUTOS
  items.forEach((item) => { // PERCORRE O ARRAY DE OBJETOS RECEBIDO DA API - FETCHMELI
    const { id: sku, title: name, thumbnail: image } = item; // DESESTRUTURA AS CHAVES NECESSÁRIAS DOS OBJETOS
    const itemElement = createProductItemElement({ sku, name, image }); // CRIA O ELEMENTO A SER ADICIONADO
    sectionItems.appendChild(itemElement); // FAZ O APPEND DO ELEMENTO NA SECTION
  });
};

// ARROW FUNCTION PARA BUSCAR OS PRODUTOS DO MERCADO LIVRE NA PÁGINA, COM BASE EM UMA BUSCA ESPECÍFICA.
const fetchMeli = (query) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => { // RECEBE UMA PROMISSE
    response.json() // RECEBE OUTRA PROMISSE COM O ARQUIVO JSON
  .then((data) => addItensInSection(data.results)); // ENVIA PARA A FUNCTION QUE LISTA OS PRODUTOS O ARRAY DE OBJETOS LOCALIZADO NO ARQUIVO JSON COM OS PRODUTOS DA BUSCA.
});

const calcTotalPaySum = ((price) => {
  const totalPriceStorage = parseFloat(localStorage.getItem('total_price'));
  if ((localStorage.getItem('total_price') === undefined)
  || (localStorage.getItem('total_price') === null)) {
  localStorage.setItem('total_price', price);
  } else {
  const sumTotalCart = totalPriceStorage + price;
  localStorage.setItem('total_price', sumTotalCart);
  console.log(price);
  console.log('localstorage', sumTotalCart);
  }
});

const getProduct = (query) => {
  const getClassItem = query.target.parentElement.querySelector('span.item__sku'); // 
  const idItem = getClassItem.innerText;
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json()
    .then((data) => {
      const itemSelectAdd = { sku: data.id, name: data.title, salePrice: data.price };
      const listItensCart = document.querySelector('.cart__items');
      listItensCart.appendChild(createCartItemElement(itemSelectAdd));
      localStorage.setItem('shop_cart', listItensCart.innerHTML);
     
      const parsePriceItem = parseFloat(itemSelectAdd.salePrice).toFixed(2);
      calcTotalPaySum(parsePriceItem);
    }));
};

// ARROW FUNCTION ASSÍNCRONA QUE ADICIONA O PRODUTO AO CARRINHO
const itemAdd = async () => {
  try {
    const sectionItems = document.querySelector('.items'); // INSTANCIA A sectionItems QUE LISTARÁ OS PRODUTOS
    const loading = document.querySelector('.loading'); // INSTANCIA O ELEMENTO SPAN LOADING ANTES DO CARRG. DOS PRODUTOS
    await fetchMeli('computador'); // ENVIA O PARÂMETRO PARA A FUNÇÃO FETCHMELI QUE BUSCA OS PRODUTOS
    loading.remove(); // REMOVE LOADING APÓS O CARREGAMENTO DOS PRODUTOS
    sectionItems.addEventListener('click', (button) => { // ADICIONA UMA ESPERA DE EVENTO EM TODA A LISTA
      if (button.target.className === 'item__add') { // VERIFICA SE O ITEM CLICADO TEM A CLASSE ITEM_ADD
        getProduct(button); 
      }
    });
  } catch (error) {
    alert(`Erro ao adicionar produto> ${error}`);
  }
};

// ONLOAD CARREGA AS INFORMAÇÕES ASSIM QUE A PÁGINA É CARREGADA
window.onload = () => {
  const listItensCart = document.querySelector('.cart__items'); // INSTANCIA O CONTAINTER "OL" DE PRODUTOS
  const localCart = localStorage.getItem('shop_cart'); // BUSCA ITENS ADICIONADOS AO CARRINHO, SALVOS NO LOCALSTORAGE
  listItensCart.innerHTML = localCart; // CARREGA PRODUTOS SALVOS NO LOCALSTORAGE
  itemAdd();

// ESPERA O EVENTO DE CLICK PARA ADD UM PRODUTO AO CARRINHO
  listItensCart.addEventListener('click', (e) =>
    e.target.className === 'cart__item' && cartItemClickListener(e));

// ESPERA O EVENTO DE CLICK NO BOTAO ESVAZIAR CARRINHO E LIMPA O CARRINHO
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    listItensCart.innerText = '';
    localStorage.setItem('shop_cart', listItensCart.innerText);
    localStorage.setItem('total_price', null);
  });
};
