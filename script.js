/* =====================================================
   IMRAN SHOP - E-COMMERCE
   Main JavaScript - Stable + Product Details Version
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
        description:
            "আধুনিক ফিচারসমৃদ্ধ একটি স্মার্টফোন। দৈনন্দিন ব্যবহার, যোগাযোগ, ইন্টারনেট ও বিনোদনের জন্য উপযোগী।"
    },
    {
        id: 2,
        name: "ব্লুটুথ হেডফোন",
        category: "ইলেকট্রনিক্স",
        price: 1299,
        oldPrice: 1599,
        icon: "🎧",
        description:
            "আরামদায়ক ডিজাইনের ব্লুটুথ হেডফোন। গান শোনা, ভিডিও দেখা এবং দৈনন্দিন ব্যবহারের জন্য উপযোগী।"
    },
    {
        id: 3,
        name: "ক্যাজুয়াল টি-শার্ট",
        category: "ফ্যাশন",
        price: 699,
        oldPrice: 899,
        icon: "👕",
        description:
            "দৈনন্দিন ব্যবহারের জন্য আরামদায়ক ও স্টাইলিশ ক্যাজুয়াল টি-শার্ট।"
    },
    {
        id: 4,
        name: "ফ্যাশন ব্যাগ",
        category: "ফ্যাশন",
        price: 1199,
        oldPrice: 1499,
        icon: "👜",
        description:
            "স্টাইলিশ ডিজাইনের ব্যবহারযোগ্য ফ্যাশন ব্যাগ। দৈনন্দিন ব্যবহার ও ভ্রমণের জন্য উপযোগী।"
    },
    {
        id: 5,
        name: "প্রিমিয়াম চাল ৫ কেজি",
        category: "গ্রোসারি",
        price: 650,
        oldPrice: 720,
        icon: "🍚",
        description:
            "পরিবারের দৈনন্দিন খাবারের জন্য উপযোগী ৫ কেজি প্রিমিয়াম চাল।"
    },
    {
        id: 6,
        name: "কিচেন সেট",
        category: "হোম & লিভিং",
        price: 899,
        oldPrice: 1099,
        icon: "🍳",
        description:
            "রান্নাঘরের দৈনন্দিন কাজ সহজ করার জন্য প্রয়োজনীয় কিচেন সেট।"
    },
    {
        id: 7,
        name: "বিউটি কেয়ার সেট",
        category: "কসমেটিকস",
        price: 799,
        oldPrice: 999,
        icon: "💄",
        description:
            "দৈনন্দিন ব্যক্তিগত পরিচর্যার জন্য প্রয়োজনীয় বিউটি কেয়ার সেট।"
    },
    {
        id: 8,
        name: "স্টাইলিশ ঘড়ি",
        category: "অন্যান্য",
        price: 999,
        oldPrice: 1299,
        icon: "⌚",
        description:
            "আকর্ষণীয় ডিজাইনের স্টাইলিশ ঘড়ি। দৈনন্দিন ব্যবহার ও ফ্যাশনের জন্য উপযোগী।"
    }
];


/* ================= CART ================= */

let cart = [];

try {

    const savedCart =
        localStorage.getItem("imranShopCart");

    if (savedCart) {

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {

            cart = parsedCart;

        }

    }

} catch (error) {

    console.log(
        "Cart data reset:",
        error
    );

    cart = [];

}


/* ================= CURRENT FILTER ================= */

let activeCategory = "সব";


/* ================= PRODUCT MODAL ================= */

let selectedProductId = null;

let modalQuantity = 1;


/* ================= MONEY FORMAT ================= */

function formatMoney(amount) {

    const number =
        Number(amount) || 0;

    return "৳" + number.toLocaleString("bn-BD");

}


/* =====================================================
   CATEGORY DISPLAY
===================================================== */

