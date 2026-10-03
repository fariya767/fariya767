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
       