const pagesInput = document.querySelector('#pages');
const copiesInput = document.querySelector('#copies');
const totalPrice = document.querySelector('#total-price');
const printTotal = document.querySelector('#print-total');
const lineItem = document.querySelector('#line-item');
const fileInput = document.querySelector('#file-upload');
const uploadZone = document.querySelector('#upload-zone');
const uploadTitle = document.querySelector('#upload-title');
const uploadSubtitle = document.querySelector('#upload-subtitle');
const toast = document.querySelector('#toast');
const pricingList = document.querySelector('#pricing-list');
const pricingForm = document.querySelector('#pricing-form');
const rates = { bw: 1.5, colour: 5 };
const items = [
  { id: 'bw', name: 'Black & white', price: 1.5 },
  { id: 'colour', name: 'Colour', price: 5 },
];

function calculateTotal() {
  const pages = Math.max(1, Number(pagesInput.value) || 1);
  const copies = Math.max(1, Number(copiesInput.value) || 1);
  const colour = document.querySelector('input[name="colour"]:checked').value;
  const rate = rates[colour];
  const total = pages * copies * rate;
  pagesInput.value = pages;
  copiesInput.value = copies;
  totalPrice.textContent = total.toFixed(2);
  printTotal.textContent = `$${total.toFixed(2)}`;
  lineItem.textContent = `${pages} pages × ${copies} ${copies === 1 ? 'copy' : 'copies'}`;
}

function renderPricing() {
  pricingList.innerHTML = items.map((item) => `<div class="pricing-item"><span>${item.name}</span><label><b>$</b><input type="number" min="0.01" step="0.01" value="${item.price.toFixed(2)}" data-rate-id="${item.id}" aria-label="${item.name} price"></label></div>`).join('');
  pricingList.querySelectorAll('[data-rate-id]').forEach((input) => input.addEventListener('change', () => {
    const item = items.find((entry) => entry.id === input.dataset.rateId);
    const price = Math.max(0.01, Number(input.value) || item.price);
    item.price = price;
    if (rates[item.id] !== undefined) rates[item.id] = price;
    input.value = price.toFixed(2);
    calculateTotal();
  }));
}

document.querySelectorAll('input[name="colour"], input[name="sides"]').forEach((input) => input.addEventListener('change', calculateTotal));
[pagesInput, copiesInput].forEach((input) => input.addEventListener('input', calculateTotal));
document.querySelectorAll('[data-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.querySelector(`#${button.dataset.step}`);
    input.value = Math.max(1, Number(input.value) + Number(button.dataset.change));
    calculateTotal();
  });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  uploadTitle.textContent = file.name;
  uploadSubtitle.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB ready to print`;
  uploadZone.classList.add('dragging');
});
['dragenter', 'dragover'].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  uploadZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  uploadZone.classList.remove('dragging');
}));
uploadZone.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer.files;
  if (!file) return;
  uploadTitle.textContent = file.name;
  uploadSubtitle.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB ready to print`;
});

document.querySelector('#place-order').addEventListener('click', () => {
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4500);
});

pricingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#item-name').value.trim();
  const price = Number(document.querySelector('#item-price').value);
  if (!name || price <= 0) return;
  items.push({ id: `item-${Date.now()}`, name, price });
  pricingForm.reset();
  renderPricing();
});

renderPricing();
calculateTotal();
