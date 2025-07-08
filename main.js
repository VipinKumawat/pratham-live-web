// main.js – Part 1 of 4
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

// Utility: Format ₹ price
function formatINR(price) {
  return `₹${price}`;
}

// Fetch products from Supabase
async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}
// main.js – Part 2 of 4

function renderProducts(products) {
  root.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">🛍️ Pratham – Custom Studio</h1>
    <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"></div>
  `;

  const listEl = document.getElementById('product-list');

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = "bg-white p-4 rounded shadow";

    card.innerHTML = `
      <h2 class="text-xl font-semibold">${product.name}</h2>
      <p class="text-gray-700">${formatINR(product.price)}</p>
      <button class="mt-2 bg-green-600 text-white px-3 py-1 rounded" onclick="orderOnWhatsApp('${product.name}', ${product.price})">
        Order on WhatsApp
      </button>
    `;

    listEl.appendChild(card);
  });
}

// WhatsApp order logic
window.orderOnWhatsApp = function(productName, price) {
  const msg = encodeURIComponent(`Hi, I'm interested in:\n${productName} – ₹${price}`);
  window.open(`https://wa.me/919722609460?text=${msg}`, '_blank');
};
// main.js – Part 3 of 4

function renderAdminPanel() {
  const adminDiv = document.createElement('div');
  adminDiv.className = "mt-10 p-4 bg-yellow-100 rounded";
  adminDiv.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">🛠 Admin Panel</h2>
    <form id="product-form" class="space-y-2">
      <input type="text" id="prod-name" placeholder="Product name" required class="w-full p-2 border rounded" />
      <input type="number" id="prod-price" placeholder="Price" required class="w-full p-2 border rounded" />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
    </form>
    <p id="admin-status" class="text-green-700 mt-2"></p>
  `;

  root.appendChild(adminDiv);

  const form = document.getElementById('product-form');
  const status = document.getElementById('admin-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const price = parseInt(document.getElementById('prod-price').value);

    const { error } = await supabase.from('products').insert([{ name, price }]);
    if (error) {
      status.textContent = "❌ Error adding product.";
    } else {
      status.textContent = "✅ Product added.";
      loadApp(); // reload updated list
    }
  });
}
// main.js – Part 4 of 4

async function loadApp() {
  const products = await fetchProducts();
  renderProducts(products);
  renderAdminPanel(); // admin always shown in current version
}

loadApp();
