/* =====================================================
   IMRAN SHOP - E-COMMERCE
   Main JavaScript
   Stable + Product Details + Checkout + Orders
   + Order Management
===================================================== */


/* ================= PRODUCT CATEGORIES ================= */

const categories = [
    {
        name: "ইলেকট্রনিক্স",
        icon: "📱"
    },
    {
        name: "ফ্যাশন",
        icon: "👕"
    },
    {
        name: "গ্রোসারি",
        icon: "🛒"
    },
    {
        name: "হোম & লিভিং",
        icon: "🏠"
    },
    {
        name: "কসমেটিকস",
        icon: "💄"
    },
    {
        name: "অন্যান্য",
        icon: "🎁"
    }
];


/* ================= PRODUCTS ================= */

const products = [
    {
        id: 1,
        name: "স্মার্টফোন",
        category: "ইলেকট্রনিক্স",
        price: 15999,
        oldPrice: 17999,
        icon: "📱",
        description: "আধুনিক ডিজাইনের সুন্দর ও প্রয়োজনীয় স্মার্টফোন।"
    },
    {
        id: 2,
        name: "ব্লুটুথ হেডফোন",
        category: "ইলেকট্রনিক্স",
        price: 1299,
        oldPrice: 1599,
        icon: "🎧",
        description: "সুন্দর সাউন্ড ও আরামদায়ক ব্যবহারের জন্য ব্লুটুথ হেডফোন।"
    },
    {
        id: 3,
        name: "ক্যাজুয়াল টি-শার্ট",
        category: "ফ্যাশন",
        price: 699,
        oldPrice: 899,
        icon: "👕",
        description: "দৈনন্দিন ব্যবহারের জন্য আরামদায়ক ক্যাজুয়াল টি-শার্ট।"
    },
    {
        id: 4,
        name: "ফ্যাশন ব্যাগ",
        category: "ফ্যাশন",
        price: 1199,
        oldPrice: 1499,
        icon: "👜",
        description: "স্টাইলিশ ডিজাইনের সুন্দর ফ্যাশন ব্যাগ।"
    },
    {
        id: 5,
        name: "প্রিমিয়াম চাল ৫ কেজি",
        category: "গ্রোসারি",
        price: 650,
        oldPrice: 720,
        icon: "🍚",
        description: "পরিবারের দৈনন্দিন ব্যবহারের জন্য প্রিমিয়াম চাল।"
    },
    {
        id: 6,
        name: "কিচেন সেট",
        category: "হোম & লিভিং",
        price: 899,
        oldPrice: 1099,
        icon: "🍳",
        description: "রান্নাঘরের প্রয়োজনীয় সুন্দর কিচেন সেট।"
    },
    {
        id: 7,
        name: "বিউটি কেয়ার সেট",
        category: "কসমেটিকস",
        price: 799,
        oldPrice: 999,
        icon: "💄",
        description: "দৈনন্দিন ব্যবহারের জন্য প্রয়োজনীয় বিউটি কেয়ার সেট।"
    },
    {
        id: 8,
        name: "স্টাইলিশ ঘড়ি",
        category: "অন্যান্য",
        price: 999,
        oldPrice: 1299,
        icon: "⌚",
        description: "আধুনিক ও স্টাইলিশ ডিজাইনের ঘড়ি।"
    }
];


/* ================= DELIVERY ================= */

const SAME_DISTRICT = "যশোর";
const SAME_DISTRICT_DELIVERY_CHARGE = 80;
const OTHER_DISTRICT_DELIVERY_CHARGE = 150;


/* ================= STORAGE ================= */

const CART_STORAGE_KEY = "imranShopCart";
const ORDERS_STORAGE_KEY = "imranShopOrders";


/* ================= STATE ================= */

let cart = [];

try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart;
        }
    }
} catch (error) {
    cart = [];
}

let activeCategory = "সব";

let selectedProductId = null;
let modalQuantity = 1;

let checkoutOpenedFromBuyNow = false;


/* ================= DOM ================= */

const $ = (id) => document.getElementById(id);


/* ================= MONEY ================= */

function formatMoney(amount) {
    return "৳" + Number(amount || 0).toLocaleString("bn-BD");
}


/* ================= DELIVERY CALCULATION ================= */

function getDeliveryCharge(district) {

    const selectedDistrict = String(district || "").trim();

    if (!selectedDistrict) {
        return 0;
    }

    if (selectedDistrict === SAME_DISTRICT) {
        return SAME_DISTRICT_DELIVERY_CHARGE;
    }

    return OTHER_DISTRICT_DELIVERY_CHARGE;
}


/* ================= SAVE CART ================= */

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Cart save error:", error);
    }
}


/* ================= CATEGORY RENDER ================= */

