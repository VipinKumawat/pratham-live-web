// main.js – Part 1 of 4
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://dgnmnyazzlmcqhbgvjfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbm1ueWF6emxtY3FoYmd2amZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjQ0MjcsImV4cCI6MjA2NzU0MDQyN30.VvgmXWbj7_4i0l3HsBTauapY9bO6A6cEO6Rv3oEWTr4';

const supabase = createClient(supabaseUrl, supabaseKey);

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
  ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="w-full h-52 object-cover rounded-t-lg mb-3 shadow-sm" />` : ''}
  <div class="flex flex-col justify-between h-full">
    <div>
      <h2 class="text-lg font-semibold text-gray-800 mb-1">${product.name}</h2>
      <p class="text-gray-600 text-sm mb-2">${formatINR(product.price)}</p>
    </div>
    <div class="flex justify-between gap-2 mt-auto">
      <button class="bg-green-600 hover:bg-green-700 transition text-white px-3 py-1 rounded text-sm" onclick="orderOnWhatsApp('${product.name}', ${product.price})">
        Order
      </button>
      <button class="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded text-sm" onclick="deleteProduct(${product.id})">
        Delete
      </button>
    </div>
  </div>
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
      <input type="file" id="prod-image" accept="image/*" class="w-full p-2 border rounded" />
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
    const imageFile = document.getElementById('prod-image').files[0];

    let imageUrl = '';

    if (imageFile) {
      const filePath = `${Date.now()}_${imageFile.name}`;
      const { data, error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        status.textContent = "❌ Image upload failed.";
        return;
      }

      const { publicURL } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      imageUrl = publicURL;
    }

    const { error } = await supabase.from('products').insert([{ name, price, image_url: imageUrl }]);

    if (error) {
      status.textContent = "❌ Error adding product.";
    } else {
      status.textContent = "✅ Product added.";
      loadApp(); // refresh
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
// 🗑 Delete product function
window.deleteProduct = async function (id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    alert('❌ Failed to delete product');
  } else {
    alert('✅ Product deleted successfully');
    loadApp(); // refresh product list
  }
};