function renderCategories() {

    const categoryGrid =
        document.getElementById(
            "categoryGrid"
        );

    if (!categoryGrid) return;


    categoryGrid.innerHTML =
        categories.map(category => {

            return `
                <button
                    type="button"
                    class="category-card"
                    data-category="${category.name}"
                >

                    <div class="category-icon">
                        ${category.icon}
                    </div>

                    <span>
                        ${category.name}
                    </span>

                </button>
            `;

        }).join("");


    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
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
   PRODUCT FILTER BUTTONS
===================================================== */

function renderFilterButtons() {

    const filterRow =
        document.getElementById(
            "filterRow"
        );

    if (!filterRow) return;


    filterRow.innerHTML = `

        <button
            type="button"
            class="filter-button active"
            data-category="সব"
        >
            সব পণ্য
        </button>

        ${categories.map(category => {

            return `
                <button
                    type="button"
                    class="filter-button"
                    data-category="${category.name}"
                >
                    ${category.name}
                </button>
            `;

        }).join("")}

    `;


    document
        .querySelectorAll(".filter-button")
        .forEach(button => {

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

    activeCategory =
        category;


    document
        .querySelectorAll(".filter-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );

        });


    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.category === category
            );

        });


    renderProducts();


    const productSection =
        document.getElementById(
            "products"
        );


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
        document.getElementById(
            "productGrid"
        );

    if (!productGrid) return;


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredProducts =
        products.filter(product => {

            const categoryMatch =
                activeCategory === "সব" ||
                product.category === activeCategory;


            const productName =
                String(
                    product.name
                ).toLowerCase();


            const productCategory =
                String(
                    product.category
                ).toLowerCase();


            const searchMatch =
                searchText === "" ||
                productName.includes(searchText) ||
                productCategory.includes(searchText);


            return (
                categoryMatch &&
                searchMatch
            );

        });


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


    productGrid.innerHTML =
        filteredProducts.map(product => {

            return `

                <article
                    class="product-card"
                    data-product-id="${product.id}"
                >

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
                            type="button"
                            class="add-cart-button"
                            data-product-id="${product.id}"
                        >
                            🛒 কার্টে যোগ করুন
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    /* ================= PRODUCT CARD CLICK ================= */

    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                function () {

                    const productId =
                        Number(
                            this.dataset.productId
                        );

                    openProductModal(
                        productId
                    );

                }
            );

        });


    /* ================= ADD TO CART BUTTON ================= */

    document
        .querySelectorAll(".add-cart-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                       Button click করলে
                       Product Modal খুলবে না।
                    */

                    event.stopPropagation();


                    const productId =
                        Number(
                            this.dataset.productId
                        );


                    addToCart(
                        productId
                    );

                }
            );

        });

}


/* =====================================================
   OPEN PRODUCT DETAILS MODAL
===================================================== */

function openProductModal(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const modalOverlay =
        document.getElementById(
            "productModalOverlay"
        );


    const modalImage =
        document.getElementById(
            "modalProductImage"
        );


    const modalCategory =
        document.getElementById(
            "modalProductCategory"
        );


    const modalName =
        document.getElementById(
            "modalProductName"
        );


    const modalPrice =
        document.getElementById(
            "modalProductPrice"
        );


    const modalOldPrice =
        document.getElementById(
            "modalProductOldPrice"
        );


    const modalDescription =
        document.getElementById(
            "modalProductDescription"
        );


    if (!modalOverlay) return;


    selectedProductId =
        productId;


    modalQuantity = 1;


    if (modalImage) {

        modalImage.textContent =
            product.icon;

    }


    if (modalCategory) {

        modalCategory.textContent =
            product.category;

    }


    if (modalName) {

        modalName.textContent =
            product.name;

    }


    if (modalPrice) {

        modalPrice.textContent =
            formatMoney(
                product.price
            );

    }


    if (modalOldPrice) {

        modalOldPrice.textContent =
            formatMoney(
                product.oldPrice
            );

    }


    if (modalDescription) {

        modalDescription.textContent =
            product.description ||
            "এই পণ্যের বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে।";

    }


    updateModalQuantity();


    modalOverlay.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE PRODUCT DETAILS MODAL
===================================================== */

function closeProductModal() {

    const modalOverlay =
        document.getElementById(
            "productModalOverlay"
        );


    if (modalOverlay) {

        modalOverlay.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";

    selectedProductId =
        null;

    modalQuantity = 1;

}


/* =====================================================
   UPDATE MODAL QUANTITY
===================================================== */

function updateModalQuantity() {

    const quantityElement =
        document.getElementById(
            "modalQuantity"
        );


    if (quantityElement) {

        quantityElement.textContent =
            modalQuantity;

    }

}


/* =====================================================
   INCREASE MODAL QUANTITY
===================================================== */

function increaseModalQuantity() {

    if (!selectedProductId) return;


    modalQuantity =
        Number(modalQuantity) + 1;


    updateModalQuantity();

}


/* =====================================================
   DECREASE MODAL QUANTITY
===================================================== */

function decreaseModalQuantity() {

    if (!selectedProductId) return;


    if (modalQuantity > 1) {

        modalQuantity =
            Number(modalQuantity) - 1;

    }


    updateModalQuantity();

}


/* =====================================================
   ADD MODAL PRODUCT TO CART
===================================================== */

function addModalProductToCart() {

    if (!selectedProductId) return;


    const productId =
        selectedProductId;


    const quantity =
        Number(modalQuantity) || 1;


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + quantity;

    } else {

        cart.push({
            id: productId,
            quantity: quantity
        });

    }


    saveCart();


    closeProductModal();


    openCart();


    showMessage(
        "পণ্যটি কার্টে যোগ হয়েছে ✓"
    );

}


/* =====================================================
   BUY NOW
===================================================== */

function buyNowProduct() {

    if (!selectedProductId) return;


    const productId =
        selectedProductId;


    const quantity =
        Number(modalQuantity) || 1;


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + quantity;

    } else {

        cart.push({
            id: productId,
            quantity: quantity
        });

    }


    saveCart();


    closeProductModal();


    openCart();


    showMessage(
        "পণ্যটি কার্টে যোগ হয়েছে। এখন Checkout করুন ✓"
    );

}


/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 0
            ) + 1;

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
   CHANGE CART QUANTITY
===================================================== */

function changeQuantity(
    productId,
    change
) {

    const cartItem =
        cart.find(
            item => item.id === productId
        );


    if (!cartItem) return;


    cartItem.quantity =
        Number(
            cartItem.quantity || 0
        ) + Number(change);


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

    try {

        localStorage.setItem(
            "imranShopCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.log(
            "Could not save cart:",
            error
        );

    }


    renderCart();

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (!cartItems) return;


    let totalItems = 0;

    let totalPrice = 0;


    const validCart = [];


    cart.forEach(item => {

        const product =
            products.find(
                productItem =>
                    productItem.id === item.id
            );


        if (!product) return;


        const quantity =
            Number(item.quantity);


        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {

            return;

        }


        validCart.push({
            id: product.id,
            quantity: quantity
        });


        totalItems +=
            quantity;


        totalPrice +=
            product.price * quantity;

    });


    cart = validCart;


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
                                    type="button"
                                    data-action="minus"
                                    data-product-id="${product.id}"
                                >
                                    −
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    type="button"
                                    data-action="plus"
                                    data-product-id="${product.id}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="remove-cart-item"
                            data-product-id="${product.id}"
                        >
                            মুছুন
                        </button>

                    </div>

                `;

            }).join("");


        document
            .querySelectorAll(
                ".quantity-control button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            Number(
                                this.dataset.productId
                            );


                        const action =
                            this.dataset.action;


                        if (
                            action === "plus"
                        ) {

                            changeQuantity(
                                productId,
                                1
                            );

                        } else {

                            changeQuantity(
                                productId,
                                -1
                            );

                        }

                    }
                );

            });


        document
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            Number(
                                this.dataset.productId
                            );


                        removeFromCart(
                            productId
                        );

                    }
                );

            });

    }


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(
                totalPrice
            );

    }

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    const cartDrawer =
        document.getElementById(
            "cartDrawer"
        );


    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    if (cartDrawer) {

        cartDrawer.classList.add(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.add(
            "show"
        );

    }

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    const cartDrawer =
        document.getElementById(
            "cartDrawer"
        );


    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    if (cartDrawer) {

        cartDrawer.classList.remove(
            "open"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


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
        document.getElementById(
            "menuButton"
        );


    const navigation =
        document.getElementById(
            "navigation"
        );


    if (
        !menuButton ||
        !navigation
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "open"
            );

        }
    );


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
        document.getElementById(
            "cartButton"
        );


    const closeCartButton =
        document.getElementById(
            "closeCart"
        );


    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


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
   PRODUCT MODAL EVENTS
===================================================== */

function setupProductModal() {

    const modalOverlay =
        document.getElementById(
            "productModalOverlay"
        );


    const modalClose =
        document.getElementById(
            "productModalClose"
        );


    const quantityMinus =
        document.getElementById(
            "modalQuantityMinus"
        );


    const quantityPlus =
        document.getElementById(
            "modalQuantityPlus"
        );


    const addCartButton =
        document.getElementById(
            "modalAddCart"
        );


    const buyNowButton =
        document.getElementById(
            "modalBuyNow"
        );


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (quantityMinus) {

        quantityMinus.addEventListener(
            "click",
            decreaseModalQuantity
        );

    }


    if (quantityPlus) {

        quantityPlus.addEventListener(
            "click",
            increaseModalQuantity
        );

    }


    if (addCartButton) {

        addCartButton.addEventListener(
            "click",
            addModalProductToCart
        );

    }


    if (buyNowButton) {

        buyNowButton.addEventListener(
            "click",
            buyNowProduct
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modalOverlay
                ) {

                    closeProductModal();

                }

            }
        );

    }


    /* Escape key */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

            }

        }
    );

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

    const oldMessage =
        document.querySelector(
            ".shop-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const messageBox =
        document.createElement(
            "div"
        );


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

            if (
                messageBox.parentNode
            ) {

                messageBox.remove();

            }

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

    setupProductModal();

    setupCheckout();

}


/* ================= START ================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeShop
    );

} else {

    initializeShop();

}