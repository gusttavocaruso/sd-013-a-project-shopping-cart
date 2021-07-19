// Em conjunto com Rafael e Josué a definir esta constante global (items).
const items = document.querySelector('.items');
const carrinho = document.querySelector('.cart__items');
const precoTotal = document.querySelector('.total-price');
const botao = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const pesquisa = document.querySelector('#searchField');
const srchButton = document.querySelector('#searchButton'); 

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = `https://http2.mlstatic.com/D_NQ_NP_${imageSource}-O.webp`;
  return img;
}

const salvaCarrinho = () => {
  localStorage.setItem('carrinhoSalvo', carrinho.innerHTML);
  localStorage.setItem('precoSalvo', precoTotal.innerHTML);
};

botao.addEventListener('click', () => {
  const carrinhoCheio = document.querySelectorAll('.cart__item');
  carrinhoCheio.forEach((item) => item.parentNode.removeChild(item));
  precoTotal.innerHTML = 0;
  salvaCarrinho();
});

const soma = (valorAtual, valorOperacao) => {
  const somaResultado = valorAtual + valorOperacao;
  precoTotal.innerHTML = Math.round(somaResultado * 100) / 100;
};

 const subtracao = (valorAtual, valorOperacao) => {
  const subtracaoResultado = valorAtual - valorOperacao;
  precoTotal.innerHTML = Math.round(subtracaoResultado * 100) / 100;
};

// Resolvi em conjunto com Matheus Camilo T13-A
const calculaPrecoTotal = (valor, operador) => {
    const precoAtual = Number(precoTotal.innerHTML);
    if (operador === '+') soma(precoAtual, valor); 
    if (operador === '-') subtracao(precoAtual, valor);
};

const recuperaCarrinho = () => {
  carrinho.innerHTML = localStorage.getItem('carrinhoSalvo');
  precoTotal.innerHTML = localStorage.getItem('precoSalvo'); 
};

// Rogério P. Silva e Josué Lobo me ajudaram a pensar nesta estratégia
function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
    const precoDoProduto = event.target.querySelector('span').innerText;
    calculaPrecoTotal(precoDoProduto, '-');
    salvaCarrinho();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  // Rogerio P. Silva bolou essa estratégia de tornar o salePrice interagível colocando-o como um spam.
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span>${salePrice}</span>`;
  carrinho.appendChild(li);
  calculaPrecoTotal(salePrice, '+');
}

const addProdutoNoCarrinho = async (ID) => {
  try {
    const infosProduto = await (await fetch(`https://api.mercadolibre.com/items/${ID}`)).json();
    createCartItemElement(infosProduto);
    salvaCarrinho();
  } catch (error) {
    alert(error);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Rogerio P. Silva recomendou criar a escuta do botao dentro de onde ele é criado.
function createProductItemElement({ id: sku, title: name, thumbnail_id: image }) {
  const section = document.createElement('section');
  const sectionImg = document.createElement('section');
  section.className = 'item';
  sectionImg.className = 'img_sec';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  sectionImg.appendChild(createProductImageElement(image));
  section.appendChild(sectionImg);
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (event) => {
    const productID = event.target.parentElement.firstElementChild.innerText;
    addProdutoNoCarrinho(productID);
  });
  
  items.appendChild(section);
}

const pegaProdutos = async (produto = 'computador') => {
  try {
    ((await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`))
    .json())
      .results)
        .forEach((computador) => createProductItemElement(computador), loading.remove());
  } catch (error) {
    alert(error);
  }
};

srchButton.addEventListener('click', async () => {
  items.innerHTML = '';
  await pegaProdutos(pesquisa.value);
  pesquisa.value = '';
  if (items.innerHTML === '') {
  await pegaProdutos();
  alert('Não encontramos o que você procurava');
  }
});

pesquisa.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 && pesquisa.value !== '') {
    event.preventDefault();
    srchButton.click();
   }
});

carrinho.addEventListener('click', (cartItemClickListener));
carrinho.addEventListener('mouseover', (event) => {
  if (event.target.className === 'cart__item') {
    const atualHTML = event.target.innerHTML;
    const spanAtual = event.target.querySelector('span').innerText;
    const li = event.target;
    li.innerHTML = `REMOVER DO CARRINHO<span style="display:none">${spanAtual}</span>`;
    li.addEventListener('mouseout', (event) => {
      if (event.target.className === 'cart__item') {
        const newLi = event.target;
        newLi.innerHTML = atualHTML;
      }
    });
  }
});

window.onload = () => {
  pegaProdutos();
  recuperaCarrinho();
};

// const pegaProdutosThen = () => {
//   fetch(`https://api.mercadolibre.com/sites/MLB/search?q=computador`)
//     .then((result) => {
//       if (!result.ok) {
//         throw new Error();
//       }
//       return result.json();
//     })
//     .then((json) => (json.results).forEach((computador) => createProductItemElement(computador)))
//     .catch(() => alert('erro'));
// };