function renderCategories() {

    const categoryGrid = $("categoryGrid");

    if (!categoryGrid) {
        return;
    }

    categoryGrid.innerHTML = categories.map(category => {

        const activeClass =
            activeCategory === category.name
                ? "active"
                : "";

        return `
            <button
                type="button"
                class="category-card ${activeClass}"
                data-category="${escapeHtml(category.name)}"
            >
                <span class="category-icon">
                    ${category.icon}
                </span>

                <strong>
                    ${escapeHtml(category.name)}
                </strong>

                <small>
                    ${products.filter(
                        product =>
                            product.category === category.name
                    ).length} পণ্য
                </small>
            </button>
        `;

    }).join("");
}


/* ================= FILTER RENDER ================= */

function renderFilters() {

    const filterRow = $("filterRow");

    if (!filterRow) {
        return;
    }

    const filterCategories = [
        "সব",
        ...categories.map(category => category.name)
    ];

    filterRow.innerHTML = filterCategories.map(category => {

        const activeClass =
            activeCategory === category
                ? "active"
                : "";

        return `
            <button
                type="button"
                class="filter-button ${activeClass}"
                data-filter="${escapeHtml(category)}"
            >
                ${escapeHtml(category)}
            </button>
        `;

    }).join("");
}


/* ================= PRODUCT RENDER ================= */

function renderProducts() {

    const productGrid = $("productGrid");

    if (!productGrid) {
        return;
    }

    const searchInput = $("searchInput");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            activeCategory === "সব" ||
            product.category === activeCategory;

        const matchesSearch =
            !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });


    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <div class="empty-state">
                <div>🔎</div>
                <h3>কোনো পণ্য পাওয়া যায়নি</h3>
                <p>অন্য কোনো নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।</p>
            </div>
        `;

        return;
    }


    productGrid.innerHTML = filteredProducts.map(product => {

        return `
            <article class="product-card">

                <button
                    type="button"
                    class="product-image-button"
                    data-product-details="${product.id}"
                >
                    <div class="product-image">
                        ${product.icon}
                    </div>
                </button>

                <div class="product-card-content">

                    <span class="product-category">
                        ${escapeHtml(product.category)}
                    </span>

                    <h3>
                        ${escapeHtml(product.name)}
                    </h3>

                    <div class="price-row">
                        <strong>
                            ${formatMoney(product.price)}
                        </strong>

                        <del>
                            ${formatMoney(product.oldPrice)}
                        </del>
                    </div>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="btn btn-outline btn-small"
                            data-product-details="${product.id}"
                        >
                            👁️ বিস্তারিত
                        </button>

                        <button
                            type="button"
                            class="btn btn-primary btn-small"
                            data-add-cart="${product.id}"
                        >
                            🛒 যোগ করুন
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");
}


/* ================= PRODUCT MODAL ================= */

function openProductModal(productId) {

    const product =
        products.find(
            item => item.id === Number(productId)
        );

    if (!product) {
        return;
    }

    selectedProductId = product.id;
    modalQuantity = 1;

    $("modalProductImage").textContent = product.icon;
    $("modalProductCategory").textContent = product.category;
    $("modalProductName").textContent = product.name;
    $("modalProductPrice").textContent = formatMoney(product.price);
    $("modalProductOldPrice").textContent = formatMoney(product.oldPrice);
    $("modalProductDescription").textContent = product.description;
    $("modalQuantity").textContent = modalQuantity;

    $("productModalOverlay").classList.add("show");

    document.body.classList.add("modal-open");
}


function closeProductModal() {

    $("productModalOverlay").classList.remove("show");

    document.body.classList.remove("modal-open");

    selectedProductId = null;
    modalQuantity = 1;
}


function updateModalQuantity(change) {

    modalQuantity += Number(change);

    if (modalQuantity < 1) {
        modalQuantity = 1;
    }

    if (modalQuantity > 99) {
        modalQuantity = 99;
    }

    $("modalQuantity").textContent = modalQuantity;
}


/* ================= CART ================= */

function addToCart(productId, quantity = 1) {

    const id = Number(productId);

    const product =
        products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(item => Number(item.productId) === id);

    if (existingItem) {
        existingItem.quantity += Number(quantity);
    } else {
        cart.push({
            productId: id,
            quantity: Number(quantity)
        });
    }

    saveCart();
    renderCart();

    showMessage(
        `${product.name} কার্টে যোগ হয়েছে`
    );
}


function changeCartQuantity(productId, change) {

    const item =
        cart.find(
            cartItem =>
                Number(cartItem.productId) === Number(productId)
        );

    if (!item) {
        return;
    }

    item.quantity += Number(change);

    if (item.quantity <= 0) {
        cart =
            cart.filter(
                cartItem =>
                    Number(cartItem.productId) !== Number(productId)
            );
    }

    saveCart();
    renderCart();
}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                Number(item.productId) !== Number(productId)
        );

    saveCart();
    renderCart();
}


