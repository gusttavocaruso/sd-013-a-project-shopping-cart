const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'; // estou atribuindo a constante o endereco da API do mercado livre. Ao invés de usar de forma repedida que dava erro no lint. 
const cartItemsClass = '.cart__items'; // atribui a constante o resgate do elemento atraves da classe, pois será utilizada em alguns momentos. Ao invés de usar de forma repedida que dava erro no lint. 

const updateTotalPrice = () => {
  let totalPrice = 0;
  const elementTotalPrice = document.querySelector('.total-price');
  const listCartItem = document.querySelectorAll('li');

  listCartItem.forEach((cartItem) => {
    const cartItemText = cartItem.innerText;
    const cartItemPrice = Number(cartItemText.split('$')[1]);

    totalPrice += cartItemPrice;
  });

  elementTotalPrice.innerHTML = totalPrice;
};

function cartItemClickListener(event) { // funcao já existente do código e só trabalhei os valores dela. Essa funcao é responsavél por realizar algo ao ser clicado.
  const element = event.target; // criei a constante element e atribui a ela o parametro event.target(que significa o local exato onde o click aconteceu)

  element.remove(); // peguei a constante acima e pedi que removesse. Essa resolução faz parte da questao 3.

  const id = element.getAttribute('data-id'); // Criei uma constante e atribui a ela o element.getAttribute('data-id'). O getAttribute retorna o valor de um argumento específico do elemento.
  const computersFromLocalStorage = window.localStorage.getItem('computadoresNoCarrinhoDeCompras'); // criei uma constante para pegar os cumputadores do localStorage. fiz isso com o window.localStorage.getItem
  const computerList = JSON.parse(computersFromLocalStorage); // criei a contante para pegar a lista de computadores. Usei o JSON. parse() pois ele analisa uma string JSON vinda da constante acima, construindo o valor ou um objeto JavaScript descrito pela string.
  const computerListUpdated = computerList.filter((computer) => computer.id !== id); // criei uma constante e usei o metodo filter para pegar somente os computadores que tivessem o id diferente do id.

  window.localStorage.setItem( // para gravao os valores que foram adicionados no carrinho de compras no localstorage com o setitem
    'computadoresNoCarrinhoDeCompras',
    JSON.stringify(computerListUpdated), // transformando os valores em strings com o stringfy.
  );

  updateTotalPrice();
}

// FUNÇÃO JÁ FAZIA PARTE DO CÓDIGO ORIGINAL
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// FUNÇÃO JÁ FAZIA PARTE DO CÓDIGO ORIGINAL
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// FUNÇÃO JÁ FAZIA PARTE DO CÓDIGO ORIGINAL
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// FUNÇÃO JÁ FAZIA PARTE DO CÓDIGO ORIGINAL
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// FUNÇÃO JÁ FAZIA PARTE DO CÓDIGO ORIGINAL
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // A única coisa alterada do código foi que desentruturei o mesmo.
  const li = document.createElement('li');
  li.setAttribute('data-id', sku);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addLocalStorageItems = (dados) => {
  // local storage
  // pegar os items que ja foram adicionados
  const valorDoLocalStorage = JSON.parse(
    window.localStorage.getItem('computadoresNoCarrinhoDeCompras'),
  );
  const computerAdicionados = valorDoLocalStorage || [];

  // adiciona aos items ja salvos um novo computador
  computerAdicionados.push(dados);

  // salvando no local storage novamente
  window.localStorage.setItem(
    'computadoresNoCarrinhoDeCompras', JSON.stringify(computerAdicionados),
  );
};

