// Klasör İçindeki Yerel Görseller
const products = [
    {
        id: 1,
        title: "Doğal Karakovan Balı (1 KG)",
        desc: "Kahramanmaraş Andırın tesislerimizde tamamen doğal arı petekleriyle üretilmiş 1 kg katıksız karakovan balı.",
        price: 2000,
        image: "img/Bal.jpg"
    },
    {
        id: 2,
        title: "Taze Arı Poleni (1 KG)",
        desc: "İklim kontrollü çiçek bahçelerimizden mevsiminde özenle toplanmış 1 kg taze polen.",
        price: 2500,
        image: "img/polen.jpg"
    },
    {
        id: 3,
        title: "Saf Arı Sütü (40 Gram)",
        desc: "Yüksek besin değerine sahip, soğuk zincir korumasıyla paketlenmiş 40 gram saf kraliçe arı sütü.",
        price: 4500,
        image: "img/ari-sutu.jpg"
    }
];

let cart = [];

// DOM Bağlantıları
const homeProductList = document.getElementById('homeProductList');
const fullProductList = document.getElementById('fullProductList');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const checkoutModal = document.getElementById('checkoutModal');
const modalTotalAmount = document.getElementById('modalTotalAmount');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// Ürün Kartları
function createProductCardHTML(product) {
    return `
        <div class="card product-card">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'">
            <div class="product-details">
                <h3>${product.title}</h3>
                <p>${product.desc}</p>
                <div class="product-footer">
                    <span class="price">${product.price.toLocaleString('tr-TR')} ₺</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Sepete Ekle</button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    const htmlContent = products.map(p => createProductCardHTML(p)).join('');
    if (homeProductList) homeProductList.innerHTML = htmlContent;
    if (fullProductList) fullProductList.innerHTML = htmlContent;
}

// Sayfa Geçişleri
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.style.opacity = 0;
        setTimeout(() => {
            page.classList.remove('active');
            if (page.id === `page-${pageId}`) {
                page.classList.add('active');
                setTimeout(() => {
                    page.style.opacity = 1;
                }, 50);
            }
        }, 200);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToContact(event) {
    event.preventDefault();
    const contactSection = document.getElementById('iletisim');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Sepet
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        openCartDrawer();
    }
}

function updateCart() {
    cartBadge.innerText = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Sepetiniz boş.</p>';
        cartTotal.innerText = '0 ₺';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.title}</strong>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${item.price.toLocaleString('tr-TR')} ₺</div>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color: #ff5555; cursor:pointer;">Sil</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.innerText = `${total.toLocaleString('tr-TR')} ₺`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function openCartDrawer() {
    cartDrawer.classList.add('active');
    overlay.classList.add('active');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    if (!checkoutModal.classList.contains('active')) {
        overlay.classList.remove('active');
    }
}

// Formatlama ve Kart Animasyonları
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
    }
    input.value = formatted;
}

function formatExpDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

function updateCardDetails() {
    const holder = document.getElementById('inputHolder').value;
    const number = document.getElementById('inputNumber').value;
    const exp = document.getElementById('inputExp').value;
    const cvc = document.getElementById('inputCvc').value;

    document.getElementById('cardHolderDisplay').innerText = holder ? holder.toUpperCase() : 'AD SOYAD';
    document.getElementById('cardNumDisplay').innerText = number ? number : '•••• •••• •••• ••••';
    document.getElementById('cardExpDisplay').innerText = exp ? exp : 'MM/YY';
    document.getElementById('cardCvcDisplay').innerText = cvc ? cvc : '•••';
}

function flipCard(isBack) {
    const card = document.getElementById('creditCard');
    if (isBack) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
}

// Model Yönetimi
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Sepetiniz boş! Lütfen ürün ekleyin.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    modalTotalAmount.innerText = `${total.toLocaleString('tr-TR')} ₺`;

    closeCartDrawer();
    checkoutModal.classList.add('active');
    overlay.classList.add('active');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
    flipCard(false);
}

function handleCheckout(event) {
    event.preventDefault();
    alert('Siparişiniz alındı! Kahramanmaraş Andırın tesislerimizden özel ambalajlı olarak kargoya verilecektir.');

    cart = [];
    updateCart();
    closeCheckoutModal();
    document.getElementById('checkoutForm').reset();
    updateCardDetails();
}

cartBtn.addEventListener('click', openCartDrawer);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', () => {
    closeCartDrawer();
    closeCheckoutModal();
});