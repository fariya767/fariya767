/* =====================================================
   IMRAN SHOP - ADMIN PANEL
   Admin JavaScript - Phase 1 Stable Version
   Storage: LocalStorage
===================================================== */


/* =====================================================
   ADMIN CONFIGURATION
===================================================== */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";

const ADMIN_LOGIN_KEY = "imranShopAdminLoggedIn";
const ORDERS_STORAGE_KEY = "imranShopOrders";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");

const loginForm = document.getElementById("loginForm");
const adminUsername = document.getElementById("adminUsername");
const adminPassword = document.getElementById("adminPassword");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const refreshDashboardButton = document.getElementById(
    "refreshDashboardButton"
);

const adminTotalOrders = document.getElementById(
    "adminTotalOrders"
);

const adminPendingOrders = document.getElementById(
    "adminPendingOrders"
);

const adminProcessingOrders = document.getElementById(
    "adminProcessingOrders"
);

const adminDeliveredOrders = document.getElementById(
    "adminDeliveredOrders"
);

const adminTotalSales = document.getElementById(
    "adminTotalSales"
);

const adminTodayOrders = document.getElementById(
    "adminTodayOrders"
);

const adminOrderSearch = document.getElementById(
    "adminOrderSearch"
);

const adminOrderStatusFilter = document.getElementById(
    "adminOrderStatusFilter"
);

const adminRefreshOrders = document.getElementById(
    "adminRefreshOrders"
);

const adminOrdersList = document.getElementById(
    "adminOrdersList"
);


/* =====================================================
   MODAL ELEMENTS
===================================================== */

const adminOrderModalOverlay = document.getElementById(
    "adminOrderModalOverlay"
);

const adminOrderModal = document.getElementById(
    "adminOrderModal"
);

const adminOrderModalClose = document.getElementById(
    "adminOrderModalClose"
);

const adminModalOrderId = document.getElementById(
    "adminModalOrderId"
);

const adminModalOrderDate = document.getElementById(
    "adminModalOrderDate"
);

const adminModalCustomerName = document.getElementById(
    "adminModalCustomerName"
);

const adminModalCustomerPhone = document.getElementById(
    "adminModalCustomerPhone"
);

const adminModalCustomerDistrict = document.getElementById(
    "adminModalCustomerDistrict"
);

const adminModalCustomerAddress = document.getElementById(
    "adminModalCustomerAddress"
);

const adminModalItems = document.getElementById(
    "adminModalItems"
);

const adminModalSubtotal = document.getElementById(
    "adminModalSubtotal"
);

const adminModalDelivery = document.getElementById(
    "adminModalDelivery"
);

const adminModalGrandTotal = document.getElementById(
    "adminModalGrandTotal"
);

const adminModalStatus = document.getElementById(
    "adminModalStatus"
);

const adminSaveStatusButton = document.getElementById(
    "adminSaveStatusButton"
);

const adminDeleteOrderButton = document.getElementById(
    "adminDeleteOrderButton"
);


/* =====================================================
   CURRENT ORDER
===================================================== */

let currentAdminOrderId = null;


/* =====================================================
   HELPER FUNCTIONS
===================================================== */


/* Get Orders */

function getOrders() {
    try {
        const storedOrders = localStorage.getItem(
            ORDERS_STORAGE_KEY
        );

        if (!storedOrders) {
            return [];
        }

        const parsedOrders = JSON.parse(storedOrders);

        return Array.isArray(parsedOrders)
            ? parsedOrders
            : [];

    } catch (error) {

        console.error(
            "অর্ডার লোড করতে সমস্যা হয়েছে:",
            error
        );

        return [];
    }
}


/* Save Orders */

function saveOrders(orders) {

    try {

        localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(orders)
        );

        return true;

    } catch (error) {

        console.error(
            "অর্ডার সেভ করতে সমস্যা হয়েছে:",
            error
        );

        return false;
    }
}


