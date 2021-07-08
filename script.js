// INFORMAÇÕES INICIAIS
const arrayDeRetorno = []; // Variável que guarda arrays de retorno - onde é guardado o carrinho como array
let elementOlCarrinho;

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// *********************************************
// Requisito 01 - CHAMA OS PRODUTOS PARA A TELA
// *********************************************
const fetchProdutos = (QUERY) => { // Conecta na API e busca o item QUERY
  // Posiciona o elemento dentro do .items (que é o noome do grupo onde vai estar todos itens)
  const loadingId = document.querySelector('#loading');
  const itemsSection = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`) // chama a API
    .then((response) => response.json())
    .then((produtos) => {
      produtos.results
        .forEach(({ id, title, thumbnail }) => {
          itemsSection.appendChild( // Fala que os itens abaixo serão filhos do grupo .items
            createProductItemElement({ // Adiciona os produtos ao abrir a pagina
              sku: id,
              name: title,
              image: thumbnail,
            }),
          );
      });
      loadingId.remove(); // requisito 07
    });
};

const getProdutos = async () => { // requisito 01
  try {
    await fetchProdutos('computador'); // Conjunto de itens a procurar
    await fetchProdutos('monitores'); // Conjunto de itens a procurar
  } catch (error) {
    alert('Ocorreu um erro ao buscar o produto');
  }
};

window.onload = function onload() {
  elementOlCarrinho = document.querySelector('.cart__items'); // Seleciona a OL de lista de carrinho

  getProdutos(); // requisito 01
};
