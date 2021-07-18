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

// Função que busca ID do computador selecionado.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 3 remover item do carrinho ao clicar nele.
function cartItemClickListener(event) {
  return event.target.remove('li');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}\n\n`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* 
Requisito 1
Step 2
Alocando cada computador em um elemento HTML criado pela função createProductItemElement */
const adComputer = (compItem) => {
  compItem.forEach((item) => {
    const element = createProductItemElement(item);
    const section = document.querySelector('.items');
    section.appendChild(element);
  });
};

/* 
Requisito 1
Step 1
Fazendo a requisição da API
Referências: Link de apoio para o requisito:
https://www.youtube.com/watch?v=m3K8DP4kVXQ&t=24s&ab_channel=hcode
Vídeo feito durante o fechamento pelo especialista Jackson Pires */
const fetchComputer = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(url)
    .then((response) => response.json())
    .then((computer) => {
      adComputer(computer.results);
  });
};

/* 
Requisito 2
Step 2
Função adicionar computador ao carrinho */
const adList = (list) => {
  const ol = document.querySelector('.cart__items');
  const li = createCartItemElement(list);
  ol.appendChild(li);
};

/* 
Requisito 2
Step 1
Função para ao clicar no botão, selecionar o computador
Quando eu clicar num dos item da lista de classe 'items' vai gerar um evento */
const selectComputer = () => {
  const computerList = document.querySelector('.items'); // recuperando a lista de computadores
  computerList.addEventListener('click',
  (event) => {
   /* Ao clicar vai fazer referencia ao elemento (o que possuir a classe 'item__add')
   que disparou o evento, no caso o botão do computador selecionado */
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const idItem = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${idItem}`)
        .then((response) => response.json())
        .then((data) => {
          adList(data);
     });
    }
  });
};

window.onload = () => {
  fetchComputer();
  selectComputer();
};