function getCartTotals() {

    let subtotal = 0;
    let itemCount = 0;

    const validItems = [];

    cart.forEach(cartItem => {

        const product =
            products.find(
                item =>
                    item.id === Number(cartItem.productId)
            );

        const quantity =
            Number(cartItem.quantity);

        if (!product || quantity <= 0) {
            return;
        }

        subtotal += product.price * quantity;
        itemCount += quantity;

        validItems.push({
            product,
            quantity
        });
    });

    return {
        items: validItems,
        subtotal,
        itemCount
    };
}


function renderCart() {

    const cartItems = $("cartItems");

    if (!cartItems) {
        return;
    }

    const totals = getCartTotals();

    $("cartCount").textContent =
        totals.itemCount;

    $("cartDrawerCount").textContent =
        `${totals.itemCount} টি পণ্য`;

    $("cartTotal").textContent =
        formatMoney(totals.subtotal);


    if (totals.items.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>🛒</div>
                <h3>আপনার কার্ট খালি</h3>
                <p>পছন্দের পণ্য কার্টে যোগ করুন।</p>
            </div>
        `;

        return;
    }


    cartItems.innerHTML =
        totals.items.map(({ product, quantity }) => {

            return `
                <div class="cart-item">

                    <div class="cart-item-image">
                        ${product.icon}
                    </div>

                    <div class="cart-item-info">

                        <h4>
                            ${escapeHtml(product.name)}
                        </h4>

                        <strong>
                            ${formatMoney(product.price)}
                        </strong>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                data-cart-minus="${product.id}"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-plus="${product.id}"
                            >
                                +
                            </button>

                            <button
                                type="button"
                                class="remove-cart-item"
                                data-cart-remove="${product.id}"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");
}


/* ================= CART DRAWER ================= */

function openCart() {

    $("cartOverlay").classList.add("show");
    $("cartDrawer").classList.add("show");

    document.body.classList.add("drawer-open");
}


function closeCart() {

    $("cartOverlay").classList.remove("show");
    $("cartDrawer").classList.remove("show");

    document.body.classList.remove("drawer-open");
}


/* ================= BUY NOW ================= */

function buyNowProduct() {

    if (!selectedProductId) {
        return;
    }

    addToCart(
        selectedProductId,
        modalQuantity
    );

    closeProductModal();

    checkoutOpenedFromBuyNow = true;

    openCheckout();
}


/* ================= CHECKOUT ================= */

function calculateCheckoutTotals() {

    const cartTotals = getCartTotals();

    const district =
        $("customerDistrict")
            ? $("customerDistrict").value
            : "";

    const delivery =
        getDeliveryCharge(district);

    return {
        subtotal: cartTotals.subtotal,
        delivery,
        grandTotal:
            cartTotals.subtotal + delivery,
        items: cartTotals.items
    };
}


function renderCheckoutSummary() {

    const totals =
        calculateCheckoutTotals();

    const checkoutItems =
        $("checkoutItems");

    if (!checkoutItems) {
        return;
    }


    if (totals.items.length === 0) {

        checkoutItems.innerHTML =
            `<p>কার্টে কোনো পণ্য নেই।</p>`;

    } else {

        checkoutItems.innerHTML =
            totals.items.map(({ product, quantity }) => {

                return `
                    <div class="checkout-item-row">

                        <span>
                            ${escapeHtml(product.name)}
                            × ${quantity}
                        </span>

                        <strong>
                            ${formatMoney(
                                product.price * quantity
                            )}
                        </strong>

                    </div>
                `;

            }).join("");
    }


    $("checkoutSubtotal").textContent =
        formatMoney(totals.subtotal);


    const district =
        $("customerDistrict")
            ? $("customerDistrict").value
            : "";


    if (!district) {

        $("checkoutDelivery").textContent =
            "জেলা নির্বাচন করুন";

    } else {

        $("checkoutDelivery").textContent =
            formatMoney(totals.delivery);

    }


    $("checkoutGrandTotal").textContent =
        district
            ? formatMoney(totals.grandTotal)
            : formatMoney(totals.subtotal);
}


function openCheckout() {

    const totals = getCartTotals();

    if (totals.items.length === 0) {

        showMessage(
            "Checkout করার আগে কার্টে পণ্য যোগ করুন।"
        );

        return;
    }

    closeCart();

    $("checkoutFormView").hidden = false;
    $("orderSuccessView").hidden = true;

    $("checkoutOverlay").classList.add("show");

    document.body.classList.add("modal-open");

    renderCheckoutSummary();

    setTimeout(() => {

        if ($("customerName")) {
            $("customerName").focus();
        }

    }, 100);
}


function closeCheckout() {

    $("checkoutOverlay").classList.remove("show");

    document.body.classList.remove("modal-open");

    checkoutOpenedFromBuyNow = false;
}


/* ================= PHONE VALIDATION ================= */

function isValidBangladeshPhone(phone) {

    const value =
        String(phone || "")
            .trim()
            .replace(/\s+/g, "");

    return (
        /^01[3-9]\d{8}$/.test(value) ||
        /^\+8801[3-9]\d{8}$/.test(value) ||
        /^8801[3-9]\d{8}$/.test(value)
    );
}


/* ================= ORDER ID ================= */

function createOrderId() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const time =
        String(Date.now())
            .slice(-5);

    return `IMS-${year}${month}${day}-${time}`;
}


