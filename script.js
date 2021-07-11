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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // requisito 3, evento pra remover um item criado
 
  const getOl = document.querySelector('.cart__items');
  getOl.appendChild(li);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// requisito 2
const addcart = (event) => {
  const sectionItem = event.target.parentNode;
  const id = getSkuFromProductItem(sectionItem);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => createCartItemElement(data))
    .catch((error) => {
      alert(error.message);
   });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addcart); // alocado evento dentro do create product

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  
  return section;
}
// requisito 3
function cartItemClickListener(event) {
  const evento = event.target
  evento.remove();
}

const loadingId = document.querySelector('.loading');
const itemsSection = document.querySelector('.items');

const fetchProdutos = (QUERY) => {
  // Conecta na API e busca o item QUERY
  // Posiciona o elemento dentro do .items (que é o noome do grupo onde vai estar todos itens)
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`) // chama a API
    .then((response) => response.json())
    .then((produtos) => {
      produtos.results.forEach((item) => {
        itemsSection.appendChild(createProductItemElement(item) // chamado a função que cria os elementos
        );
      });
      loadingId.remove(); // requisito 07
    });
};

const getProdutos = async () => {
  // requisito 01
  try {
    await fetchProdutos('computador'); // Conjunto de itens a procurar
  } catch (error) {
    alert('Ocorreu um erro ao buscar o produto');
  }
};

getProdutos();
