// Admin credentials (hardcoded)
const ADMIN_PASSWORD = "gta5admin123";

// Discord Bot Integration
// Instructions: 
// 1. Create Discord bot at https://discord.com/developers/applications
// 2. Copy your Bot Client ID
// 3. Create Discord server and get invite link
// 4. Update these values:
const DISCORD_BOT_ID = "1444760752467611791"; // Get from Developer Portal
const DISCORD_SERVER_INVITE = "https://discord.gg/55uqucry2M"; // Create server invite link
const DISCORD_REDIRECT_URI = "https://driizzyy.github.io/modded-gta-5-accounts/"; // Your website URL

// Products data
let products = [
    {
        id: 1,
        name: "GTA 5 Legacy",
        edition: "Legacy",
        platform: "Steam",
        price: 29.99,
        status: "available",
        description: "Modded Legacy account for Steam",
        features: [
            "Steam Account Login Details",
            "Full Email Access",
            "$100 Million In-Game",
            "Level 1000",
            "Unlock All",
            "Modded Cars & Outfits"
        ]
    },
    {
        id: 2,
        name: "GTA 5 Legacy",
        edition: "Legacy",
        platform: "Rockstar Games Launcher",
        price: 34.99,
        status: "available",
        description: "Modded Legacy account for Rockstar Games Launcher",
        features: [
            "Rockstar Account Login Details",
            "Full Email Access",
            "$100 Million In-Game",
            "Level 1000",
            "Unlock All",
            "Modded Cars & Outfits"
        ]
    },
    {
        id: 3,
        name: "GTA 5 Enhanced",
        edition: "Enhanced",
        platform: "Steam",
        price: 44.99,
        status: "available",
        description: "Modded Enhanced account for Steam",
        features: [
            "Steam Account Login Details",
            "Full Email Access",
            "$100 Million In-Game",
            "Level 1000",
            "Unlock All",
            "Modded Cars & Outfits"
        ]
    },
    {
        id: 4,
        name: "GTA 5 Enhanced",
        edition: "Enhanced",
        platform: "Rockstar Games Launcher",
        price: 49.99,
        status: "available",
        description: "Modded Enhanced account for Rockstar Games Launcher",
        features: [
            "Rockstar Account Login Details",
            "Full Email Access",
            "$100 Million In-Game",
            "Level 1000",
            "Unlock All",
            "Modded Cars & Outfits"
        ]
    }
];

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    loadAdminData();
    
    // Clean up old purchase sessions (older than 1 hour)
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('purchase_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (now - data.timestamp > 3600000) { // 1 hour
                    localStorage.removeItem(key);
                }
            } catch (e) {
                localStorage.removeItem(key);
            }
        }
    }
});

// Load products from localStorage
function loadProducts() {
    const saved = localStorage.getItem("gta5_products");
    if (saved) {
        products = JSON.parse(saved);
    }
    renderProducts();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem("gta5_products", JSON.stringify(products));
    renderProducts();
}