/* ================= GET ORDERS ================= */

function getSavedOrders() {

    try {

        const savedOrders =
            localStorage.getItem(
                ORDERS_STORAGE_KEY
            );

        if (!savedOrders) {
            return [];
        }

        const parsed =
            JSON.parse(savedOrders);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Order load error:",
            error
        );

        return [];
    }
}


/* ================= SAVE ORDERS ================= */

function saveOrder(order) {

    const orders =
        getSavedOrders();

    orders.push(order);

    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
    );

    return order;
}


/* ================= CHECKOUT FORM DATA ================= */

function getCheckoutFormData() {

    const paymentMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    return {

        name:
            $("customerName").value.trim(),

        phone:
            $("customerPhone").value.trim(),

        district:
            $("customerDistrict").value.trim(),

        address:
            $("customerAddress").value.trim(),

        paymentMethod:
            paymentMethod
                ? paymentMethod.value
                : "Cash on Delivery"

    };
}


/* ================= PLACE ORDER ================= */

function placeOrder(event) {

    event.preventDefault();

    const totals =
        calculateCheckoutTotals();

    if (totals.items.length === 0) {

        showMessage(
            "কার্টে কোনো পণ্য নেই।"
        );

        return;
    }


    const customer =
        getCheckoutFormData();


    if (!customer.name) {

        showMessage(
            "আপনার নাম লিখুন।"
        );

        $("customerName").focus();

        return;
    }


    if (!customer.phone) {

        showMessage(
            "মোবাইল নম্বর লিখুন।"
        );

        $("customerPhone").focus();

        return;
    }


    if (!isValidBangladeshPhone(customer.phone)) {

        showMessage(
            "সঠিক বাংলাদেশি মোবাইল নম্বর দিন।"
        );

        $("customerPhone").focus();

        return;
    }


    if (!customer.district) {

        showMessage(
            "আপনার জেলা নির্বাচন করুন।"
        );

        $("customerDistrict").focus();

        return;
    }


    if (!customer.address) {

        showMessage(
            "সম্পূর্ণ ঠিকানা লিখুন।"
        );

        $("customerAddress").focus();

        return;
    }


    const orderId =
        createOrderId();


    const orderItems =
        totals.items.map(
            ({ product, quantity }) => ({

                productId: product.id,
                productName: product.name,
                category: product.category,
                price: product.price,
                quantity,
                total:
                    product.price * quantity

            })
        );


    const order = {

        orderId,

        customer: {

            name: customer.name,
            phone: customer.phone,
            district: customer.district,
            address: customer.address

        },

        items: orderItems,

        subtotal:
            totals.subtotal,

        deliveryCharge:
            totals.delivery,

        grandTotal:
            totals.grandTotal,

        paymentMethod:
            customer.paymentMethod,

        status:
            "Pending",

        createdAt:
            new Date().toISOString()

    };


    try {

        saveOrder(order);

        cart = [];

        saveCart();

        renderCart();

        showOrderSuccess(order);

        renderOrderManagement();

    } catch (error) {

        console.error(
            "Order save error:",
            error
        );

        showMessage(
            "অর্ডার সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
        );

        return;
    }
}


/* ================= ORDER SUCCESS ================= */

function showOrderSuccess(order) {

    $("checkoutFormView").hidden = true;
    $("orderSuccessView").hidden = false;

    $("successOrderId").textContent =
        order.orderId;


    const itemCount =
        order.items.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    $("successOrderSummary").innerHTML = `

        <div class="success-row">
            <span>গ্রাহক</span>
            <strong>
                ${escapeHtml(order.customer.name)}
            </strong>
        </div>

        <div class="success-row">
            <span>মোবাইল</span>
            <strong>
                ${escapeHtml(order.customer.phone)}
            </strong>
        </div>

        <div class="success-row">
            <span>জেলা</span>
            <strong>
                ${escapeHtml(order.customer.district)}
            </strong>
        </div>

        <div class="success-row">
            <span>পণ্য</span>
            <strong>
                ${itemCount} টি
            </strong>
        </div>

        <div class="success-row">
            <span>পণ্যের মূল্য</span>
            <strong>
                ${formatMoney(order.subtotal)}
            </strong>
        </div>

        <div class="success-row">
            <span>ডেলিভারি</span>
            <strong>
                ${formatMoney(order.deliveryCharge)}
            </strong>
        </div>

        <div class="success-row grand">
            <span>সর্বমোট</span>
            <strong>
                ${formatMoney(order.grandTotal)}
            </strong>
        </div>

        <div class="success-row">
            <span>পেমেন্ট</span>
            <strong>
                ${escapeHtml(order.paymentMethod)}
            </strong>
        </div>

    `;
}


