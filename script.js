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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

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
const pullDataML = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => {
      response.json().then((data) => {
        addElementChild(data.results);
      });
    });
};

window.onload = () => {
  pullDataML('computador');
};// Boa prática.
