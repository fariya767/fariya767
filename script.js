/* =====================================================
   IMRAN SHOP - E-COMMERCE
   Main JavaScript
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
        icon: "📱"
    },

    {
        id: 2,
        name: "ব্লুটুথ হেডফোন",
        category: "ইলেকট্রনিক্স",
        price: 1299,
        oldPrice: 1599,
        icon: "🎧"
    },

    {
        id: 3,
        name: "ক্যাজুয়াল টি-শার্ট",
        category: "ফ্যাশন",
        price: 699,
        oldPrice: 899,
        icon: "👕"
    },

    {
        id: 4,
        name: "ফ্যাশন ব্যাগ",
        category: "ফ্যাশন",
        price: 1199,
        oldPrice: 1499,
        icon: "👜"
    },

    {
        id: 5,
        name: "প্রিমিয়াম চাল ৫ কেজি",
        category: "গ্রোসারি",
        price: 650,
        oldPrice: 720,
        icon: "🍚"
    },

    {
        id: 6,
        name: "কিচেন সেট",
        category: "হোম & লিভিং",
        price: 899,
        oldPrice: 1099,
        icon: "🍳"
    },

    {
        id: 7,
        name: "বিউটি কেয়ার সেট",
        category: "কসমেটিকস",
        price: 799,
        oldPrice: 999,
        icon: "💄"
    },

    {
        id: 8,
        name: "স্টাইলিশ ঘড়ি",
        category: "অন্যান্য",
        price: 999,
        oldPrice: 1299,
        icon: "⌚"
    }

];


/* ================= CART ================= */

let cart = JSON.parse(
    localStorage.getItem("imranShopCart")
) || [];


/* ================= CURRENT FILTER ================= */

let activeCategory = "সব";


/* ================= MONEY FORMAT ================= */

function formatMoney(amount) {

    return "৳" + amount.toLocaleString("bn-BD");

}


/* =====================================================
   CATEGORY DISPLAY
===================================================== */

function renderCategories() {

    const categoryGrid =
        document.getElementById("categoryGrid");


    if (!categoryGrid) return;


    categoryGrid.innerHTML = categories.map(
        category => {

            return `

                <button
                    class="category-card"
                    data-category="${category.name}"
                    onclick="selectCategory('${category.name}')"
                >

                    <div class="category-icon">
                        ${category.icon}
                    </div>

                    <span>
                        ${category.name}
                    </span>

                </button>

            `;

        }
    ).join("");

}


/* =====================================================
   PRODUCT FILTER BUTTONS
===================================================== */

function renderFilterButtons() {

    const filterRow =
        document.getElementById("filterRow");


    if (!filterRow) return;


    filterRow.innerHTML = `

        <button
            class="filter-button active"
            data-category="সব"
        >
            সব পণ্য
        </button>

        ${categories.map(category => `

            <button
                class="filter-button"
                data-category="${category.name}"
            >
                ${category.name}
            </button>

        `).join("")}

    `;


    const buttons =
        document.querySelectorAll(".filter-button");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                selectCategory(
                    this.dataset.category
                );

            }
        );

    });

}


/* =====================================================
   SELECT CATEGORY
===================================================== */

function selectCategory(category) {

    activeCategory = category;


    /* Update filter buttons */

    document
        .querySelectorAll(".filter-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );

        });


    /* Update category cards */

    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.category === category
            );

        });


    renderProducts();


    /* Scroll to product section */

    const productSection =
        document.getElementById("products");


    if (productSection) {

        productSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function renderProducts() {

    const productGrid =
        document.getElementById("productGrid");


    if (!productGrid) return;


    const searchInput =
        document.getElementById("searchInput");


    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const filteredProducts =
        products.filter(product => {


            const categoryMatch =
                activeCategory === "সব" ||
                product.category === activeCategory;


            const searchMatch =
                searchText === "" ||
                product.name
                    .toLowerCase()
                    .includes(searchText) ||
                product.category
                    .toLowerCase()
                    .includes(searchText);


            return categoryMatch && searchMatch;

        });


    /* No products */

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `

            <div
                class="empty-cart"
                style="grid-column: 1 / -1;"
            >

                🔍

                <br><br>

                কোনো পণ্য পাওয়া যায়নি।

                <br>

                অন্য কিছু লিখে চেষ্টা করুন।

            </div>

        `;

        return;

    }


    /* Product cards */

    productGrid.innerHTML =
        filteredProducts.map(product => {

            return `

                <article class="product-card">


                    <div class="product-image">

                        ${product.icon}

                        <span class="discount-badge">
                            অফার
                        </span>

                    </div>


                    <div class="product-info">


                        <span class="product-category">
                            ${product.category}
                        </span>


                        <h3>
                            ${product.name}
                        </h3>


                        <div>

                            <span class="product-price">
                                ${formatMoney(product.price)}
                            </span>

                            <span class="old-price">
                                ${formatMoney(product.oldPrice)}
                            </span>

                        </div>


                        <button
                            class="add-cart-button"
                            onclick="addToCart(${product.id})"
                        >

                            🛒 কার্টে যোগ করুন

                        </button>


                    </div>

                </article>

            `;

        }).join("");

}