/* Currency */

function formatCurrency(amount) {

    const number = Number(amount) || 0;

    return `৳${number.toLocaleString("en-US")}`;
}


/* Escape HTML */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* Format Date */

function formatDate(dateValue) {

    if (!dateValue) {
        return "তারিখ নেই";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "তারিখ নেই";
    }

    return date.toLocaleDateString(
        "bn-BD",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


/* Format Date + Time */

function formatDateTime(dateValue) {

    if (!dateValue) {
        return "তারিখ নেই";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "তারিখ নেই";
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


/* Today Check */

function isToday(dateValue) {

    if (!dateValue) {
        return false;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}


/* Status Class */

function getStatusClass(status) {

    const normalizedStatus = String(
        status || "Pending"
    ).toLowerCase();

    const statusMap = {
        pending: "pending",
        confirmed: "confirmed",
        processing: "processing",
        shipped: "shipped",
        delivered: "delivered",
        cancelled: "cancelled"
    };

    return statusMap[normalizedStatus] || "pending";
}


/* Bengali Status */

function getStatusText(status) {

    const statusMap = {
        Pending: "অপেক্ষমাণ",
        Confirmed: "নিশ্চিত",
        Processing: "প্রসেসিং",
        Shipped: "পাঠানো হয়েছে",
        Delivered: "ডেলিভার হয়েছে",
        Cancelled: "বাতিল"
    };

    return statusMap[status] || status || "অপেক্ষমাণ";
}


/* =====================================================
   LOGIN SYSTEM
===================================================== */

function checkAdminLogin() {

    const loggedIn =
        localStorage.getItem(
            ADMIN_LOGIN_KEY
        ) === "true";

    if (loggedIn) {

        showAdminPanel();

    } else {

        showLoginScreen();
    }
}


/* Show Login */

function showLoginScreen() {

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    if (adminPanel) {
        adminPanel.style.display = "none";
    }
}


/* Show Admin */

function showAdminPanel() {

    if (loginScreen) {
        loginScreen.style.display = "none";
    }

    if (adminPanel) {
        adminPanel.style.display = "block";
    }

    loadDashboard();

    renderAdminOrders();
}


/* Login */

function handleLogin(event) {

    event.preventDefault();

    const username =
        adminUsername
            ? adminUsername.value.trim()
            : "";

    const password =
        adminPassword
            ? adminPassword.value
            : "";

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        localStorage.setItem(
            ADMIN_LOGIN_KEY,
            "true"
        );

        if (loginMessage) {
            loginMessage.textContent = "";
        }

        showAdminPanel();

    } else {

        if (loginMessage) {

            loginMessage.textContent =
                "ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।";

            loginMessage.style.color =
                "#dc2626";
        }

        if (adminPassword) {
            adminPassword.value = "";
        }
    }
}


/* Logout */

function handleLogout() {

    localStorage.removeItem(
        ADMIN_LOGIN_KEY
    );

    currentAdminOrderId = null;

    closeAdminOrderModal();

    showLoginScreen();

    if (adminUsername) {
        adminUsername.value = "";
    }

    if (adminPassword) {
        adminPassword.value = "";
    }
}


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

    const orders = getOrders();

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        order =>
            String(order.status).toLowerCase() ===
            "pending"
    ).length;

    const processingOrders = orders.filter(
        order =>
            String(order.status).toLowerCase() ===
                "processing" ||
            String(order.status).toLowerCase() ===
                "confirmed" ||
            String(order.status).toLowerCase() ===
                "shipped"
    ).length;

    const deliveredOrders = orders.filter(
        order =>
            String(order.status).toLowerCase() ===
            "delivered"
    ).length;

    const totalSales = orders
        .filter(
            order =>
                String(order.status).toLowerCase() !==
                "cancelled"
        )
        .reduce(
            (total, order) =>
                total +
                Number(order.grandTotal || 0),
            0
        );

    const todayOrders = orders.filter(
        order => isToday(order.createdAt)
    ).length;


    if (adminTotalOrders) {
        adminTotalOrders.textContent =
            totalOrders;
    }

    if (adminPendingOrders) {
        adminPendingOrders.textContent =
            pendingOrders;
    }

    if (adminProcessingOrders) {
        adminProcessingOrders.textContent =
            processingOrders;
    }

    if (adminDeliveredOrders) {
        adminDeliveredOrders.textContent =
            deliveredOrders;
    }

    if (adminTotalSales) {
        adminTotalSales.textContent =
            formatCurrency(totalSales);
    }

    if (adminTodayOrders) {
        adminTodayOrders.textContent =
            todayOrders;
    }
}


/* =====================================================
   ORDER FILTERING
===================================================== */

function getFilteredOrders() {

    const orders = getOrders();

    const searchText =
        adminOrderSearch
            ? adminOrderSearch.value
                .trim()
                .toLowerCase()
            : "";

    const statusFilter =
        adminOrderStatusFilter
            ? adminOrderStatusFilter.value
            : "all";


    return orders.filter(order => {

        const orderId =
            String(order.orderId || "")
                .toLowerCase();

        const customerName =
            String(
                order.customer?.name || ""
            ).toLowerCase();

        const phone =
            String(
                order.customer?.phone || ""
            ).toLowerCase();


        const matchesSearch =
            !searchText ||
            orderId.includes(searchText) ||
            customerName.includes(searchText) ||
            phone.includes(searchText);


        const orderStatus =
            String(
                order.status || "Pending"
            ).toLowerCase();


        const matchesStatus =
            statusFilter === "all" ||
            orderStatus ===
                statusFilter.toLowerCase();


        return (
            matchesSearch &&
            matchesStatus
        );
    });
}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderAdminOrders() {

    if (!adminOrdersList) {
        return;
    }

    const orders = getFilteredOrders();

    if (orders.length === 0) {

        adminOrdersList.innerHTML = `
            <div class="admin-orders-empty">
                <div class="admin-orders-empty-icon">
                    📦
                </div>

                <h3>কোনো অর্ডার পাওয়া যায়নি</h3>

                <p>
                    আপনার সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
                </p>
            </div>
        `;

        return;
    }


    /* Newest Orders First */

    orders.sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    );


    adminOrdersList.innerHTML =
        orders
            .map(order =>
                createAdminOrderCard(order)
            )
            .join("");
}


/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createAdminOrderCard(order) {

    const status =
        order.status || "Pending";

    const statusClass =
        getStatusClass(status);

    const statusText =
        getStatusText(status);


    const customerName =
        order.customer?.name ||
        "নাম নেই";

    const customerPhone =
        order.customer?.phone ||
        "ফোন নেই";

    const district =
        order.customer?.district ||
        "";

    const address =
        order.customer?.address ||
        "";


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const productHTML =
        items.length > 0

            ? items
                .map(item => {

                    const quantity =
                        Number(
                            item.quantity || 1
                        );

                    const price =
                        Number(
                            item.price || 0
                        );

                    const total =
                        Number(
                            item.total ||
                            price * quantity
                        );


                    return `
                        <div class="admin-order-product">

                            <div class="admin-order-product-icon">
                                ${escapeHTML(
                                    item.icon || "📦"
                                )}
                            </div>

                            <div class="admin-order-product-info">

                                <strong>
                                    ${escapeHTML(
                                        item.name ||
                                        "পণ্য"
                                    )}
                                </strong>

                                <span>
                                    ${formatCurrency(price)}
                                    ×
                                    ${quantity}
                                </span>

                            </div>

                            <div class="admin-order-product-total">
                                ${formatCurrency(total)}
                            </div>

                        </div>
                    `;
                })
                .join("")

            : `
                <div class="admin-order-product">
                    <div class="admin-order-product-icon">
                        📦
                    </div>

                    <div class="admin-order-product-info">
                        <strong>
                            কোনো পণ্যের তথ্য নেই
                        </strong>
                    </div>
                </div>
            `;


    return `
        <div
            class="admin-order-card"
            data-order-id="${escapeHTML(
                order.orderId || ""
            )}"
        >

            <div class="admin-order-card-header">

                <div class="admin-order-id-area">

                    <strong>
                        ${escapeHTML(
                            order.orderId ||
                            "অর্ডার আইডি নেই"
                        )}
                    </strong>

                    <span>
                        ${formatDateTime(
                            order.createdAt
                        )}
                    </span>

                </div>


                <div class="admin-order-status-area">

                    <span
                        class="admin-status-badge ${statusClass}"
                    >
                        ${statusText}
                    </span>

                </div>

            </div>


            <div class="admin-order-card-body">

                <div class="admin-order-customer-grid">

                    <div class="admin-customer-item">

                        <span>
                            👤 কাস্টমার
                        </span>

                        <strong>
                            ${escapeHTML(
                                customerName
                            )}
                        </strong>

                    </div>


                    <div class="admin-customer-item">

                        <span>
                            📞 ফোন
                        </span>

                        <strong>
                            ${escapeHTML(
                                customerPhone
                            )}
                        </strong>

                    </div>


                    <div class="admin-customer-item">

                        <span>
                            📍 জেলা
                        </span>

                        <strong>
                            ${escapeHTML(
                                district || "—"
                            )}
                        </strong>

                    </div>


                    <div class="admin-customer-item address">

                        <span>
                            🏠 ঠিকানা
                        </span>

                        <strong>
                            ${escapeHTML(
                                address || "—"
                            )}
                        </strong>

                    </div>

                </div>


                <div class="admin-order-products-title">
                    অর্ডারের পণ্য
                </div>


                <div class="admin-order-products">
                    ${productHTML}
                </div>

            </div>


            <div class="admin-order-card-footer">

                <div class="admin-order-total-area">

                    <div class="admin-order-total-item">

                        <span>
                            পণ্য
                        </span>

                        <strong>
                            ${formatCurrency(
                                order.subtotal || 0
                            )}
                        </strong>

                    </div>


                    <div class="admin-order-total-item">

                        <span>
                            ডেলিভারি
                        </span>

                        <strong>
                            ${formatCurrency(
                                order.deliveryCharge || 0
                            )}
                        </strong>

                    </div>


                    <div class="admin-order-total-item grand">

                        <span>
                            মোট
                        </span>

                        <strong>
                            ${formatCurrency(
                                order.grandTotal || 0
                            )}
                        </strong>

                    </div>

                </div>


                <div class="admin-order-actions">

                    <button
                        type="button"
                        class="admin-view-order-button"
                        onclick="openAdminOrderModal('${escapeHTML(
                            order.orderId || ""
                        )}')"
                    >
                        👁️ বিস্তারিত
                    </button>


                    <button
                        type="button"
                        class="admin-delete-order-button"
                        onclick="deleteAdminOrder('${escapeHTML(
                            order.orderId || ""
                        )}')"
                    >
                        🗑️ ডিলিট
                    </button>

                </div>

            </div>

        </div>
    `;
}


/* =====================================================
   OPEN ORDER MODAL
===================================================== */

function openAdminOrderModal(orderId) {

    const orders = getOrders();

    const order = orders.find(
        item =>
            String(item.orderId) ===
            String(orderId)
    );


    if (!order) {

        alert(
            "অর্ডারটি খুঁজে পাওয়া যায়নি।"
        );

        return;
    }


    currentAdminOrderId =
        order.orderId;


    if (adminModalOrderId) {
        adminModalOrderId.textContent =
            order.orderId || "—";
    }


    if (adminModalOrderDate) {
        adminModalOrderDate.textContent =
            formatDateTime(
                order.createdAt
            );
    }


    if (adminModalCustomerName) {
        adminModalCustomerName.textContent =
            order.customer?.name ||
            "—";
    }


    if (adminModalCustomerPhone) {
        adminModalCustomerPhone.textContent =
            order.customer?.phone ||
            "—";
    }


    if (adminModalCustomerDistrict) {
        adminModalCustomerDistrict.textContent =
            order.customer?.district ||
            "—";
    }


    if (adminModalCustomerAddress) {
        adminModalCustomerAddress.textContent =
            order.customer?.address ||
            "—";
    }


    renderAdminModalItems(
        order.items || []
    );


    if (adminModalSubtotal) {
        adminModalSubtotal.textContent =
            formatCurrency(
                order.subtotal || 0
            );
    }


    if (adminModalDelivery) {
        adminModalDelivery.textContent =
            formatCurrency(
                order.deliveryCharge || 0
            );
    }


    if (adminModalGrandTotal) {
        adminModalGrandTotal.textContent =
            formatCurrency(
                order.grandTotal || 0
            );
    }


    if (adminModalStatus) {
        adminModalStatus.value =
            order.status || "Pending";
    }


    if (adminOrderModalOverlay) {
        adminOrderModalOverlay.classList.add(
            "active"
        );
    }

    document.body.classList.add(
        "modal-open"
    );
}


/* =====================================================
   MODAL ITEMS
===================================================== */

function renderAdminModalItems(items) {

    if (!adminModalItems) {
        return;
    }


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        adminModalItems.innerHTML = `
            <div class="admin-modal-item">
                <div class="admin-modal-item-icon">
                    📦
                </div>

                <div class="admin-modal-item-info">
                    <strong>
                        কোনো পণ্যের তথ্য নেই
                    </strong>
                </div>
            </div>
        `;

        return;
    }


    adminModalItems.innerHTML =
        items
            .map(item => {

                const quantity =
                    Number(
                        item.quantity || 1
                    );

                const price =
                    Number(
                        item.price || 0
                    );

                const total =
                    Number(
                        item.total ||
                        price * quantity
                    );


                return `
                    <div class="admin-modal-item">

                        <div class="admin-modal-item-icon">
                            ${escapeHTML(
                                item.icon || "📦"
                            )}
                        </div>


                        <div class="admin-modal-item-info">

                            <strong>
                                ${escapeHTML(
                                    item.name ||
                                    "পণ্য"
                                )}
                            </strong>

                            <span>
                                ${formatCurrency(price)}
                                ×
                                ${quantity}
                            </span>

                        </div>


                        <div class="admin-modal-item-price">
                            ${formatCurrency(total)}
                        </div>

                    </div>
                `;
            })
            .join("");
}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeAdminOrderModal() {

    currentAdminOrderId = null;

    if (adminOrderModalOverlay) {
        adminOrderModalOverlay.classList.remove(
            "active"
        );
    }

    document.body.classList.remove(
        "modal-open"
    );
}


