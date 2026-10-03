/* =====================================================
   IMRAN SHOP - E-COMMERCE
   Main JavaScript
   Stable + Product Details + Checkout + Orders
   District Based Delivery
   Order Management Added
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


/* ================= DELIVERY ================= */

const SAME_DISTRICT =
    "যশোর";

const SAME_DISTRICT_DELIVERY_CHARGE =
    80;

const OTHER_DISTRICT_DELIVERY_CHARGE =
    150;


/* =====================================================
   GET DELIVERY CHARGE
===================================================== */

function getDeliveryCharge(district) {

    const selectedDistrict =
        String(
            district || ""
        ).trim();


    if (!selectedDistrict) {

        return 0;

    }


    if (
        selectedDistrict ===
        SAME_DISTRICT
    ) {

        return SAME_DISTRICT_DELIVERY_CHARGE;

    }


    return OTHER_DISTRICT_DELIVERY_CHARGE;

}


/* ================= CART ================= */

let cart = [];

try {

    const savedCart =
        localStorage.getItem(
            "imranShopCart"
        );

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

let activeCategory =
    "সব";


/* ================= PRODUCT MODAL ================= */

let selectedProductId =
    null;

let modalQuantity =
    1;


/* ================= CHECKOUT ================= */

let checkoutOpenedFromBuyNow =
    false;


/* ================= MONEY FORMAT ================= */

function formatMoney(amount) {

    const number =
        Number(amount) || 0;

    return "৳" +
        number.toLocaleString(
            "bn-BD"
        );

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
        .querySelectorAll(
            ".category-card"
        )
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
        .querySelectorAll(
            ".filter-button"
        )
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
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                category
            );

        });


    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.category ===
                category
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
                product.category ===
                activeCategory;


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
                productName.includes(
                    searchText
                ) ||
                productCategory.includes(
                    searchText
                );


            return (
                categoryMatch &&
                searchMatch
            );

        });


    if (
        filteredProducts.length === 0
    ) {

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


    document
        .querySelectorAll(
            ".product-card"
        )
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


    document
        .querySelectorAll(
            ".add-cart-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function (event) {

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
            item =>
                item.id ===
                productId
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


    modalQuantity =
        1;


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


    document.body.classList.add(
        "modal-open"
    );

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


    selectedProductId =
        null;

    modalQuantity =
        1;


    updateBodyScroll();

}


/* =====================================================
   UPDATE BODY SCROLL
===================================================== */

function updateBodyScroll() {

    const checkoutOverlay =
        document.getElementById(
            "checkoutOverlay"
        );

    const productOverlay =
        document.getElementById(
            "productModalOverlay"
        );


    const checkoutIsOpen =
        checkoutOverlay &&
        checkoutOverlay.classList.contains(
            "show"
        );


    const productModalIsOpen =
        productOverlay &&
        productOverlay.classList.contains(
            "show"
        );


    if (
        checkoutIsOpen ||
        productModalIsOpen
    ) {

        document.body.classList.add(
            "modal-open"
        );

    } else {

        document.body.classList.remove(
            "modal-open"
        );

    }

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
        Number(
            modalQuantity
        ) + 1;


    updateModalQuantity();

}


/* =====================================================
   DECREASE MODAL QUANTITY
===================================================== */

function decreaseModalQuantity() {

    if (!selectedProductId) return;


    if (modalQuantity > 1) {

        modalQuantity =
            Number(
                modalQuantity
            ) - 1;

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
        Number(
            modalQuantity
        ) || 1;


    const product =
        products.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    addProductQuantityToCart(
        productId,
        quantity
    );


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
        Number(
            modalQuantity
        ) || 1;


    const product =
        products.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    addProductQuantityToCart(
        productId,
        quantity
    );


    closeProductModal();


    checkoutOpenedFromBuyNow =
        true;


    openCheckout();

}


/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id ===
                productId
        );


    if (!product) return;


    addProductQuantityToCart(
        productId,
        1
    );


    openCart();


    showMessage(
        "পণ্যটি কার্টে যোগ হয়েছে ✓"
    );

}


/* =====================================================
   ADD QUANTITY TO CART
===================================================== */

