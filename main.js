// Pratham Custom Studio – Final Polished Smart WebApp (main.js) import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://dgnmnyazzlmcqhbgvjfp.supabase.co'; const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for security const supabase = createClient(supabaseUrl, supabaseKey);

const root = document.getElementById('root');

function formatINR(price) { return ₹${price}; }

async function fetchProducts() { const { data, error } = await supabase.from('products').select('*'); if (error) { console.error('Error fetching products:', error); return []; } return data || []; }

function renderProducts(products) { root.innerHTML = <h1 class="text-3xl font-bold mb-2">🏍️ Pratham – Custom Studio</h1> <input type="text" id="search-bar" placeholder="Search product..." class="mb-4 w-full p-2 border rounded" /> <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>;

const listEl = document.getElementById('product-list'); const searchInput = document.getElementById('search-bar');

let filteredProducts = [...products];

function displayFiltered(productsToDisplay) { listEl.innerHTML = ''; if (!productsToDisplay.length) { listEl.innerHTML = <div class="text-center text-gray-500 text-lg py-10 w-full col-span-3">📍 No matching products.</div>; return; }

productsToDisplay.forEach(product => {
  const isAffiliate = product.affiliate_url && product.affiliate_url.length > 5;
  const card = document.createElement('div');
  card.className = "bg-white rounded-xl shadow-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl";

  card.innerHTML = `
    ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="w-full h-52 object-cover rounded-lg mb-3" />` : ''}
    <div class="flex flex-col justify-between h-full">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-1">${product.name}</h2>
        <p class="text-gray-600 text-sm mb-2">${formatINR(product.price)}</p>
      </div>
      <div class="flex justify-between gap-2 mt-auto">
        ${isAffiliate ? `
          <a href="${product.affiliate_url}" target="_blank" class="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded text-sm text-center">Buy Now</a>
        ` : `
          <button class="bg-green-600 hover:bg-green-700 transition text-white px-3 py-1 rounded text-sm" onclick="orderOnWhatsApp('${product.name}', ${product.price})">Order</button>
          <button class="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded text-sm" onclick="deleteProduct(${product.id})">Delete</button>
        `}
      </div>
    </div>
  `;

  listEl.appendChild(card);
});

}

displayFiltered(filteredProducts);

searchInput.addEventListener('input', (e) => { const query = e.target.value.toLowerCase(); const filtered = products.filter(p => p.name.toLowerCase().includes(query)); displayFiltered(filtered); }); }

window.orderOnWhatsApp = function(productName, price) { const msg = encodeURIComponent(Hi, I'm interested in:\n${productName} – ₹${price}); window.open(https://wa.me/919722609460?text=${msg}, '_blank'); };

function renderAdminPanel() { const adminDiv = document.createElement('div'); adminDiv.className = "mt-10 p-4 bg-yellow-100 rounded"; adminDiv.innerHTML = <h2 class="text-2xl font-bold mb-2">🛠 Admin Panel</h2> <form id="product-form" class="space-y-2"> <input type="text" id="prod-name" placeholder="Product name" required class="w-full p-2 border rounded" /> <input type="number" id="prod-price" placeholder="Price" required class="w-full p-2 border rounded" /> <input type="url" id="prod-affiliate" placeholder="Affiliate URL (optional)" class="w-full p-2 border rounded" /> <input type="file" id="prod-image" accept="image/*" class="w-full p-2 border rounded" /> <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button> </form> <p id="admin-status" class="text-green-700 mt-2"></p>;

root.appendChild(adminDiv);

const form = document.getElementById('product-form'); const status = document.getElementById('admin-status');

form.addEventListener('submit', async (e) => { e.preventDefault(); const name = document.getElementById('prod-name').value; const price = parseInt(document.getElementById('prod-price').value); const affiliate_url = document.getElementById('prod-affiliate').value; const imageFile = document.getElementById('prod-image').files[0];

let imageUrl = '';
if (imageFile) {
  const filePath = `${Date.now()}_${imageFile.name}`;
  const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
  if (uploadError) {
    status.textContent = "❌ Image upload failed.";
    return;
  }
  const { publicURL } = supabase.storage.from('product-images').getPublicUrl(filePath);
  imageUrl = publicURL;
}

const { error } = await supabase.from('products').insert([{ name, price, image_url: imageUrl, affiliate_url }]);
if (error) {
  status.textContent = "❌ Error adding product.";
} else {
  status.textContent = "✅ Product added.";
  loadApp();
}

}); }

async function loadApp() { root.innerHTML = <div class="text-center py-10 text-gray-500 text-lg animate-pulse">🔄 Loading products...</div>; const products = await fetchProducts(); renderProducts(products); renderAdminPanel(); }

loadApp();

window.deleteProduct = async function (id) { const confirmDelete = confirm("Are you sure you want to delete this product?"); if (!confirmDelete) return; const { error } = await supabase.from('products').delete().eq('id', id); if (!error) { alert('✅ Product deleted successfully'); loadApp(); } };

// 🌙 Dark Mode Toggle const toggleBtn = document.getElementById('darkToggle'); toggleBtn?.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('DOMContentLoaded', () => { if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark'); } });

// 🤖 Smart Assistant const helpBtn = document.createElement('button'); helpBtn.innerHTML = '🤖 Help'; helpBtn.className = 'fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg z-50'; document.body.appendChild(helpBtn);

const chatBox = document.createElement('div'); chatBox.className = 'fixed bottom-20 right-4 w-72 bg-white rounded-lg shadow-lg p-4 text-sm border border-gray-200 z-50 hidden'; chatBox.innerHTML = `

  <h2 class="text-base font-semibold mb-2">💬 Need Help?</h2>
  <ul class="space-y-2">
    <li>📦 Delivery in 3–5 days</li>
    <li>📏 Size chart on WhatsApp</li>
    <li>🧵 Custom stitching available</li>
    <li>💬 Chat with us now</li>
  </ul>
  <button onclick="window.open('https://wa.me/919722609460','_blank')" class="mt-3 w-full bg-green-600 text-white py-1 rounded">
    WhatsApp Chat
  </button>
`;
document.body.appendChild(chatBox);helpBtn.addEventListener('click', () => { chatBox.classList.toggle('hidden'); });