/* =====================================================
   ORDER MANAGEMENT
===================================================== */


/* ================= STATUS LIST ================= */

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];


/* ================= STATUS LABEL ================= */

function getStatusLabel(status) {

    const labels = {

        Pending: "Pending",

        Confirmed: "Confirmed",

        Processing: "Processing",

        Shipped: "Shipped",

        Delivered: "Delivered",

        Cancelled: "Cancelled"

    };

    return labels[status] || status;
}


/* ================= STATUS CLASS ================= */

function getStatusClass(status) {

    return String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* ================= DATE FORMAT ================= */

function formatOrderDate(dateString) {

    if (!dateString) {
        return "তারিখ পাওয়া যায়নি";
    }

    const date =
        new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "তারিখ পাওয়া যায়নি";
    }

    return date.toLocaleString(
        "bn-BD",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* ================= UPDATE STATS ================= */

function updateOrderStats(orders) {

    const total =
        orders.length;

    const pending =
        orders.filter(
            order => order.status === "Pending"
        ).length;

    const shipped =
        orders.filter(
            order => order.status === "Shipped"
        ).length;

    const delivered =
        orders.filter(
            order => order.status === "Delivered"
        ).length;

    const cancelled =
        orders.filter(
            order => order.status === "Cancelled"
        ).length;


    if ($("totalOrdersCount")) {
        $("totalOrdersCount").textContent = total;
    }

    if ($("pendingOrdersCount")) {
        $("pendingOrdersCount").textContent = pending;
    }

    if ($("shippedOrdersCount")) {
        $("shippedOrdersCount").textContent = shipped;
    }

    if ($("deliveredOrdersCount")) {
        $("deliveredOrdersCount").textContent = delivered;
    }

    if ($("cancelledOrdersCount")) {
        $("cancelledOrdersCount").textContent = cancelled;
    }
}


/* ================= RENDER ORDERS ================= */

function renderOrderManagement() {

    const ordersList =
        $("ordersList");

    if (!ordersList) {
        return;
    }


    const allOrders =
        getSavedOrders();


    updateOrderStats(allOrders);


    const searchInput =
        $("orderSearchInput");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const statusFilter =
        $("orderStatusFilter")
            ? $("orderStatusFilter").value
            : "সব";


    const filteredOrders =
        allOrders
            .slice()
            .reverse()
            .filter(order => {

                const customer =
                    order.customer || {};

                const matchesSearch =
                    !searchTerm ||

                    String(order.orderId || "")
                        .toLowerCase()
                        .includes(searchTerm) ||

                    String(customer.name || "")
                        .toLowerCase()
                        .includes(searchTerm) ||

                    String(customer.phone || "")
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesStatus =
                    statusFilter === "সব" ||
                    order.status === statusFilter;


                return matchesSearch && matchesStatus;

            });


    if (filteredOrders.length === 0) {

        ordersList.innerHTML = `

            <div class="empty-state order-empty">

                <div>📦</div>

                <h3>
                    কোনো অর্ডার পাওয়া যায়নি
                </h3>

                <p>
                    নতুন অর্ডার করলে এখানে দেখা যাবে।
                </p>

            </div>

        `;

        return;
    }


    ordersList.innerHTML =
        filteredOrders.map(order => {

            return createOrderCard(order);

        }).join("");
}


/* ================= CREATE ORDER CARD ================= */

function createOrderCard(order) {

    const customer =
        order.customer || {};

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const itemCount =
        items.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );


    return `

        <article
            class="order-card"
            data-order-id="${escapeHtml(order.orderId)}"
        >

            <div class="order-card-header">

                <div>

                    <span class="order-label">
                        Order ID
                    </span>

                    <strong class="order-id">
                        ${escapeHtml(order.orderId)}
                    </strong>

                </div>

                <span
                    class="order-status status-${getStatusClass(order.status)}"
                >
                    ${escapeHtml(
                        getStatusLabel(order.status)
                    )}
                </span>

            </div>


            <div class="order-card-body">

                <div class="order-info-grid">

                    <div class="order-info">

                        <span>👤 গ্রাহক</span>

                        <strong>
                            ${escapeHtml(
                                customer.name || "-"
                            )}
                        </strong>

                    </div>


                    <div class="order-info">

                        <span>📞 ফোন</span>

                        <strong>
                            ${escapeHtml(
                                customer.phone || "-"
                            )}
                        </strong>

                    </div>


                    <div class="order-info">

                        <span>📍 জেলা</span>

                        <strong>
                            ${escapeHtml(
                                customer.district || "-"
                            )}
                        </strong>

                    </div>


                    <div class="order-info">

                        <span>📦 পণ্য</span>

                        <strong>
                            ${itemCount} টি
                        </strong>

                    </div>


                    <div class="order-info">

                        <span>💰 সর্বমোট</span>

                        <strong>
                            ${formatMoney(
                                order.grandTotal
                            )}
                        </strong>

                    </div>


                    <div class="order-info">

                        <span>🕒 অর্ডার সময়</span>

                        <strong>
                            ${formatOrderDate(
                                order.createdAt
                            )}
                        </strong>

                    </div>

                </div>


                <div class="order-management-row">

                    <div class="order-status-control">

                        <label>
                            Status পরিবর্তন:
                        </label>

                        <select
                            data-status-order="${escapeHtml(
                                order.orderId
                            )}"
                        >

                            ${ORDER_STATUSES.map(status => `

                                <option
                                    value="${status}"
                                    ${
                                        order.status === status
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${status}
                                </option>

                            `).join("")}

                        </select>

                    </div>


                    <div class="order-actions">

                        <button
                            type="button"
                            class="btn btn-outline btn-small"
                            data-view-order="${escapeHtml(
                                order.orderId
                            )}"
                        >
                            👁️ বিস্তারিত
                        </button>

                        <button
                            type="button"
                            class="btn btn-danger btn-small"
                            data-delete-order="${escapeHtml(
                                order.orderId
                            )}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </div>

            </div>

        </article>

    `;
}


/* ================= VIEW ORDER DETAILS ================= */

function viewOrderDetails(orderId) {

    const orders =
        getSavedOrders();

    const order =
        orders.find(
            item =>
                String(item.orderId) ===
                String(orderId)
        );

    if (!order) {

        showMessage(
            "অর্ডার পাওয়া যায়নি।"
        );

        return;
    }


    const customer =
        order.customer || {};

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const productRows =
        items.map(item => `

            <div class="order-detail-product">

                <div>

                    <strong>
                        ${escapeHtml(
                            item.productName || "-"
                        )}
                    </strong>

                    <small>
                        ${formatMoney(item.price)}
                        × ${item.quantity}
                    </small>

                </div>

                <strong>
                    ${formatMoney(item.total)}
                </strong>

            </div>

        `).join("");


    const detailHtml = `

        <div class="order-details-modal">

            <div class="order-details-header">

                <div>
                    <span>Order ID</span>
                    <strong>
                        ${escapeHtml(order.orderId)}
                    </strong>
                </div>

                <span
                    class="order-status status-${getStatusClass(order.status)}"
                >
                    ${escapeHtml(order.status)}
                </span>

            </div>


            <div class="order-details-section">

                <h3>👤 গ্রাহকের তথ্য</h3>

                <div class="detail-grid">

                    <div>
                        <span>নাম</span>
                        <strong>
                            ${escapeHtml(
                                customer.name || "-"
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>ফোন</span>
                        <strong>
                            ${escapeHtml(
                                customer.phone || "-"
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>জেলা</span>
                        <strong>
                            ${escapeHtml(
                                customer.district || "-"
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>ঠিকানা</span>
                        <strong>
                            ${escapeHtml(
                                customer.address || "-"
                            )}
                        </strong>
                    </div>

                </div>

            </div>


            <div class="order-details-section">

                <h3>🛍️ পণ্য</h3>

                <div class="order-detail-products">
                    ${productRows}
                </div>

            </div>


            <div class="order-details-section">

                <h3>💰 পেমেন্ট সামারি</h3>

                <div class="detail-summary-row">
                    <span>পণ্যের মূল্য</span>
                    <strong>
                        ${formatMoney(order.subtotal)}
                    </strong>
                </div>

                <div class="detail-summary-row">
                    <span>ডেলিভারি চার্জ</span>
                    <strong>
                        ${formatMoney(order.deliveryCharge)}
                    </strong>
                </div>

                <div class="detail-summary-row grand">
                    <span>সর্বমোট</span>
                    <strong>
                        ${formatMoney(order.grandTotal)}
                    </strong>
                </div>

                <div class="detail-summary-row">
                    <span>পেমেন্ট</span>
                    <strong>
                        ${escapeHtml(
                            order.paymentMethod ||
                            "Cash on Delivery"
                        )}
                    </strong>
                </div>

            </div>


            <div class="order-details-section">

                <h3>🕒 অর্ডার তথ্য</h3>

                <p>
                    ${formatOrderDate(order.createdAt)}
                </p>

            </div>

        </div>

    `;


    showManagementModal(
        "অর্ডার বিস্তারিত",
        detailHtml
    );
}


/* ================= UPDATE ORDER STATUS ================= */

function updateOrderStatus(orderId, newStatus) {

    const orders =
        getSavedOrders();

    const order =
        orders.find(
            item =>
                String(item.orderId) ===
                String(orderId)
        );

    if (!order) {

        showMessage(
            "অর্ডার পাওয়া যায়নি।"
        );

        return;
    }


    if (!ORDER_STATUSES.includes(newStatus)) {
        return;
    }


    order.status =
        newStatus;


    order.updatedAt =
        new Date().toISOString();


    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
    );


    renderOrderManagement();


    showMessage(
        `Order ${orderId} এর Status ${newStatus} করা হয়েছে।`
    );
}


/* ================= DELETE ORDER ================= */

function deleteOrder(orderId) {

    const orders =
        getSavedOrders();

    const order =
        orders.find(
            item =>
                String(item.orderId) ===
                String(orderId)
        );

    if (!order) {

        showMessage(
            "অর্ডার পাওয়া যায়নি।"
        );

        return;
    }


    const confirmed =
        window.confirm(
            `আপনি কি ${orderId} অর্ডারটি Delete করতে চান?`
        );


    if (!confirmed) {
        return;
    }


    const updatedOrders =
        orders.filter(
            item =>
                String(item.orderId) !==
                String(orderId)
        );


    localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(updatedOrders)
    );


    renderOrderManagement();


    showMessage(
        "অর্ডার Delete করা হয়েছে।"
    );
}


