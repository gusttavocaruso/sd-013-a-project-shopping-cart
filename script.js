// preco do carrinho
const priceCartUpdate = () => {
  let cartPrice = 0;
  const cartI = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartI.length; i += 1) {
    cartPrice += cartI[i].salePrice;
    // console.log(cartI[i].salePrice);
  }  
  return cartPrice;
};

const totalPriceUpdate = () => {
const clearUp = document.querySelector('.total-price');
if (clearUp !== null) {
  clearUp.remove();
}
const h2 = document.createElement('h2');
h2.classList = 'total-price';
h2.innerText = `Total: R$ ${priceCartUpdate()}`;
document.querySelector('.cart').appendChild(h2);
};

// criada em aula
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
  
  function cartItemClickListener(event) {
    const myObj = event.target;
    console.log(myObj.sku);
    localStorage.removeItem(myObj.sku);
    myObj.remove();
    priceCartUpdate();
  }
  
  function createCartItemElement(sku, name, salePrice) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.sku = sku;
    li.salePrice = salePrice;
    document.querySelector('.cart__items').appendChild(li);
    li.addEventListener('click', cartItemClickListener);
    localStorage.setItem(sku, salePrice);      
    totalPriceUpdate();
    return li;
  }
  
  const addItensToSection = (items) => {
    items.forEach((item) => {
      const itemElement = createProductItemElement(item); // item == ao produto
      const section = document.querySelector('.items');
      section.appendChild(itemElement);
    });
  };
  
  const fetchML = (query) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => { // response traz todas as informações
      response.json().then((data) => { // filtrar apenas o json
        addItensToSection(data.results);
        // console.log(data.results);      
      });
    });
  };
  
  // funcoes adicionadas
  function listToCartID(item) {
    // console.log(item);
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((response) => {
      response.json().then((data) => {
        // console.log(data.base_price);
        createCartItemElement(data.id, data.title, data.base_price);
        // console.log(data); //aqui ta a resposta completa do produto
      });
    });  
  }

  function loadStorage() {
    for (const key in localStorage) {
      const test = 'MLB';
      if (key.indexOf(test) > -1) {
        listToCartID(key);
        // console.log(localStorage[key]);
      }
    }
  }
  
  const clearCart = () => {
    localStorage.clear();
    const cartI = document.querySelectorAll('.cart ol li');
    cartI.forEach((el) => el.remove());
    totalPriceUpdate();
  };
  
window.onload = () => { 
  fetchML('computador');
  
  document.querySelector('.items').addEventListener('click', function (e) {
    if (e.target.classList.contains('item__add')) {
      listToCartID(e.target.parentNode
        .querySelector('.item__sku').innerText);
      }
    });

    loadStorage();

    const emptyCart = document.querySelector('.empty-cart');
    emptyCart.addEventListener('click', clearCart);
  };