/* =====================================================
   SAVE ORDER STATUS
===================================================== */

function saveAdminOrderStatus() {

    if (!currentAdminOrderId) {

        alert(
            "কোনো অর্ডার নির্বাচন করা হয়নি।"
        );

        return;
    }


    const newStatus =
        adminModalStatus
            ? adminModalStatus.value
            : "Pending";


    const orders = getOrders();


    const orderIndex =
        orders.findIndex(
            order =>
                String(order.orderId) ===
                String(currentAdminOrderId)
        );


    if (orderIndex === -1) {

        alert(
            "অর্ডারটি খুঁজে পাওয়া যায়নি।"
        );

        return;
    }


    orders[orderIndex].status =
        newStatus;


    const saved =
        saveOrders(orders);


    if (!saved) {

        alert(
            "অর্ডার স্ট্যাটাস সেভ করা যায়নি।"
        );

        return;
    }


    alert(
        "অর্ডারের স্ট্যাটাস সফলভাবে আপডেট হয়েছে।"
    );


    closeAdminOrderModal();

    loadDashboard();

    renderAdminOrders();
}


/* =====================================================
   DELETE ORDER
===================================================== */

function deleteAdminOrder(orderId) {

    const orders = getOrders();

    const order =
        orders.find(
            item =>
                String(item.orderId) ===
                String(orderId)
        );


    if (!order) {

        alert(
            "অর্ডারটি খুঁজে পাওয়া যায়নি।"
        );

        return;
    }


    const customerName =
        order.customer?.name ||
        "এই কাস্টমার";


    const confirmed =
        confirm(
            `আপনি কি সত্যিই অর্ডার ${order.orderId} ডিলিট করতে চান?\n\nকাস্টমার: ${customerName}\n\nএই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`
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


    const saved =
        saveOrders(updatedOrders);


    if (!saved) {

        alert(
            "অর্ডার ডিলিট করা যায়নি।"
        );

        return;
    }


    if (
        String(currentAdminOrderId) ===
        String(orderId)
    ) {

        closeAdminOrderModal();
    }


    loadDashboard();

    renderAdminOrders();


    alert(
        "অর্ডার সফলভাবে ডিলিট হয়েছে।"
    );
}


/* =====================================================
   REFRESH EVERYTHING
===================================================== */

function refreshAdminData() {

    loadDashboard();

    renderAdminOrders();
}


/* =====================================================
   EVENT LISTENERS
===================================================== */


/* Login */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );
}


