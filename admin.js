/* =====================================================
   IMRAN SHOP - ADMIN PANEL
   Stable Version
===================================================== */

"use strict";


/* =====================================================
   SETTINGS
===================================================== */

const ORDERS_KEY = "imranShopOrders";

const ADMIN_SESSION_KEY =
    "imranShopAdminSession";

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "123456";


/* =====================================================
   STATUS
===================================================== */

const STATUS_LABELS = {

    Pending: "অপেক্ষমাণ",

    Confirmed: "নিশ্চিত",

    Processing: "প্রসেসিং",

    Shipped: "পাঠানো হয়েছে",

    Delivered: "ডেলিভারি সম্পন্ন",

    Cancelled: "বাতিল"

};


/* =====================================================
   HELPER
===================================================== */

function $(id) {

    return document.getElementById(id);

}


/* =====================================================
   MONEY
===================================================== */

function formatMoney(amount) {

    return "৳" +
        Number(amount || 0)
            .toLocaleString("bn-BD");

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   ORDERS
===================================================== */

function getOrders() {

    try {

        const raw =
            localStorage.getItem(ORDERS_KEY);

        if (!raw) {

            return [];

        }

        const data =
            JSON.parse(raw);

        return Array.isArray(data)
            ? data
            : [];

    }

    catch (error) {

        console.error(
            "Orders read error:",
            error
        );

        return [];

    }

}


function saveOrders(orders) {

    try {

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Orders save error:",
            error
        );

        showToast(
            "অর্ডার সংরক্ষণ করা যায়নি।",
            "error"
        );

        return false;

    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message,
    type = "success"
) {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.className =
        "toast show " + type;

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =====================================================
   LOGIN STATE
===================================================== */

function isLoggedIn() {

    return (
        sessionStorage.getItem(
            ADMIN_SESSION_KEY
        ) === "true"
    );

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    const loginScreen =
        $("loginScreen");

    const adminApp =
        $("adminApp");

    if (!loginScreen || !adminApp) {
        return;
    }

    loginScreen.classList.remove(
        "hidden"
    );

    adminApp.classList.add(
        "hidden"
    );

}


/* =====================================================
   SHOW ADMIN
===================================================== */

function showAdmin() {

    const loginScreen =
        $("loginScreen");

    const adminApp =
        $("adminApp");

    if (!loginScreen || !adminApp) {
        return;
    }

    loginScreen.classList.add(
        "hidden"
    );

    adminApp.classList.remove(
        "hidden"
    );

    renderDashboard();

}


/* =====================================================
   LOGIN
===================================================== */

function login(event) {

    event.preventDefault();

    const username =
        $("adminUsername").value.trim();

    const password =
        $("adminPassword").value;


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        sessionStorage.setItem(
            ADMIN_SESSION_KEY,
            "true"
        );


        $("loginForm").reset();


        $("loginMessage").textContent =
            "";


        showAdmin();


        showToast(
            "সফলভাবে Admin Panel-এ প্রবেশ করেছেন।"
        );

    }

    else {

        $("loginMessage").textContent =
            "❌ ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।";

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    sessionStorage.removeItem(
        ADMIN_SESSION_KEY
    );

    showLogin();

    showToast(
        "Logout সম্পন্ন হয়েছে।"
    );

}


/* =====================================================
   DATE
===================================================== */

function formatDate(dateValue) {

    if (!dateValue) {

        return "তারিখ নেই";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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


/* =====================================================
   TODAY
===================================================== */

function isToday(dateValue) {

    if (!dateValue) {

        return false;

    }


    const date =
        new Date(dateValue);

    const now =
        new Date();


    return (

        date.getFullYear() ===
        now.getFullYear()

        &&

        date.getMonth() ===
        now.getMonth()

        &&

        date.getDate() ===
        now.getDate()

    );

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(status) {

    return String(
        status || "Pending"
    ).toLowerCase();

}


/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

function updateStats(orders) {

    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                order.status ===
                "Pending"
        ).length;


    const processing =
        orders.filter(
            order =>
                order.status ===
                "Processing"
                ||
                order.status ===
                "Confirmed"
                ||
                order.status ===
                "Shipped"
        ).length;


    const delivered =
        orders.filter(
            order =>
                order.status ===
                "Delivered"
        ).length;


    const today =
        orders.filter(
            order =>
                isToday(
                    order.createdAt
                )
        ).length;


    const sales =
        orders

            .filter(
                order =>
                    order.status !==
                    "Cancelled"
            )

            .reduce(
                (
                    sum,
                    order
                ) => {

                    return (
                        sum +
                        Number(
                            order.grandTotal || 0
                        )
                    );

                },
                0
            );


    $("totalOrders").textContent =
        total.toLocaleString(
            "bn-BD"
        );


    $("pendingOrders").textContent =
        pending.toLocaleString(
            "bn-BD"
        );


    $("processingOrders").textContent =
        processing.toLocaleString(
            "bn-BD"
        );


    $("deliveredOrders").textContent =
        delivered.toLocaleString(
            "bn-BD"
        );


    $("totalSales").textContent =
        formatMoney(sales);


    $("todayOrders").textContent =
        today.toLocaleString(
            "bn-BD"
        );

}


/* =====================================================
   RENDER SINGLE ORDER
===================================================== */

function renderOrder(order) {

    const customer =
        order.customer || {};


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const itemsHtml = items.length

        ? items.map(
            item => {

                const quantity =
                    Number(
                        item.quantity || 0
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                const total =
                    price * quantity;


                return `

                    <div class="order-item">

                        <div class="item-icon">
                            ${escapeHtml(
                                item.icon || "📦"
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    item.name ||
                                    "পণ্য"
                                )}
                            </strong>

                            <small>
                                পরিমাণ:
                                ${quantity.toLocaleString(
                                    "bn-BD"
                                )}
                            </small>

                        </div>

                        <strong>
                            ${formatMoney(total)}
                        </strong>

                    </div>

                `;

            }
        ).join("")


        : `

            <p class="empty-items">
                এই অর্ডারে কোনো পণ্য পাওয়া যায়নি।
            </p>

        `;


    const currentStatus =
        order.status || "Pending";


    const statusOptions =
        Object.keys(
            STATUS_LABELS
        )

        .map(
            status => `

                <option
                    value="${status}"
                    ${
                        currentStatus === status
                            ? "selected"
                            : ""
                    }
                >
                    ${STATUS_LABELS[status]}
                </option>

            `
        )

        .join("");


    return `

        <article class="order-card">

            <div class="order-head">

                <div>

                    <span class="small-label">
                        ORDER ID
                    </span>

                    <h3>
                        ${escapeHtml(
                            order.orderId ||
                            "N/A"
                        )}
                    </h3>

                    <small>
                        ${escapeHtml(
                            formatDate(
                                order.createdAt
                            )
                        )}
                    </small>

                </div>


                <div class="status-area">

                    <span
                        class="
                            status-badge
                            ${getStatusClass(
                                currentStatus
                            )}
                        "
                    >
                        ${escapeHtml(
                            STATUS_LABELS[
                                currentStatus
                            ] ||
                            currentStatus
                        )}
                    </span>


                    <select
                        class="status-select"
                        data-order-id="${escapeHtml(
                            order.orderId || ""
                        )}"
                    >

                        ${statusOptions}

                    </select>

                </div>

            </div>


            <!-- CUSTOMER -->

            <div class="customer-grid">

                <div>

                    <span>
                        নাম
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.name ||
                            "—"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        ফোন
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.phone ||
                            "—"
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        জেলা
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.district ||
                            "—"
                        )}
                    </strong>

                </div>


                <div class="address">

                    <span>
                        ঠিকানা
                    </span>

                    <strong>
                        ${escapeHtml(
                            customer.address ||
                            "—"
                        )}
                    </strong>

                </div>

            </div>


            <!-- PRODUCTS -->

            <div class="items">

                <h4>
                    পণ্যসমূহ
                </h4>

                ${itemsHtml}

            </div>


            <!-- FOOTER -->

            <div class="order-footer">

                <div class="totals">

                    <span>

                        Subtotal:

                        <b>
                            ${formatMoney(
                                order.subtotal
                            )}
                        </b>

                    </span>


                    <span>

                        Delivery:

                        <b>
                            ${formatMoney(
                                order.deliveryCharge
                            )}
                        </b>

                    </span>


                    <span class="grand">

                        Total:

                        <b>
                            ${formatMoney(
                                order.grandTotal
                            )}
                        </b>

                    </span>


                    <span>

                        Payment:

                        <b>
                            ${escapeHtml(
                                order.paymentMethod ||
                                "Cash on Delivery"
                            )}
                        </b>

                    </span>

                </div>


                <button
                    type="button"
                    class="delete-btn"
                    data-delete-id="${escapeHtml(
                        order.orderId || ""
                    )}"
                >
                    🗑️ অর্ডার মুছুন
                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   FILTER ORDERS
===================================================== */

function getFilteredOrders() {

    const search =
        $("orderSearch")
            .value
            .trim()
            .toLowerCase();


    const status =
        $("statusFilter")
            .value;


    return getOrders()

        .filter(
            order => {

                const customer =
                    order.customer || {};


                const searchable = [

                    order.orderId,

                    customer.name,

                    customer.phone,

                    customer.district

                ]

                .join(" ")
                .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesStatus =
                    status === "all" ||
                    order.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        )

        .sort(
            (a, b) =>
                new Date(
                    b.createdAt || 0
                )
                -
                new Date(
                    a.createdAt || 0
                )
        );

}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderOrders() {

    const list =
        $("ordersList");


    if (!list) {

        return;

    }


    const orders =
        getFilteredOrders();


    if (!orders.length) {

        list.innerHTML = `

            <div class="empty-orders">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    কোনো অর্ডার পাওয়া যায়নি
                </h3>

                <p>
                    নতুন অর্ডার এলে এখানে দেখা যাবে।
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        orders
            .map(renderOrder)
            .join("");

}


/* =====================================================
   RENDER DASHBOARD
===================================================== */

function renderDashboard() {

    const orders =
        getOrders();


    updateStats(
        orders
    );


    renderOrders();

}


/* =====================================================
   CHANGE STATUS
===================================================== */

function changeStatus(
    orderId,
    newStatus
) {

    const orders =
        getOrders();


    const index =
        orders.findIndex(
            order =>
                order.orderId ===
                orderId
        );


    if (index === -1) {

        showToast(
            "অর্ডার পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    orders[index].status =
        newStatus;


    orders[index].updatedAt =
        new Date().toISOString();


    if (
        saveOrders(orders)
    ) {

        renderDashboard();

        showToast(
            "অর্ডারের status আপডেট হয়েছে।"
        );

    }

}


/* =====================================================
   DELETE ORDER
===================================================== */

function deleteOrder(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                item.orderId ===
                orderId
        );


    if (!order) {

        showToast(
            "অর্ডার পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    const confirmed =
        window.confirm(

            `আপনি কি ${orderId} অর্ডারটি মুছে ফেলতে চান?\n\nএই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`

        );


    if (!confirmed) {

        return;

    }


    const newOrders =
        orders.filter(
            item =>
                item.orderId !==
                orderId
        );


    if (
        saveOrders(newOrders)
    ) {

        renderDashboard();

        showToast(
            "অর্ডার মুছে ফেলা হয়েছে।"
        );

    }

}


/* =====================================================
   EVENTS
===================================================== */

function setupEvents() {

    const loginForm =
        $("loginForm");


    const logoutButton =
        $("logoutButton");


    const refreshButton =
        $("refreshButton");


    const orderSearch =
        $("orderSearch");


    const statusFilter =
        $("statusFilter");


    const ordersList =
        $("ordersList");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            login
        );

    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                renderDashboard();

                showToast(
                    "Dashboard refresh হয়েছে।"
                );

            }
        );

    }


    if (orderSearch) {

        orderSearch.addEventListener(
            "input",
            renderOrders
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderOrders
        );

    }


    if (ordersList) {

        ordersList.addEventListener(
            "change",
            event => {

                if (
                    event.target.classList
                        .contains(
                            "status-select"
                        )
                ) {

                    changeStatus(

                        event.target
                            .dataset
                            .orderId,

                        event.target.value

                    );

                }

            }
        );


        ordersList.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-delete-id]"
                    );


                if (button) {

                    deleteOrder(
                        button.dataset.deleteId
                    );

                }

            }
        );

    }


    /* Cross-tab order update */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                ORDERS_KEY
            ) {

                if (
                    isLoggedIn()
                ) {

                    renderDashboard();

                }

            }

        }
    );

}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        try {

            setupEvents();


            if (
                isLoggedIn()
            ) {

                showAdmin();

            }

            else {

                showLogin();

            }

        }

        catch (error) {

            console.error(
                "Admin Panel initialization error:",
                error
            );


            /* Emergency fallback */

            const loginScreen =
                $("loginScreen");

            const adminApp =
                $("adminApp");


            if (loginScreen) {

                loginScreen.classList.remove(
                    "hidden"
                );

            }


            if (adminApp) {

                adminApp.classList.add(
                    "hidden"
                );

            }

        }

    }
);