function addProductQuantityToCart(
    productId,
    quantity
) {

    const numericQuantity =
        Number(quantity);


    if (
        !Number.isFinite(
            numericQuantity
        ) ||
        numericQuantity <= 0
    ) {

        return;

    }


    const existingProduct =
        cart.find(
            item =>
                item.id ===
                productId
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity ||
                0
            ) + numericQuantity;

    } else {

        cart.push({

            id:
                productId,

            quantity:
                numericQuantity

        });

    }


    saveCart();

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
            item =>
                item.id ===
                productId
        );


    if (!cartItem) return;


    cartItem.quantity =
        Number(
            cartItem.quantity ||
            0
        ) +
        Number(change);


    if (
        cartItem.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    item.id !==
                    productId
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
            item =>
                item.id !==
                productId
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
   GET CART TOTALS
===================================================== */

function getCartTotals() {

    let totalItems =
        0;

    let subtotal =
        0;

    const validCart =
        [];


    cart.forEach(item => {

        const product =
            products.find(
                productItem =>
                    productItem.id ===
                    item.id
            );


        if (!product) return;


        const quantity =
            Number(
                item.quantity
            );


        if (
            !Number.isFinite(
                quantity
            ) ||
            quantity <= 0
        ) {

            return;

        }


        validCart.push({

            id:
                product.id,

            quantity:
                quantity

        });


        totalItems +=
            quantity;


        subtotal +=
            product.price *
            quantity;

    });


    cart =
        validCart;


    return {

        totalItems,

        subtotal

    };

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


    const totals =
        getCartTotals();


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
                        p =>
                            p.id ===
                            item.id
                    );


                if (!product) {
                    return "";
                }


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
                "#cartItems .quantity-control button"
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
                            action ===
                            "plus"
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
                "#cartItems .remove-cart-item"
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
            totals.totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(
                totals.subtotal
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

}


/* =====================================================
   CHECKOUT TOTAL
===================================================== */

function calculateCheckoutTotals() {

    const totals =
        getCartTotals();


    const customer =
        getCheckoutFormData();


    const subtotal =
        totals.subtotal;


    const delivery =
        subtotal > 0 &&
        customer.district
            ? getDeliveryCharge(
                customer.district
            )
            : 0;


    const grandTotal =
        subtotal +
        delivery;


    return {

        subtotal,

        delivery,

        grandTotal,

        totalItems:
            totals.totalItems,

        district:
            customer.district

    };

}


/* =====================================================
   RENDER CHECKOUT SUMMARY
===================================================== */

function renderCheckoutSummary() {

    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    const checkoutSubtotal =
        document.getElementById(
            "checkoutSubtotal"
        );


    const checkoutDelivery =
        document.getElementById(
            "checkoutDelivery"
        );


    const checkoutGrandTotal =
        document.getElementById(
            "checkoutGrandTotal"
        );


    if (!checkoutItems) return;


    const totals =
        calculateCheckoutTotals();


    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <div class="empty-cart">

                🛒

                <br>

                আপনার কার্ট খালি।

            </div>

        `;

    } else {

        checkoutItems.innerHTML =
            cart.map(item => {

                const product =
                    products.find(
                        p =>
                            p.id ===
                            item.id
                    );


                if (!product) {
                    return "";
                }


                const itemTotal =
                    product.price *
                    item.quantity;


                return `

                    <div class="checkout-item">

                        <div class="checkout-item-image">
                            ${product.icon}
                        </div>


                        <div>

                            <span class="checkout-item-name">
                                ${product.name}
                            </span>

                            <span class="checkout-item-quantity">
                                ${item.quantity} × ${formatMoney(product.price)}
                            </span>

                        </div>


                        <strong class="checkout-item-price">
                            ${formatMoney(itemTotal)}
                        </strong>

                    </div>

                `;

            }).join("");

    }


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatMoney(
                totals.subtotal
            );

    }


    if (checkoutDelivery) {

        if (!totals.district) {

            checkoutDelivery.textContent =
                "জেলা নির্বাচন করুন";

        } else {

            checkoutDelivery.textContent =
                formatMoney(
                    totals.delivery
                );

        }

    }


    if (checkoutGrandTotal) {

        checkoutGrandTotal.textContent =
            formatMoney(
                totals.grandTotal
            );

    }

}


/* =====================================================
   OPEN CHECKOUT
===================================================== */

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "আপনার কার্ট খালি।\n\nপ্রথমে কিছু পণ্য কার্টে যোগ করুন।"
        );

        return;

    }


    closeCart();


    const checkoutOverlay =
        document.getElementById(
            "checkoutOverlay"
        );


    const checkoutFormView =
        document.getElementById(
            "checkoutFormView"
        );


    const orderSuccessView =
        document.getElementById(
            "orderSuccessView"
        );


    if (!checkoutOverlay) return;


    if (checkoutFormView) {

        checkoutFormView.style.display =
            "block";

    }


    if (orderSuccessView) {

        orderSuccessView.classList.remove(
            "show"
        );

    }


    renderCheckoutSummary();


    checkoutOverlay.classList.add(
        "show"
    );


    updateBodyScroll();


    const customerName =
        document.getElementById(
            "customerName"
        );


    if (customerName) {

        setTimeout(
            function () {

                customerName.focus();

            },
            150
        );

    }

}


/* =====================================================
   CLOSE CHECKOUT
===================================================== */

function closeCheckout() {

    const checkoutOverlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (checkoutOverlay) {

        checkoutOverlay.classList.remove(
            "show"
        );

    }


    checkoutOpenedFromBuyNow =
        false;


    updateBodyScroll();

}


/* =====================================================
   PHONE VALIDATION
===================================================== */

function isValidBangladeshPhone(phone) {

    const cleanPhone =
        String(phone)
            .replace(
                /\s+/g,
                ""
            )
            .replace(
                /-/g,
                ""
            );


    return (

        /^01[3-9]\d{8}$/.test(
            cleanPhone
        ) ||

        /^\+8801[3-9]\d{8}$/.test(
            cleanPhone
        ) ||

        /^8801[3-9]\d{8}$/.test(
            cleanPhone
        )

    );

}


/* =====================================================
   CREATE ORDER ID
===================================================== */

function createOrderId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const time =
        String(
            now.getTime()
        ).slice(
            -5
        );


    return `IMS-${year}${month}${day}-${time}`;

}


/* =====================================================
   GET SAVED ORDERS
===================================================== */

function getSavedOrders() {

    try {

        const savedOrders =
            localStorage.getItem(
                "imranShopOrders"
            );


        if (!savedOrders) {

            return [];

        }


        const parsedOrders =
            JSON.parse(
                savedOrders
            );


        return Array.isArray(
            parsedOrders
        )
            ? parsedOrders
            : [];

    } catch (error) {

        console.log(
            "Could not read orders:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE ORDER
===================================================== */

function saveOrder(order) {

    try {

        const orders =
            getSavedOrders();


        orders.push(
            order
        );


        localStorage.setItem(
            "imranShopOrders",
            JSON.stringify(
                orders
            )
        );


        return true;

    } catch (error) {

        console.log(
            "Could not save order:",
            error
        );

        return false;

    }

}


/* =====================================================
   GET CHECKOUT FORM DATA
===================================================== */

function getCheckoutFormData() {

    const nameInput =
        document.getElementById(
            "customerName"
        );


    const phoneInput =
        document.getElementById(
            "customerPhone"
        );


    const districtInput =
        document.getElementById(
            "customerDistrict"
        );


    const addressInput =
        document.getElementById(
            "customerAddress"
        );


    const paymentInput =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    return {

        name:
            nameInput
                ? nameInput.value.trim()
                : "",


        phone:
            phoneInput
                ? phoneInput.value.trim()
                : "",


        district:
            districtInput
                ? districtInput.value.trim()
                : "",


        address:
            addressInput
                ? addressInput.value.trim()
                : "",


        paymentMethod:
            paymentInput
                ? paymentInput.value
                : "Cash on Delivery"

    };

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        alert(
            "আপনার কার্ট খালি।"
        );

        closeCheckout();

        return;

    }


    const customer =
        getCheckoutFormData();


    if (
        !customer.name ||
        !customer.phone ||
        !customer.district ||
        !customer.address
    ) {

        alert(
            "দয়া করে নাম, মোবাইল নম্বর, জেলা এবং সম্পূর্ণ ঠিকানা পূরণ করুন।"
        );

        return;

    }


    if (
        !isValidBangladeshPhone(
            customer.phone
        )
    ) {

        alert(
            "দয়া করে একটি সঠিক বাংলাদেশি মোবাইল নম্বর দিন।\n\nউদাহরণ: 01712345678"
        );

        return;

    }


    const totals =
        calculateCheckoutTotals();


    const orderId =
        createOrderId();


    const orderItems =
        cart.map(item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.id
                );


            return {

                productId:
                    product.id,

                productName:
                    product.name,

                category:
                    product.category,

                price:
                    product.price,

                quantity:
                    item.quantity,

                total:
                    product.price *
                    item.quantity

            };

        });


    const order = {

        orderId:
            orderId,


        customer: {

            name:
                customer.name,

            phone:
                customer.phone,

            district:
                customer.district,

            address:
                customer.address

        },


        items:
            orderItems,


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


    const saved =
        saveOrder(
            order
        );


    if (!saved) {

        alert(
            "অর্ডার সংরক্ষণ করা সম্ভব হয়নি।\n\nদয়া করে আবার চেষ্টা করুন।"
        );

        return;

    }


    cart = [];


    try {

        localStorage.removeItem(
            "imranShopCart"
        );

    } catch (error) {

        console.log(
            "Could not clear cart:",
            error
        );

    }


    renderCart();

    renderOrderManagement();


    showOrderSuccess(
        order
    );

}


/* =====================================================
   SHOW ORDER SUCCESS
===================================================== */

function showOrderSuccess(order) {

    const formView =
        document.getElementById(
            "checkoutFormView"
        );


    const successView =
        document.getElementById(
            "orderSuccessView"
        );


    const successOrderId =
        document.getElementById(
            "successOrderId"
        );


    const successOrderSummary =
        document.getElementById(
            "successOrderSummary"
        );


    if (formView) {

        formView.style.display =
            "none";

    }


    if (successView) {

        successView.classList.add(
            "show"
        );

    }


    if (successOrderId) {

        successOrderId.textContent =
            order.orderId;

    }


    if (successOrderSummary) {

        successOrderSummary.innerHTML = `

            <div class="success-summary-row">

                <span>
                    কাস্টমারের নাম
                </span>

                <strong>
                    ${escapeHtml(
                        order.customer.name
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    মোবাইল
                </span>

                <strong>
                    ${escapeHtml(
                        order.customer.phone
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    জেলা
                </span>

                <strong>
                    ${escapeHtml(
                        order.customer.district
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    পণ্য
                </span>

                <strong>
                    ${order.items.length} টি
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    পণ্যের মোট
                </span>

                <strong>
                    ${formatMoney(
                        order.subtotal
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    ডেলিভারি
                </span>

                <strong>
                    ${formatMoney(
                        order.deliveryCharge
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    সর্বমোট
                </span>

                <strong>
                    ${formatMoney(
                        order.grandTotal
                    )}
                </strong>

            </div>


            <div class="success-summary-row">

                <span>
                    পেমেন্ট
                </span>

                <strong>
                    ${escapeHtml(
                        order.paymentMethod
                    )}
                </strong>

            </div>

        `;

    }


    updateBodyScroll();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   CHECKOUT EVENTS
===================================================== */

function setupCheckout() {

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    const checkoutClose =
        document.getElementById(
            "checkoutClose"
        );


    const checkoutOverlay =
        document.getElementById(
            "checkoutOverlay"
        );


    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


    const successCloseButton =
        document.getElementById(
            "successCloseButton"
        );


    const customerDistrict =
        document.getElementById(
            "customerDistrict"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            openCheckout
        );

    }


    if (checkoutClose) {

        checkoutClose.addEventListener(
            "click",
            closeCheckout
        );

    }


    if (checkoutOverlay) {

        checkoutOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    checkoutOverlay
                ) {

                    closeCheckout();

                }

            }
        );

    }


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            placeOrder
        );

    }


    if (customerDistrict) {

        customerDistrict.addEventListener(
            "change",
            function () {

                renderCheckoutSummary();

            }
        );

    }


    if (successCloseButton) {

        successCloseButton.addEventListener(
            "click",
            closeCheckout
        );

    }

}


/* =====================================================
   ORDER MANAGEMENT
===================================================== */

const ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];


/* =====================================================
   STATUS LABEL
===================================================== */

function getOrderStatusLabel(status) {

    const labels = {

        Pending:
            "অপেক্ষমাণ",

        Confirmed:
            "নিশ্চিত",

        Processing:
            "প্রসেসিং",

        Shipped:
            "পাঠানো হয়েছে",

        Delivered:
            "ডেলিভারি সম্পন্ন",

        Cancelled:
            "বাতিল"

    };


    return labels[status] ||
        status ||
        "Pending";

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getOrderStatusClass(status) {

    return String(
        status || "Pending"
    )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

}


/* =====================================================
   FORMAT ORDER DATE
===================================================== */

function formatOrderDate(dateValue) {

    if (!dateValue) {

        return "তারিখ পাওয়া যায়নি";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "তারিখ পাওয়া যায়নি";

    }


    return date.toLocaleString(
        "bn-BD",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


/* =====================================================
   UPDATE SAVED ORDER
===================================================== */

function updateSavedOrder(
    orderId,
    changes
) {

    try {

        const orders =
            getSavedOrders();


        const orderIndex =
            orders.findIndex(
                order =>
                    order.orderId ===
                    orderId
            );


        if (
            orderIndex === -1
        ) {

            return false;

        }


        orders[orderIndex] = {

            ...orders[orderIndex],

            ...changes

        };


        localStorage.setItem(
            "imranShopOrders",
            JSON.stringify(
                orders
            )
        );


        return true;

    } catch (error) {

        console.log(
            "Could not update order:",
            error
        );

        return false;

    }

}


/* =====================================================
   CHANGE ORDER STATUS
===================================================== */

function changeOrderStatus(
    orderId,
    newStatus
) {

    if (
        !ORDER_STATUSES.includes(
            newStatus
        )
    ) {

        return;

    }


    const updated =
        updateSavedOrder(
            orderId,
            {
                status:
                    newStatus
            }
        );


    if (!updated) {

        alert(
            "অর্ডারের Status পরিবর্তন করা সম্ভব হয়নি।"
        );

        return;

    }


    renderOrderManagement();


    showMessage(
        `Order ${orderId} এর Status "${getOrderStatusLabel(newStatus)}" করা হয়েছে ✓`
    );

}


/* =====================================================
   DELETE ORDER
===================================================== */

function deleteOrder(orderId) {

    const confirmed =
        confirm(
            `আপনি কি Order ID ${orderId} মুছে ফেলতে চান?\n\nএই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
        );


    if (!confirmed) {

        return;

    }


    try {

        const orders =
            getSavedOrders();


        const filteredOrders =
            orders.filter(
                order =>
                    order.orderId !==
                    orderId
            );


        if (
            filteredOrders.length ===
            orders.length
        ) {

            alert(
                "অর্ডারটি পাওয়া যায়নি।"
            );

            return;

        }


        localStorage.setItem(
            "imranShopOrders",
            JSON.stringify(
                filteredOrders
            )
        );


        renderOrderManagement();


        showMessage(
            "অর্ডারটি মুছে ফেলা হয়েছে ✓"
        );

    } catch (error) {

        console.log(
            "Could not delete order:",
            error
        );


        alert(
            "অর্ডার মুছে ফেলা সম্ভব হয়নি।"
        );

    }

}


/* =====================================================
   RENDER ORDER STATS
===================================================== */

function renderOrderStats(orders) {

    const totalElement =
        document.getElementById(
            "totalOrdersCount"
        );


    const pendingElement =
        document.getElementById(
            "pendingOrdersCount"
        );


    const processingElement =
        document.getElementById(
            "processingOrdersCount"
        );


    const deliveredElement =
        document.getElementById(
            "deliveredOrdersCount"
        );


    const pendingCount =
        orders.filter(
            order =>
                order.status ===
                "Pending"
        ).length;


    const processingCount =
        orders.filter(
            order =>
                order.status ===
                "Processing"
        ).length;


    const deliveredCount =
        orders.filter(
            order =>
                order.status ===
                "Delivered"
        ).length;


    if (totalElement) {

        totalElement.textContent =
            orders.length;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pendingCount;

    }


    if (processingElement) {

        processingElement.textContent =
            processingCount;

    }


    if (deliveredElement) {

        deliveredElement.textContent =
            deliveredCount;

    }

}


/* =====================================================
   RENDER ORDER ITEM DETAILS
===================================================== */

function renderOrderItems(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <div class="order-no-items">
                কোনো পণ্য তথ্য পাওয়া যায়নি।
            </div>
        `;

    }


    return items.map(item => {

        return `

            <div class="management-order-item">

                <div class="management-order-item-icon">
                    ${escapeHtml(item.icon || "📦")}
                </div>

                <div class="management-order-item-info">

                    <strong>
                        ${escapeHtml(
                            item.productName
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            item.category || ""
                        )}
                    </span>

                </div>

                <div class="management-order-item-quantity">

                    <span>
                        ${item.quantity} × ${formatMoney(item.price)}
                    </span>

                    <strong>
                        ${formatMoney(item.total)}
                    </strong>

                </div>

            </div>

        `;

    }).join("");

}


/* =====================================================
   RENDER SINGLE ORDER
===================================================== */

function renderSingleOrder(order) {

    const safeStatus =
        ORDER_STATUSES.includes(
            order.status
        )
            ? order.status
            : "Pending";


    const customer =
        order.customer ||
        {};


    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    return `

        <article
            class="management-order-card"
            data-order-id="${escapeHtml(order.orderId)}"
        >

            <!-- ORDER HEADER -->

            <div class="management-order-header">

                <div>

                    <span class="management-order-label">
                        Order ID
                    </span>

                    <strong class="management-order-id">
                        ${escapeHtml(
                            order.orderId
                        )}
                    </strong>

                    <small class="management-order-date">
                        ${formatOrderDate(
                            order.createdAt
                        )}
                    </small>

                </div>


                <div class="management-order-status-area">

                    <span
                        class="order-status-badge ${getOrderStatusClass(safeStatus)}"
                    >
                        ${getOrderStatusLabel(
                            safeStatus
                        )}
                    </span>


                    <select
                        class="management-status-select"
                        data-order-id="${escapeHtml(order.orderId)}"
                    >

                        ${ORDER_STATUSES.map(status => {

                            return `
                                <option
                                    value="${status}"
                                    ${status === safeStatus ? "selected" : ""}
                                >
                                    ${getOrderStatusLabel(status)}
                                </option>
                            `;

                        }).join("")}

                    </select>

                </div>

            </div>


            <!-- CUSTOMER -->

            <div class="management-order-customer">

                <div class="management-customer-box">

                    <span>
                        👤 কাস্টমার
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.name ||
                            "নাম নেই"
                        )}
                    </strong>

                </div>


                <div class="management-customer-box">

                    <span>
                        📞 মোবাইল
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.phone ||
                            "নম্বর নেই"
                        )}
                    </strong>

                </div>


                <div class="management-customer-box">

                    <span>
                        📍 জেলা
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.district ||
                            "জেলা নেই"
                        )}
                    </strong>

                </div>


                <div class="management-customer-box address-box">

                    <span>
                        🏠 ঠিকানা
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.address ||
                            "ঠিকানা নেই"
                        )}
                    </strong>

                </div>

            </div>


            <!-- PRODUCTS -->

            <div class="management-order-products">

                <h4>
                    🛍️ অর্ডারের পণ্য
                </h4>

                ${renderOrderItems(items)}

            </div>


            <!-- TOTAL -->

            <div class="management-order-footer">

                <div class="management-order-totals">

                    <div>

                        <span>
                            পণ্যের মোট
                        </span>

                        <strong>
                            ${formatMoney(
                                order.subtotal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ডেলিভারি
                        </span>

                        <strong>
                            ${formatMoney(
                                order.deliveryCharge
                            )}
                        </strong>

                    </div>


                    <div class="management-grand-total">

                        <span>
                            সর্বমোট
                        </span>

                        <strong>
                            ${formatMoney(
                                order.grandTotal
                            )}
                        </strong>

                    </div>

                </div>


                <div class="management-order-actions">

                    <span class="payment-method-label">
                        💵 ${escapeHtml(
                            order.paymentMethod ||
                            "Cash on Delivery"
                        )}
                    </span>


                    <button
                        type="button"
                        class="delete-order-button"
                        data-delete-order-id="${escapeHtml(order.orderId)}"
                    >
                        🗑️ অর্ডার মুছুন
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   RENDER ORDER MANAGEMENT
===================================================== */

function renderOrderManagement() {

    const ordersList =
        document.getElementById(
            "ordersList"
        );


    if (!ordersList) return;


    const searchInput =
        document.getElementById(
            "orderSearchInput"
        );


    const statusFilter =
        document.getElementById(
            "orderStatusFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "সব";


    const allOrders =
        getSavedOrders();


    renderOrderStats(
        allOrders
    );


    const filteredOrders =
        allOrders
            .filter(order => {

                const customer =
                    order.customer ||
                    {};


                const searchTarget = [

                    order.orderId,

                    customer.name,

                    customer.phone,

                    customer.district,

                    customer.address

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchText === "" ||
                    searchTarget.includes(
                        searchText
                    );


                const matchesStatus =
                    selectedStatus === "সব" ||
                    order.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            })
            .sort(
                (
                    first,
                    second
                ) => {

                    return (
                        new Date(
                            second.createdAt
                        ) -
                        new Date(
                            first.createdAt
                        )
                    );

                }
            );


    if (
        filteredOrders.length === 0
    ) {

        ordersList.innerHTML = `

            <div class="orders-empty">

                <div class="orders-empty-icon">
                    📦
                </div>

                <h3>
                    কোনো অর্ডার পাওয়া যায়নি
                </h3>

                <p>
                    অর্ডার তৈরি হলে এখানে দেখা যাবে।
                </p>

            </div>

        `;

        return;

    }


    ordersList.innerHTML =
        filteredOrders
            .map(
                renderSingleOrder
            )
            .join("");


    /* ================= STATUS CHANGE ================= */

    ordersList
        .querySelectorAll(
            ".management-status-select"
        )
        .forEach(select => {

            select.addEventListener(
                "change",
                function () {

                    const orderId =
                        this.dataset.orderId;


                    const newStatus =
                        this.value;


                    changeOrderStatus(
                        orderId,
                        newStatus
                    );

                }
            );

        });


    /* ================= DELETE ORDER ================= */

    ordersList
        .querySelectorAll(
            ".delete-order-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const orderId =
                        this.dataset.deleteOrderId;


                    deleteOrder(
                        orderId
                    );

                }
            );

        });

}


/* =====================================================
   ORDER MANAGEMENT EVENTS
===================================================== */

function setupOrderManagement() {

    const searchInput =
        document.getElementById(
            "orderSearchInput"
        );


    const statusFilter =
        document.getElementById(
            "orderStatusFilter"
        );


    const refreshButton =
        document.getElementById(
            "refreshOrdersButton"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderOrderManagement
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderOrderManagement
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                renderOrderManagement();

                showMessage(
                    "অর্ডার তালিকা আপডেট হয়েছে ✓"
                );

            }
        );

    }


    renderOrderManagement();

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
   KEYBOARD EVENTS
===================================================== */

function setupKeyboardEvents() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            const checkoutOverlay =
                document.getElementById(
                    "checkoutOverlay"
                );


            const productOverlay =
                document.getElementById(
                    "productModalOverlay"
                );


            if (
                checkoutOverlay &&
                checkoutOverlay.classList.contains(
                    "show"
                )
            ) {

                closeCheckout();

                return;

            }


            if (
                productOverlay &&
                productOverlay.classList.contains(
                    "show"
                )
            ) {

                closeProductModal();

            }

        }
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

    setupOrderManagement();

    setupKeyboardEvents();

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