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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

// Esta função cria os componentes HTML refentes aos produtos 
// dicionados ao carrinho de compras
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2° Passo - Requisito 1 - Para cada elemento do results, precisa invocar
// a função createProductItemElement. Cada elemet é um produto
// solicitado no item 1.
// Para que o nome, imagem apareça na pagina pessoal, é preciso usar a
// técnica id: sku, title: name, thumbnail: image. Na função createProductItemElement
const addElementChild = (elements) => {
  elements.forEach((element) => {
    const itemElement = createProductItemElement(element);
    const addToSection = document.querySelector('.items');
    addToSection.appendChild(itemElement);
  });
};

// Requisito 1
// 1° Passo - Função que faz requisição na API do ML
// Resolução com base na explicação do Jack
const pullItemML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)// Retorna uma Promises
    .then((response) => { // Retorna uma Promises
      response.json().then((data) => {
        addElementChild(data.results);
      });
    });
};

// Requisito 2
// Recupera o json da função rerequestItemML
// e adiciona as informações do produto selecionado
// ao carrinho
const addProductInCart = (data) => {
  const receiveLi = createCartItemElement(data);
  const accessOlCart = document.querySelector('.cart__items');
  accessOlCart.appendChild(receiveLi);
};

// Requisito 2
const requestItemML = (elemetML) => {
  const parentNODE = elemetML.target.parentElement;
  // Aqui é chamada a função na qual acessa o elemento pai do
  // button que foi clicado (<section class="item">), uma vez dentro desta
  // é retornado o Sku (id do produto clicado) e guarda no getSku.
  const getSku = getSkuFromProductItem(parentNODE);
  fetch(`https://api.mercadolibre.com/items/${getSku}`)// Retorna uma Promises
    .then((response) => { // Retorna uma Promises
      response.json().then((data) => addProductInCart(data));
    });
};

// Requisito 2
// Resolução baseada na resolução do colega GabrielLenz
// Ao carregar a pagina adiciona um escutador nos elementos da section items.
// Adicionar ao Carrinho.
// Refatorar aqui para adicionar o evento a cada button,
// resolvi colocando o target.localName
const buttonEvent = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (elements) => {
    if (elements.target.localName === 'button') requestItemML(elements);
  });
};

window.onload = () => {
  pullItemML('computador');
  buttonEvent();
};// Boa prática.
