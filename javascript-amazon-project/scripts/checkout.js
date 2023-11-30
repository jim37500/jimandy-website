import { cart, removeProduct, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';


function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();
let cartItemHTML = '';
cart.forEach((cartItem, index) => {
  const productId = cartItem.id;
  let matchingItem;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingItem = product;
    }
  })

  cartItemHTML += `
    <div class="cart-item-container js-item-container-${matchingItem.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingItem.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingItem.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id = ${matchingItem.id}>
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingItem.id}">
            <span class="save-quantity-link link-primary js-save-link" data-product-id = ${matchingItem.id}>
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id = ${matchingItem.id}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${index}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${index}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${index}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
});

document.querySelector('.js-order-summary').innerHTML = cartItemHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const {productId} = link.dataset;
    removeProduct(productId);
    const container = document.querySelector(`.js-item-container-${productId}`);
    container.remove();
    updateCartQuantity();
  });
});

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const {productId} = link.dataset;
    document.querySelector(`.js-item-container-${productId}`).classList.add('is-editing-quantity');

    const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
    inputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const newQuantity = Number(inputElement.value);
        console.log(newQuantity);
        if (newQuantity >= 0 && newQuantity < 1000) {
          updateQuantity(productId, newQuantity);
          document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
          updateCartQuantity();
        } else {
          alert('input must not less than 0 and less than 1000 ');
        }
        document.querySelector(`.js-item-container-${productId}`).classList.remove('is-editing-quantity');
      }
    })
  });

})

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const {productId} = link.dataset;
    const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

    if (newQuantity >= 0 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
      updateCartQuantity();
    } else {
      alert('input must not less than 0 and less than 1000 ');
    }
    document.querySelector(`.js-quantity-input-${productId}`).value = '';
    document.querySelector(`.js-item-container-${productId}`).classList.remove('is-editing-quantity');
  })
})
