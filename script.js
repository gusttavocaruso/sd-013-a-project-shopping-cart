const carrinho = document.querySelector('.cart__items');
const precoTotal = document.querySelector('.total-price');
const botaoEsvazia = document.querySelector('.empty-cart');
const load = document.querySelector('.loading');

const salvo = () => {
  localStorage.setItem('carrinhoSalvo', carrinho.innerHTML);
  localStorage.setItem('precoSalvo', precoTotal.innerHTML); 
};

botaoEsvazia.addEventListener('click', () => {
  carrinho.innerHTML = '';
  precoTotal.innerHTML = 0;
  salvo();
});

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

// Agradecimentos a Matheus Duarte e Matheus Camillo que mostraram e explicaram como calcular os valores somando e subtraindo

const calculaPrecoTotal = (valor, operador) => {
  let precoAtual = Number(precoTotal.innerText);
  if (operador === '+') precoAtual += valor;
  if (operador === '-') precoAtual -= valor;
  precoTotal.innerText = Math.round(precoAtual * 100) / 100;
  salvo();
};

const recuperado = () => {
  precoTotal.innerHTML = localStorage.getItem('precoSalvo');
  carrinho.innerHTML = localStorage.getItem('carrinhoSalvo');
};

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
    calculaPrecoTotal(event.target
      .querySelector('span').innerText, '-');
    salvo();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  carrinho.appendChild(li);
  calculaPrecoTotal(salePrice, '+');
  return li;
}

const getItem = async (item) => {
  try {
    const linkItem = `https://api.mercadolibre.com/items/${item}`;
    const retorno = await (await fetch(linkItem)).json();
    createCartItemElement(retorno);
    salvo();
  } catch (error) {
    alert('Outro erro ae');
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // Agradecimentos ao Matheus Duarte que me mostrou e explicou essa forma de usar o botão.
  section.lastElementChild.addEventListener('click', (event) => {
    getItem(event.target.parentElement.firstElementChild.innerText);
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getAPI = async (item) => {
  try {
    const linkAPI = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
    ((await (await fetch(linkAPI))
      .json()).results).forEach((item2) => {
        document.querySelector('.items')
          .appendChild(createProductItemElement(item2));
      });
      load.remove();
  } catch (error) {
    alert('Um erro ae');
  }
};

carrinho.addEventListener('click', cartItemClickListener);

window.onload = () => {
  getAPI('computador');
  recuperado();
};