const getCartComputer = async (id) => { // Por ser uma promise e por preferir usar o async/await do que o then, estouu dando a funcao o async.
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`); // criei constante e dei o await no fetch que também retorna uma promise o endereço do API dado pelo projeto, buscando pelo id.
  const apiJson = await api.json(); // criei contante e atribui a ela os valores da constante anterior dando um JSON para que venha em formado de texto estruturado de objeto.
  return apiJson; // retornei a constante apiJson
};

const buttonDeleteAllCards = () => { // funcao responsavel por deletar todos os itens da lista ao clicar no botao.
  const button = document.querySelector('.empty-cart'); // criei uma constante e atribuia  ela o resgate da classe do botao que deleta todos os itens.
  button.addEventListener('click', () => { // dei um escutador de click nesse button com o addEventListener
    const lista = document.querySelector(cartItemsClass); // criei uma constante e atribui a ela o resgate da classe atribuida no inicio da pagina.
    lista.innerHTML = ''; // atualizei o valor do innerHTML como uma string vazia
    updateTotalPrice();
  });
};

const buttonAddCards = () => { // essa funcao é responsavel por adicionar ao carrinho o card ao ser clicado no botao.
  const classSection = document.querySelector('.items'); // criei uma constante e atribui a ela o resgate da classe que está no elemento section.
  classSection.addEventListener('click', async (evento) => { // dei um escutador com o addEventListener a partir do click. o evento vai retornar uma promise por isso usei o async
    if (evento.target.className === 'item__add') { // se o evento exato que foi clicado possui uma classe 'item__add'
      const buttonDeAdicionar = evento.target.parentElement; // criei uma constante e atribui o evento clicado e busquei o elemento com o parentElement está buscando o elemento pai.
      const idDoComputador = getSkuFromProductItem(buttonDeAdicionar); // criei uma constante e atribui a chamada da funcao que é responsavel por resgatar o texto do span que contém a classe item__sku, que vem a ser o id.
      const dadosDoComputador = await getCartComputer(idDoComputador); // criei uma constante e atribui a chamada da funcao que é responsavel por  pegar os elementos JSON (que retorna uma promise) por isso vem com o await e passando como parametro a constante acima que é o texto do id.
      const elementoLiComputador = createCartItemElement(dadosDoComputador); // criei uma constante e atribui a chamada da funcao que é responsável por criar o elemento li, passando como parametro a constante acima.
      document.querySelector(cartItemsClass).appendChild(elementoLiComputador); // resgatanto a classe declarada no inicio da página, criando um appendChild da constante acima.
      addLocalStorageItems(dadosDoComputador); // chamei a funcao que é responsavel de gravar e pegar os elementos no localstorage, para que desde o inicio, tudo seja adicionado no localstorage

      updateTotalPrice();
    }
  });
};

async function fetchApi() { // funcao responsável por pegar os dados da API do mercado livre, criar objetos, criar elementos.
  const response = await fetch(apiMercadoLivre); // criei uma constante e atribui o fetch que é responsavel por buscar de maneira facil e logica os recursos de for assicrona, por isso usei o await.
  const data = await response.json(); // criei uma constante e atribui a ela a constante acima passando o JSON, que como vimos serve para passar essas informacoes em forma de objeto.
  const { results } = data; // criei a constante com o object destructuring atribuindo o valor de data.
  results.forEach((produto) => { // usei o metodo forEach em results para percorrer produto por produto
    const novoProduto = { // criei uma constante e atribui a ela a criacao de um objeto
      sku: produto.id, // usando o id do produto
      name: produto.title, // usando o title do produto
      image: produto.thumbnail, // usando a imagem do produto
    };
    const element = createProductItemElement(novoProduto); // criei uma constante a atribui a chamada da funcao como parametro a constante acima.
    const items = document.querySelector('.items'); // criei uma constante e atrubui a ela o resgate do elemento atraves da classe
    items.appendChild(element); // dando o appendChild no elemento pai.
  });
}

const getComputersFromLocalStorage = () => { // funcao responsavel por pegar os dados gravados no localStorage
  const computersFromLocalStorage = window.localStorage.getItem('computadoresNoCarrinhoDeCompras'); // criei uma constante e atribui a ela o getItem.
  const computerList = JSON.parse(computersFromLocalStorage) || []; // criei uma constante e atribui o Json.parse da constante acima pois elas sao passadas em forma de string.

  computerList.forEach((computer) => { // usei o método forEach para percorrer a lista de computadores
    const elementoLiComputador = createCartItemElement(computer); // criei uma constante e atribui a chamada da funcao passando como parametro cada um dos computadores
    document.querySelector(cartItemsClass).appendChild(elementoLiComputador); // resgatando o elemento atraves da classe que foi definida no inicio da pagina, e dando um appendChild na constante acima.
  });
};

window.onload = () => {
  fetchApi();
  buttonAddCards();
  getComputersFromLocalStorage();
  buttonDeleteAllCards();
};