/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addToCart(productId) {

    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    saveCart();


    openCart();


    showMessage(
        "পণ্যটি কার্টে যোগ হয়েছে ✓"
    );

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(
    productId,
    change
) {

    const cartItem =
        cart.find(item => item.id === productId);


    if (!cartItem) return;


    cartItem.quantity += change;


    if (cartItem.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    saveCart();

}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "imranShopCart",
        JSON.stringify(cart)
    );


    renderCart();

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");


    const cartCount =
        document.getElementById("cartCount");


    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems) return;


    let totalItems = 0;

    let totalPrice = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                🛒

                <br><br>

                আপনার কার্ট এখন খালি।

                <br>

                পছন্দের পণ্য যোগ করুন।

            </div>

        `;

    } else {


        cartItems.innerHTML =
            cart.map(item => {


                const product =
                    products.find(
                        p => p.id === item.id
                    );


                if (!product) return "";


                const itemTotal =
                    product.price *
                    item.quantity;


                totalItems +=
                    item.quantity;


                totalPrice +=
                    itemTotal;


                return `

                    <div class="cart-item">


                        <div class="cart-product-image">
                            ${product.icon}
                        </div>


                        <div>


                            <h4>
                                ${product.name}
                            </h4>


                            <small>
                                ${formatMoney(product.price)}
                            </small>


                            <div class="quantity-control">


                                <button
                                    onclick="changeQuantity(
                                        ${product.id},
                                        -1
                                    )"
                                >
                                    −
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    onclick="changeQuantity(
                                        ${product.id},
                                        1
                                    )"
                                >
                                    +
                                </button>


                            </div>


                        </div>


                        <button
                            class="remove-cart-item"
                            onclick="removeFromCart(
                                ${product.id}
                            )"
                        >

                            মুছুন

                        </button>


                    </div>

                `;

            }).join("");

    }


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(totalPrice);

    }

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const cartDrawer =
        document.getElementById("cartDrawer");


    const cartOverlay =
        document.getElementById("cartOverlay");


    if (cartDrawer) {

        cartDrawer.classList.add("open");

    }


    if (cartOverlay) {

        cartOverlay.classList.add("show");

    }

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const cartDrawer =
        document.getElementById("cartDrawer");


    const cartOverlay =
        document.getElementById("cartOverlay");


    if (cartDrawer) {

        cartDrawer.classList.remove("open");

    }


    if (cartOverlay) {

        cartOverlay.classList.remove("show");

    }

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            renderProducts();

        }
    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    const menuButton =
        document.getElementById("menuButton");


    const navigation =
        document.getElementById("navigation");


    if (!menuButton || !navigation) return;


    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "open"
            );

        }
    );


    /* Close mobile menu after clicking link */

    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    navigation.classList.remove(
                        "open"
                    );

                }
            );

        });

}


/* =====================================================
   CART EVENTS
===================================================== */

function setupCartEvents() {

    const cartButton =
        document.getElementById("cartButton");


    const closeCartButton =
        document.getElementById("closeCart");


    const cartOverlay =
        document.getElementById("cartOverlay");


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }

}


/* =====================================================
   CHECKOUT
===================================================== */

function setupCheckout() {

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (!checkoutButton) return;


    checkoutButton.addEventListener(
        "click",
        function () {


            if (cart.length === 0) {

                alert(
                    "আপনার কার্ট খালি।\n\nপ্রথমে কিছু পণ্য কার্টে যোগ করুন।"
                );

                return;

            }


            alert(
                "Checkout System পরবর্তী ধাপে যুক্ত করা হবে।\n\nআপনার পণ্যগুলো বর্তমানে কার্টে নিরাপদে সংরক্ষিত আছে।"
            );

        }
    );

}


/* =====================================================
   SIMPLE MESSAGE
===================================================== */

function showMessage(message) {

    /*
       ছোট একটি temporary notification
    */


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


    messageBox.style.position =
        "fixed";


    messageBox.style.bottom =
        "25px";


    messageBox.style.left =
        "50%";


    messageBox.style.transform =
        "translateX(-50%)";


    messageBox.style.background =
        "#166534";


    messageBox.style.color =
        "#ffffff";


    messageBox.style.padding =
        "10px 18px";


    messageBox.style.borderRadius =
        "8px";


    messageBox.style.zIndex =
        "999";


    messageBox.style.fontSize =
        "13px";


    messageBox.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.15)";


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        function () {

            messageBox.remove();

        },
        2000
    );

}


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

function initializeShop() {

    renderCategories();

    renderFilterButtons();

    renderProducts();

    renderCart();

    setupSearch();

    setupMobileMenu();

    setupCartEvents();

    setupCheckout();

}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeShop
);