/* ================= MANAGEMENT MODAL ================= */

function showManagementModal(title, content) {

    const existing =
        document.getElementById(
            "managementModalOverlay"
        );

    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "managementModalOverlay";

    overlay.className =
        "modal-overlay show";


    overlay.innerHTML = `

        <div class="modal management-modal">

            <button
                type="button"
                class="modal-close"
                data-close-management-modal
            >
                ×
            </button>

            <div class="management-modal-header">

                <span>📋</span>

                <h2>
                    ${escapeHtml(title)}
                </h2>

            </div>

            <div class="management-modal-content">
                ${content}
            </div>

        </div>

    `;


    document.body.appendChild(overlay);

    document.body.classList.add("modal-open");


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay ||
                event.target.closest(
                    "[data-close-management-modal]"
                )
            ) {

                overlay.remove();

                document.body.classList.remove(
                    "modal-open"
                );
            }

        }
    );
}


/* ================= ORDER MANAGEMENT EVENTS ================= */

function setupOrderManagementEvents() {

    const ordersList =
        $("ordersList");

    if (ordersList) {

        ordersList.addEventListener(
            "click",
            event => {

                const viewButton =
                    event.target.closest(
                        "[data-view-order]"
                    );

                if (viewButton) {

                    viewOrderDetails(
                        viewButton.dataset.viewOrder
                    );

                    return;
                }


                const deleteButton =
                    event.target.closest(
                        "[data-delete-order]"
                    );

                if (deleteButton) {

                    deleteOrder(
                        deleteButton.dataset.deleteOrder
                    );

                    return;
                }

            }
        );


        ordersList.addEventListener(
            "change",
            event => {

                const statusSelect =
                    event.target.closest(
                        "[data-status-order]"
                    );

                if (!statusSelect) {
                    return;
                }


                updateOrderStatus(
                    statusSelect.dataset.statusOrder,
                    statusSelect.value
                );

            }
        );

    }


    if ($("orderSearchInput")) {

        $("orderSearchInput")
            .addEventListener(
                "input",
                renderOrderManagement
            );

    }


    if ($("orderStatusFilter")) {

        $("orderStatusFilter")
            .addEventListener(
                "change",
                renderOrderManagement
            );

    }


    if ($("refreshOrdersButton")) {

        $("refreshOrdersButton")
            .addEventListener(
                "click",
                () => {

                    renderOrderManagement();

                    showMessage(
                        "Order list Refresh হয়েছে।"
                    );

                }
            );

    }
}