// Render products on the page
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let statusClass = "status-available";
        if (product.status === "out-of-stock") {
            statusClass = "status-out-of-stock";
        } else if (product.status === "removed") {
            statusClass = "status-removed";
        }

        // Build features list
        let featuresList = '<ul class="product-features">';
        if (product.features && Array.isArray(product.features)) {
            product.features.forEach(feature => {
                featuresList += `<li>${feature}</li>`;
            });
        }
        featuresList += '</ul>';

        // Determine button state
        let buttonHTML = '';
        if (product.status === "available") {
            buttonHTML = `
                <div class="product-actions">
                    <a href="discord://${DISCORD_BOT_ID}" class="btn-discord" onclick="handleDiscordPurchase(event, ${product.id})">
                        💜 Purchase on Discord
                    </a>
                </div>
            `;
        } else if (product.status === "out-of-stock") {
            buttonHTML = `
                <div class="product-actions">
                    <button class="btn-disabled" disabled>Out of Stock</button>
                </div>
            `;
        } else if (product.status === "removed") {
            buttonHTML = `
                <div class="product-actions">
                    <button class="btn-disabled" disabled>Temporarily Unavailable</button>
                </div>
            `;
        }

        card.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="product-edition">${product.edition}</div>
            <div class="product-platform">${product.platform}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-includes">
                <h3>What's Included:</h3>
                ${featuresList}
            </div>
            <div class="product-status ${statusClass}">
                ${product.status === "out-of-stock" ? "OUT OF STOCK" : 
                  product.status === "removed" ? "TEMPORARILY REMOVED" : 
                  "AVAILABLE"}
            </div>
            ${buttonHTML}
        `;

        grid.appendChild(card);
    });
}

// Handle Discord purchase redirect
function handleDiscordPurchase(event, productKey) {
    event.preventDefault();
    
    if (DISCORD_SERVER_INVITE === "https://discord.gg/55uqucry2M" || 
        DISCORD_SERVER_INVITE.includes("YOUR_INVITE")) {
        alert("❌ Discord integration not configured yet.\n\nTo fix this:\n1. Create a Discord server\n2. Create an invite link\n3. Ask the store owner to add it to the website configuration");
        return;
    }
    
    // Find the product being purchased
    const product = products.find(p => {
        if (p.name.includes("Legacy") && p.name.includes("Steam")) return productKey === 1;
        if (p.name.includes("Legacy") && p.name.includes("Rockstar")) return productKey === 2;
        if (p.name.includes("Enhanced") && p.name.includes("Steam")) return productKey === 3;
        if (p.name.includes("Enhanced") && p.name.includes("Rockstar")) return productKey === 4;
    });
    
    if (!product) return;
    
    // Store the selected product in localStorage for the bot to detect
    const productMap = {
        1: 'legacy-steam',
        2: 'legacy-rockstar',
        3: 'enhanced-steam',
        4: 'enhanced-rockstar'
    };
    
    // Show user info
    alert(`🎮 Opening Discord server...\n\nProduct: ${product.name}\nPrice: $${product.price}\n\nYour ticket will be created automatically!`);
    
    // Redirect to Discord server
    window.open(DISCORD_SERVER_INVITE, '_blank');
}

// Toggle admin panel
function toggleAdminPanel() {
    const modal = document.getElementById("adminModal");
    modal.classList.toggle("active");
    
    // Reset login form if closing
    if (!modal.classList.contains("active")) {
        resetAdminPanel();
    }
}

// Admin login
function adminLogin() {
    const password = document.getElementById("adminPassword").value;
    const errorMsg = document.getElementById("loginError");

    if (password === ADMIN_PASSWORD) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        renderAdminDashboard();
        errorMsg.textContent = "";
    } else {
        errorMsg.textContent = "Invalid password!";
    }
}

// Admin logout
function adminLogout() {
    resetAdminPanel();
    toggleAdminPanel();
}

// Reset admin panel
function resetAdminPanel() {
    document.getElementById("loginSection").style.display = "flex";
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("adminPassword").value = "";
    document.getElementById("loginError").textContent = "";
}

// Render admin dashboard
function renderAdminDashboard() {
    const controls = document.getElementById("adminControls");
    controls.innerHTML = "";

    products.forEach(product => {
        const control = document.createElement("div");
        control.className = "product-control";
        
        control.innerHTML = `
            <h4>${product.name} - ${product.platform}</h4>
            
            <div class="control-row">
                <div class="control-group">
                    <label for="price_${product.id}">Price ($)</label>
                    <input type="number" id="price_${product.id}" value="${product.price}" step="0.01" min="0" />
                </div>
                
                <div class="control-group">
                    <label for="status_${product.id}">Status</label>
                    <select id="status_${product.id}">
                        <option value="available" ${product.status === "available" ? "selected" : ""}>Available</option>
                        <option value="out-of-stock" ${product.status === "out-of-stock" ? "selected" : ""}>Out of Stock</option>
                        <option value="removed" ${product.status === "removed" ? "selected" : ""}>Temporarily Removed</option>
                    </select>
                </div>
            </div>
            
            <div class="control-row full">
                <div class="control-group">
                    <button onclick="updateProduct(${product.id})">Save Changes</button>
                </div>
            </div>
        `;

        controls.appendChild(control);
    });
}

// Update product
function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newPrice = parseFloat(document.getElementById(`price_${productId}`).value);
    const newStatus = document.getElementById(`status_${productId}`).value;

    if (isNaN(newPrice) || newPrice < 0) {
        alert("Invalid price!");
        return;
    }

    product.price = newPrice;
    product.status = newStatus;

    saveProducts();
    renderAdminDashboard();
    alert("Product updated successfully!");
}

// Load admin data on page load
function loadAdminData() {
    // This function loads the initial admin data
    // Currently just uses defaults, but could load from server
}

// Allow Enter key to submit login
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("adminPassword");
    if (passwordInput) {
        passwordInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                adminLogin();
            }
        });
    }
});
