const cartItems = '.cart__items'; // constante com a classe '.cart_items', ol(lista ordenada)
// função não modificada
function createProductImageElement(imageSource) { // cria imagens que são renderizadas na tela
  const img = document.createElement('img'); // cria elemento imagem
  img.className = 'item__image'; // atribui para a imagem a classe 'item_image'
  img.src = imageSource; // "caminho" da imagem
  return img; // envia imagem criada pela função
}
// função não modificada
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element); // cria elemento
  e.className = className; // atribui classe "className" ao elemento
  e.innerText = innerText; // propriedade para inserir texto no elemento
  return e; // envia o texto
}

function sumPrice() { // função que soma o valor total do carrinho de compra (Requisito 5)
  const totalPrice = document.querySelector('.total-price'); // acessa o elemento pela classe '.total-price'
  let price = 0; // preço zerado para iniciar a soma
  const itemsToSum = document.querySelectorAll('li'); // selecionar todas as li's
  itemsToSum.forEach((item) => { // para cada li "individualmente"
  const computer = item.innerText.split('$'); // constante para pegar a string depois do $ (cifrão), array [0,1]
  price += Number(computer[1]); /// constante price recebe somatório da string convertida em número, a soma começa na posição [1] porque a posição [0] é string
  });
  totalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`; // arredondamento
  }
// funcção existente, mas modificada
function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // colocar itens da API como objeto
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const itemsLink = async () => { // cria loading enquanto API está sendo buscada (Requisito 7)
  const loading = document.querySelector('.loading'); // selecionando a classe '.loading'
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador'); // constante para acessar API
  const apiJson = await api.json(); // constante para acessar JSON

  const resultsJson = apiJson.results; // acessa os resultados "necessários" da JSON
  loading.remove(); // remove elementos com classe '.loading'
  resultsJson.forEach((product) => document.querySelector('.items') // seleciona cada produto com a classe '.items' e renderiza no html
    .appendChild(createProductItemElement(product))); // cria o produto no carregamento da API
};
// Carregar o carrinho de compras através do LocalStorage ao iniciar a página (Requisito 4)
const localItems = () => {
  const ol = document.querySelector(cartItems); // constante para selecionar items com classe 'cartItems'
  const text = ol.innerHTML; // constante para acessar o texto contido na ol html
  localStorage.setItem('cartList', ''); // dando reset na classe 'cartList'
  localStorage.setItem('cartList', JSON.stringify(text)); // transforma o texto para JSON
};
// Função já existente. Remover itens do carrinho ao clicar (Requisito 3)
function cartItemClickListener(event) {
  event.target.remove();
  localItems(); 
  sumPrice(); 
}
// Carrega o carrinho de compras através do localStorage ao iniciar a página
const itemsStorage = () => {
  const createItem = JSON.parse(localStorage.getItem('cartList')); // cria os itens com a classe 'cartList' (ol)
  const ol = document.querySelector(cartItems); // constante para selecionar os itens
  ol.innerHTML = createItem; // itens já salvos dentro da ol
  ol.addEventListener('click', (event) => { // ao clicar na ol
    if (event.target.className === 'cart__item') { // se tiver a classe 'cart_item'
      cartItemClickListener(event); // será apagado através desta função
    }
  });
};
// função já existente. Adiciona produto ao carrinho. Cria li dentro da ol
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // desestrutura o array para objeto
  const li = document.createElement('li'); // cria elemento li
  li.className = 'cart__item'; // atribui a classe 'cart_item' para a li
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // formato do objeto para a li
  li.addEventListener('click', cartItemClickListener); // adicionando o evento clicar
  return li;
}
// função para acessar cada link único de cada produto referente na API (Requisito 2)
const itemLink = async (id) => { // função para receber a id de cada produto
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`); // acessa resposta do link da API
  const apiJson = await api.json(); // acessa resposta JSON do link da API
  return apiJson;
};

function getSkuFromProductItem(item) { // seleciona o text contido no elemento de classe 'span.item_sku'
  return item.querySelector('span.item__sku').innerText;
}
// selecionar o botão de 'adicionar ao carrinho' e criar uma lista ao clicar
const addToCart = () => {
  const itemsChoose = document.querySelector('.items'); // selecionar a classe que possui os items
  itemsChoose.addEventListener('click', async (event) => { // criar evento click
    if (event.target.className === 'item__add') { // se clicar em elementos com classe 'item_add'
      const buttonChoose = event.target.parentElement; // constante para receber elemento pai do elemento clicado
      const buttonId = getSkuFromProductItem(buttonChoose); // armazena o item
      const buttonData = await itemLink(buttonId); // acessa o link de cada item
      const productChoose = createCartItemElement(buttonData); // cria objeto {id, nome e preço} nas lis com dados da JSON
      document.querySelector(cartItems).appendChild(productChoose); // retorna li's como filhos dos elementos (ol's)
      localItems(); 
      sumPrice();
    }
  });
};

const removeItems = () => {
  const buttonRemove = document.querySelector('.empty-cart'); // seleciona o elemento com a classe '.empty-cart'
  buttonRemove.addEventListener('click', () => { // evento click para remover itens
    const ol = document.querySelector(cartItems); // seleciona os itens com classe cartItems (ol's)
    while (ol.firstChild) { // enquanto existir algum elemento filho das ol's
      ol.removeChild(ol.firstChild); // remova os elementos filhos (li's)
      sumPrice();
      localItems();
    }
  });
};

window.onload = () => { // quando a página carregar chame as funções
  sumPrice();
  itemsLink();
  itemsStorage();
  addToCart();
  removeItems();
};