/* ================= ESCAPE HTML ================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================= SEARCH ================= */

function setupSearch() {

    const searchInput =
        $("searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        renderProducts
    );
}


/* ================= CATEGORY EVENTS ================= */

function setupCategoryEvents() {

    document.addEventListener(
        "click",
        event => {

            const categoryButton =
                event.target.closest(
                    "[data-category]"
                );

            if (categoryButton) {

                activeCategory =
                    categoryButton.dataset.category;

                renderCategories();
                renderFilters();
                renderProducts();

                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

                return;
            }


            const filterButton =
                event.target.closest(
                    "[data-filter]"
                );

            if (filterButton) {

                activeCategory =
                    filterButton.dataset.filter;

                renderCategories();
                renderFilters();
                renderProducts();

                return;
            }

        }
    );
}


/* ================= PRODUCT EVENTS ================= */

function setupProductEvents() {

    document.addEventListener(
        "click",
        event => {

            const detailButton =
                event.target.closest(
                    "[data-product-details]"
                );

            if (detailButton) {

                openProductModal(
                    detailButton.dataset.productDetails
                );

                return;
            }


            const addButton =
                event.target.closest(
                    "[data-add-cart]"
                );

            if (addButton) {

                addToCart(
                    addButton.dataset.addCart
                );

                return;
            }

        }
    );
}


