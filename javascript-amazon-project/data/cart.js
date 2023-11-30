export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchingItem = cartItem;
    }
  });

  const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId, 
      quantity});
  }    
  console.log(cart);
  saveToStorage();
}

export function removeProduct(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.id !== productId) {
      newCart.push(cartItem)
    }
  })
  cart = newCart;
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  })
  return cartQuantity
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      cartItem.quantity = newQuantity;
    }
  })
  saveToStorage();
  console.log(cart);
}