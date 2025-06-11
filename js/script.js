function orderELements(event, sortBy) {
  console.log(sortBy);
  var cardWrapper = document.querySelector('.swiper-wrapper');
  var cards = Array.from(cardWrapper.querySelectorAll('.swiper-slide'));

  switch (sortBy) {
    case 'nombre':
      cards.sort((a, b) => {
        const nameA = productData[a.dataset.productId]?.name?.toLowerCase() || '';
        const nameB = productData[b.dataset.productId]?.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      break;
	 case 'region':
      cards.sort((a, b) => {
        const nameA = productData[a.dataset.productId]?.region?.toLowerCase() || '';
        const nameB = productData[b.dataset.productId]?.region?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      break;
	 case 'pais':
      cards.sort((a, b) => {
        const nameA = productData[a.dataset.productId]?.pais?.toLowerCase() || '';
        const nameB = productData[b.dataset.productId]?.pais?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      break;
	 case 'elaborador':
      cards.sort((a, b) => {
        const nameA = productData[a.dataset.productId]?.elaborador?.toLowerCase() || '';
        const nameB = productData[b.dataset.productId]?.elaborador?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      break;
    case 'precio':
      cards.sort((a, b) => {
        const priceA = parseFloat(productData[a.dataset.productId]?.precio || 0);
        const priceB = parseFloat(productData[b.dataset.productId]?.precio || 0);
        return priceA - priceB;
      });
      break;
    case 'tipo':
      cards.sort((a, b) => {
        const typeA = productData[a.dataset.productId]?.tipo || '';
        const typeB = productData[b.dataset.productId]?.tipo || '';
        return typeA.localeCompare(typeB);
      });
      break;
    case 'tam':
      cards.sort((a, b) => {
        const tamA = parseInt(productData[a.dataset.productId]?.tam.replace(/\D/g, ''), 10) || 0;
        const tamB = parseInt(productData[b.dataset.productId]?.tam.replace(/\D/g, ''), 10) || 0;
        return tamA - tamB;
      });
      break;
    case 'defecto':
      cards.sort((a, b) => {
        const orderA = a.getAttribute("data-product-id");
        const orderB = b.getAttribute("data-product-id");
        return orderA - orderB;
      });
      break;
    case 'recomendado':
      cards.sort((a, b) => {
        const recomendA = parseFloat(productData[a.dataset.productId]?.recomend || 0);
        const recomendB = parseFloat(productData[b.dataset.productId]?.recomend || 0);
        return recomendB - recomendA; // Descending order
      });
      break;
    default:
      return;
  }

  // Reorder elements in the wrapper
  cardWrapper.innerHTML = '';
  cards.forEach((card, index) => {
    cardWrapper.appendChild(card);
    card.setAttribute('aria-label', `${index + 1} / ${cards.length}`);
    card.setAttribute('data-swiper-slide-index', index.toString());
  });
}
document.getElementById("vista").addEventListener("change", function() {
    const selectedView = this.value;
    const billboard = document.getElementById("billboard");
	const floor = document.getElementById("floorimage");
    const floorImage = document.getElementById("floorimage").querySelector("img");

    switch (selectedView) {
        case "defecto":
        case "madera": // Vista Madera
            billboard.style.backgroundImage = "url(https://winelist.seleccionxxi.com/selector/images/fondoirene1.png)";
            floorImage.src = "https://winelist.seleccionxxi.com/selector/images/floorirene1.png";
            break;

        case "blanca": // Vista Blanca
            billboard.style.backgroundImage = "none"; // Set white background
            billboard.style.backgroundColor = "#FFFFFF"; 
            floorImage.src = "https://winelist.seleccionxxi.com/selector/images/FONDOwhite.jpg"; // Change floor to grey
			floor.style.filter = "none";
            break;

        default:
            console.log("Invalid view selection.");
    }
});