const getItems = document.querySelector('.items');
const getCart = document.querySelector('.cart__items');
const getTotalPrice = document.querySelector('.total-price');
const getEmptyButton = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

function createProductImageElement(imageSource) { // Função que cria o card do produto
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveCart = () => { // Essa função salva os valores do carrinho e seus preços no local storage
  localStorage.setItem('saveCart', getCart.innerHTML);
  localStorage.setItem('savePrice', getTotalPrice.innerHTML);
};

getEmptyButton.addEventListener('click', () => { // Adiciono uma escuta para o botão limpar o carrinho
  const getFullCart = document.querySelectorAll('.cart__item'); // Pego cada item do carrinho
  getFullCart.forEach((item) => item.parentNode.removeChild(item)); // Removo cada item dele com forEach
  getTotalPrice.innerHTML = 0; // Reseto o preço total dos itens do carrinho

  saveCart(); // Executo a função para salvar o carrinho
});

const sum = (value, operation) => { // Função para somar os valores dos produtos
  const result = value + operation;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;
  
  saveCart(); // Salvo carrinho após somar os valores dos produtos
};

const sub = (value, operation) => { // Função para somar os valores dos produtos
  const result = value - operation;
  getTotalPrice.innerHTML = Math.round(result * 100) / 100;

  saveCart(); // Salvo carrinho após subtrair os valores dos produtos
};

// Resolvi consultando o Matheus Duarte T13-A
const setTotalPrice = (value, operation) => {
  const getActualPrice = Number(getTotalPrice.innerHTML); // Transformo o innerHTML do preço total do carrinho em tipo numérico

  // Realizando as funções acima com base no operador escolhido
  if (operation === '+') sum(getActualPrice, value);
  if (operation === '-') sub(getActualPrice, value);
};

const returnCart = () => { // Função para retornar os valores do carrinho salvos no local storage
  getCart.innerHTML = localStorage.getItem('saveCart');
  getTotalPrice.innerHTML = localStorage.getItem('savePrice');
};

const removeCartItem = (event) => { // Função para remover item do carrinho
  if (event.target.className === 'cart_item') {
    event.target.remove(); // removo o item selecionado

    const getProductPrice = event.target.querySelector('span').innerText; 
    setTotalPrice(getProductPrice, '-'); // Criei uma constante que define o preço do item selecionado para subtrair valor total do carrinho

    saveCart();
  }
};

const setCartItem = ({ id: sku, title: name, price: salePrice }) => { // Função para adicionar item no carrinho
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`; // O innerhtml do item do carrinho deve conter as informações dos parâmetros desta função.

  getCart.appendChild(li);
  setTotalPrice(salePrice, '+');
};

const setProductCart = async (ID) => {
  try {
    const productInfo = await (await fetch(`https://api.mercadolibre.com/items/${ID}`)).json(); // Assim que a requisição ao endpoint da api é finalizada, essa função pega o retorno e aplica o json

    setCartItem(productInfo); // Assim que o metodo json for aplicado, chamo esta função para passar as informações do produto ao carrinho
    saveCart();
  } catch (error) {
    alert(error);
  }
};

function createCustomElement(element, className, innerText) { // Função que cria os elementos dentro do card do produto
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// A modificação desta função foi consultada no notion trybee
// A escuta é criada diretamente dentro do botão
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => { // Escuta para o botão criado na linha 101 que é o último elemento desta section
    const productID = event.target.parentElement.firstElementChild.innerText;
    setProductCart(productID); // Chamo a função para adicionar o primeiro filho do pai do botão para o carrinho
  });

  getItems.appendChild(section);
}

const catchProducts = async (product = 'computador') => {
  try {
    ((await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`))
      .json())
        .results)
          .forEach((result) => createProductItemElement(result), loading.remove());
  } catch (error) {
    alert(error);
  }
};

getCart.addEventListener('click', (removeCartItem));

window.onload = () => { 
  catchProducts();
  returnCart();
};