/* ================= MODAL EVENTS ================= */

function setupProductModalEvents() {

    $("closeProductModalButton")
        ?.addEventListener(
            "click",
            closeProductModal
        );


    $("productModalOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("productModalOverlay")
                ) {
                    closeProductModal();
                }

            }
        );


    $("modalQtyMinus")
        ?.addEventListener(
            "click",
            () => updateModalQuantity(-1)
        );


    $("modalQtyPlus")
        ?.addEventListener(
            "click",
            () => updateModalQuantity(1)
        );


    $("modalAddCartButton")
        ?.addEventListener(
            "click",
            () => {

                if (!selectedProductId) {
                    return;
                }

                addToCart(
                    selectedProductId,
                    modalQuantity
                );

                closeProductModal();

            }
        );


    $("modalBuyNowButton")
        ?.addEventListener(
            "click",
            buyNowProduct
        );
}


/* ================= CART EVENTS ================= */

function setupCartEvents() {

    $("cartButton")
        ?.addEventListener(
            "click",
            openCart
        );


    $("closeCartButton")
        ?.addEventListener(
            "click",
            closeCart
        );


    $("cartOverlay")
        ?.addEventListener(
            "click",
            closeCart
        );


    $("checkoutButton")
        ?.addEventListener(
            "click",
            openCheckout
        );


    $("cartItems")
        ?.addEventListener(
            "click",
            event => {

                const plusButton =
                    event.target.closest(
                        "[data-cart-plus]"
                    );

                if (plusButton) {

                    changeCartQuantity(
                        plusButton.dataset.cartPlus,
                        1
                    );

                    return;
                }


                const minusButton =
                    event.target.closest(
                        "[data-cart-minus]"
                    );

                if (minusButton) {

                    changeCartQuantity(
                        minusButton.dataset.cartMinus,
                        -1
                    );

                    return;
                }


                const removeButton =
                    event.target.closest(
                        "[data-cart-remove]"
                    );

                if (removeButton) {

                    removeFromCart(
                        removeButton.dataset.cartRemove
                    );

                }

            }
        );
}


/* ================= CHECKOUT EVENTS ================= */

function setupCheckoutEvents() {

    $("closeCheckoutButton")
        ?.addEventListener(
            "click",
            closeCheckout
        );


    $("successCloseButton")
        ?.addEventListener(
            "click",
            closeCheckout
        );


    $("checkoutOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("checkoutOverlay")
                ) {
                    closeCheckout();
                }

            }
        );


    $("checkoutForm")
        ?.addEventListener(
            "submit",
            placeOrder
        );


    $("customerDistrict")
        ?.addEventListener(
            "change",
            renderCheckoutSummary
        );
}


/* ================= MOBILE MENU ================= */

function setupMobileMenu() {

    const button =
        $("mobileMenuButton");

    const nav =
        $("navLinks");

    if (!button || !nav) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            nav.classList.toggle("show");

        }
    );


    nav.addEventListener(
        "click",
        event => {

            if (
                event.target.closest("a")
            ) {
                nav.classList.remove("show");
            }

        }
    );
}


/* ================= MESSAGE ================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(
            ".shop-message"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        "shop-message";

    messageBox.textContent =
        message;


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        () => {

            messageBox.classList.add(
                "hide"
            );

            setTimeout(
                () => messageBox.remove(),
                300
            );

        },
        2200
    );
}


/* ================= KEYBOARD ================= */

function setupKeyboardEvents() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                $("checkoutOverlay")
                    ?.classList.contains("show")
            ) {

                closeCheckout();

                return;
            }


            if (
                $("productModalOverlay")
                    ?.classList.contains("show")
            ) {

                closeProductModal();

                return;
            }


            if (
                $("cartDrawer")
                    ?.classList.contains("show")
            ) {

                closeCart();

            }

        }
    );
}


/* ================= INITIALIZE ================= */

function initializeShop() {

    renderCategories();

    renderFilters();

    renderProducts();

    renderCart();

    renderOrderManagement();


    setupSearch();

    setupCategoryEvents();

    setupProductEvents();

    setupProductModalEvents();

    setupCartEvents();

    setupCheckoutEvents();

    setupOrderManagementEvents();

    setupMobileMenu();

    setupKeyboardEvents();
}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeShop
);