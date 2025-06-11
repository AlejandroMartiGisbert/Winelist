// Store active filters
let activeFilters = {
    pais: null,
    region: null,
    tipo: null,
    tam: null,
    elaborador: null
};

// Normalizing function to standardize comparisons
function normalizeString(str) {
    return str ? str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

// Normalizing function for consistent comparisons
function normalizeString(str) {
    return str ? str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

// Event listeners for filter selection
document.querySelectorAll('.dropdown-menu a').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const filterCategory = this.closest('.dropdown').querySelector('.nav-link');
        const filterKey = filterCategory.id.replace("dropdown", "").toLowerCase();
        const filterValue = this.textContent.trim();

        // Update active filters
        activeFilters[filterKey] = filterValue.toLowerCase() === "todo" ? null : filterValue;

        // Toggle 'active' class based on whether a filter is applied
        if (activeFilters[filterKey]) {
            filterCategory.classList.add("active");
        } else {
            filterCategory.classList.remove("active");
        }

        filterProducts(); // Apply filters
    });
});

function normalizeString(str) {
    return typeof str === "string" 
        ? str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        : "";
}

// Store price range filters
let priceFilters = {
    min: 0,
    max: 500
};

// Update displayed price when user changes range inputs
function updatePrice(value) {
    document.getElementById("priceValue").textContent = value;
    priceFilters.min = parseFloat(value);
    filterProducts(); // Apply price filter along with existing filters
}

function updatePrice2(value) {
    document.getElementById("priceValue2").textContent = value;
    priceFilters.max = parseFloat(value);
    filterProducts(); // Apply price filter
}

// Modify filtering function to include price range check
function filterProducts() {
    document.querySelectorAll('.swiper-slide').forEach(product => {
        const productId = product.getAttribute('data-product-id'); 
        const productDataItem = productData[productId]; 

        if (!productDataItem) return; // Skip filtering if product data is missing

        let hiddenReason = []; // Store mismatch reasons

        const isVisible = Object.entries(activeFilters).every(([key, value]) => {
            const productValue = productDataItem[key] ? normalizeString(productDataItem[key]) : null;
            const filterValue = value ? normalizeString(value) : null;

            const matches = !filterValue || productValue === filterValue;

            if (!matches) {
                hiddenReason.push(`❌ Filter '${key}': Expected '${filterValue}', Found '${productValue}'`);
            }

            return matches;
        });

        // Price filtering logic
        const productPrice = parseFloat(productDataItem.precio);
        const withinPriceRange = productPrice >= priceFilters.min && productPrice <= priceFilters.max;

        if (!withinPriceRange) {
            hiddenReason.push(`❌ Price Filter: Expected between ${priceFilters.min}€ - ${priceFilters.max}€, Found ${productPrice}€`);
        }

        product.style.display = isVisible && withinPriceRange ? "block" : "none"; // Show/hide product

        if (!isVisible || !withinPriceRange) {
            console.log(`🔍 Hiding '${productDataItem.name}':\n${hiddenReason.join("\n")}`);
        }
    });

    document.querySelector('.main-swiper').swiper.update(); // Refresh Swiper
}
let mode = "slides"; // Default mode

// Function to get search parameter from URL
function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("s") ? normalizeString(params.get("s")) : null;
}

// Function to filter products based on search query
function filterBySearch() {
    const searchQuery = getSearchQuery();
    
    document.querySelectorAll('.swiper-slide').forEach(product => {
        const productId = product.getAttribute('data-product-id'); 
        const productDataItem = productData[productId]; 

        if (!productDataItem) return; // Skip filtering if product data is missing

        let matchesSearch = true;

        // Special search cases
		switch (searchQuery) {
			case "reco": // Recomendados (Products with ★)
				matchesSearch = product.querySelector(".item-anchor span")?.textContent.includes("★");
				break;
			case "top": // Más vendidos (Top 10 products, fetched via PHP)
				matchesSearch = topSellingProducts.includes(productId);
				break;
			case "new": // Novedades (Highest data-referencia)
				matchesSearch = newProducts.includes(productId);
				break;
			case "limit": // Limitados (Lowest stock)
				matchesSearch = limitedStockProducts.includes(productId);
				break;
			case "mejores": // Top wines (Lower than median price & high sales)
				matchesSearch = parseFloat(productDataItem.precio) < medianPrice &&
								topSellingProducts.includes(productId);
				break;
			case "eco": // Económicos (Lower than median price)
				matchesSearch = parseFloat(productDataItem.precio) < medianPrice;
				break;
			default:
				matchesSearch = searchQuery ? Object.values(productDataItem).some(value =>
					normalizeString(value).includes(searchQuery)
				) : true;
		}

        product.style.display = matchesSearch ? "block" : "none";

        if (!matchesSearch) {
            console.log(`🔍 Hiding '${productDataItem.name}': No match for search '${searchQuery}'`);
        }
    });

    document.querySelector('.main-swiper').swiper.update(); // Refresh Swiper
}

// Run search filter on page load
document.addEventListener("DOMContentLoaded", filterBySearch);