/* Logout */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        handleLogout
    );
}


/* Dashboard Refresh */

if (refreshDashboardButton) {

    refreshDashboardButton.addEventListener(
        "click",
        refreshAdminData
    );
}


/* Orders Refresh */

if (adminRefreshOrders) {

    adminRefreshOrders.addEventListener(
        "click",
        refreshAdminData
    );
}


/* Search */

if (adminOrderSearch) {

    adminOrderSearch.addEventListener(
        "input",
        renderAdminOrders
    );
}


/* Status Filter */

if (adminOrderStatusFilter) {

    adminOrderStatusFilter.addEventListener(
        "change",
        renderAdminOrders
    );
}


/* Close Modal */

if (adminOrderModalClose) {

    adminOrderModalClose.addEventListener(
        "click",
        closeAdminOrderModal
    );
}


/* Save Status */

if (adminSaveStatusButton) {

    adminSaveStatusButton.addEventListener(
        "click",
        saveAdminOrderStatus
    );
}


/* Delete From Modal */

if (adminDeleteOrderButton) {

    adminDeleteOrderButton.addEventListener(
        "click",
        function () {

            if (!currentAdminOrderId) {
                return;
            }

            deleteAdminOrder(
                currentAdminOrderId
            );
        }
    );
}


/* Click Outside Modal */

if (adminOrderModalOverlay) {

    adminOrderModalOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                adminOrderModalOverlay
            ) {

                closeAdminOrderModal();
            }
        }
    );
}


/* Escape Key */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            adminOrderModalOverlay &&
            adminOrderModalOverlay.classList.contains(
                "active"
            )
        ) {

            closeAdminOrderModal();
        }
    }
);


/* =====================================================
   CROSS-TAB ORDER UPDATE
===================================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            ORDERS_STORAGE_KEY
        ) {

            refreshAdminData();
        }
    }
);


/* =====================================================
   INITIALIZE ADMIN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAdminLogin();

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
   Required for inline buttons
===================================================== */

window.openAdminOrderModal =
    openAdminOrderModal;

window.deleteAdminOrder =
    deleteAdminOrder;

window.closeAdminOrderModal =
    closeAdminOrderModal;


/* =====================================================
   END OF ADMIN.JS
===================================================== */