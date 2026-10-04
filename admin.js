/* =====================================================
   IMRAN SHOP - ADMIN PANEL
   Stable Version
   Order Details + Print Invoice
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
   SHOP INFORMATION
===================================================== */

const SHOP_NAME =
    "ইমরান ইলেকট্রনিক্স অ্যান্ড মোবাইল সার্ভিসিং সেন্টার";

const SHOP_ADDRESS =
    "গদখালি বাজার বাস স্ট্যান্ড, রহিম সরদার মার্কেট, ঝিকরগাছা, যশোর।";


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

    closeDetails();

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
   GET ORDER BY ID
===================================================== */

function getOrderById(orderId) {

    return getOrders().find(
        order =>
            String(order.orderId) ===
            String(orderId)
    );

}


/* =====================================================
   RENDER ORDER ITEMS
===================================================== */

function renderOrderItems(items) {

    if (
        !Array.isArray(items) ||
        !items.length
    ) {

        return `

            <p class="empty-items">
                এই অর্ডারে কোনো পণ্য পাওয়া যায়নি।
            </p>

        `;

    }


    return items.map(
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

                            ×

                            ${formatMoney(price)}
                        </small>

                    </div>

                    <strong>
                        ${formatMoney(total)}
                    </strong>

                </div>

            `;

        }
    ).join("");

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


    const itemsHtml =
        renderOrderItems(items);


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


                <div class="order-actions">

                    <button
                        type="button"
                        class="details-btn"
                        data-details-id="${escapeHtml(
                            order.orderId || ""
                        )}"
                    >
                        👁️ বিস্তারিত
                    </button>


                    <button
                        type="button"
                        class="print-btn"
                        data-print-id="${escapeHtml(
                            order.orderId || ""
                        )}"
                    >
                        🖨️ Print
                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        data-delete-id="${escapeHtml(
                            order.orderId || ""
                        )}"
                    >
                        🗑️ মুছুন
                    </button>

                </div>

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

        closeDetails();

        renderDashboard();

        showToast(
            "অর্ডার মুছে ফেলা হয়েছে।"
        );

    }

}


/* =====================================================
   ORDER DETAILS
===================================================== */

function openOrderDetails(orderId) {

    const order =
        getOrderById(orderId);


    if (!order) {

        showToast(
            "অর্ডার পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    const modal =
        $("orderDetailsModal");

    const content =
        $("detailsContent");


    if (!modal || !content) {

        return;

    }


    const customer =
        order.customer || {};


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const currentStatus =
        order.status || "Pending";


    const productsHtml =
        items.length

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

                    <div class="details-product">

                        <div class="details-product-icon">
                            ${escapeHtml(
                                item.icon || "📦"
                            )}
                        </div>

                        <div>

                            <div class="details-product-name">
                                ${escapeHtml(
                                    item.name ||
                                    "পণ্য"
                                )}
                            </div>

                            <div class="details-product-meta">

                                ${quantity.toLocaleString(
                                    "bn-BD"
                                )}

                                ×

                                ${formatMoney(price)}

                            </div>

                        </div>

                        <div class="details-product-price">

                            ${formatMoney(total)}

                        </div>

                    </div>

                `;

            }
        ).join("")

        : `

            <p class="empty-items">
                কোনো পণ্য পাওয়া যায়নি।
            </p>

        `;


    content.innerHTML = `

        <div class="details-order-top">

            <div class="details-info-card">

                <span>
                    Order ID
                </span>

                <strong>
                    ${escapeHtml(
                        order.orderId || "N/A"
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    অর্ডারের তারিখ
                </span>

                <strong>
                    ${escapeHtml(
                        formatDate(
                            order.createdAt
                        )
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    Customer Name
                </span>

                <strong>
                    ${escapeHtml(
                        customer.name || "—"
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    Phone
                </span>

                <strong>
                    ${escapeHtml(
                        customer.phone || "—"
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    District
                </span>

                <strong>
                    ${escapeHtml(
                        customer.district || "—"
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    Status
                </span>

                <strong>
                    ${escapeHtml(
                        STATUS_LABELS[
                            currentStatus
                        ] ||
                        currentStatus
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    Payment Method
                </span>

                <strong>
                    ${escapeHtml(
                        order.paymentMethod ||
                        "Cash on Delivery"
                    )}
                </strong>

            </div>


            <div class="details-info-card">

                <span>
                    Delivery Address
                </span>

                <strong>
                    ${escapeHtml(
                        customer.address || "—"
                    )}
                </strong>

            </div>

        </div>


        <h3 class="details-section-title">
            🛍️ পণ্যসমূহ
        </h3>


        <div>

            ${productsHtml}

        </div>


        <div class="details-total-box">

            <div class="details-total-row">

                <span>
                    Subtotal
                </span>

                <strong>
                    ${formatMoney(
                        order.subtotal
                    )}
                </strong>

            </div>


            <div class="details-total-row">

                <span>
                    Delivery Charge
                </span>

                <strong>
                    ${formatMoney(
                        order.deliveryCharge
                    )}
                </strong>

            </div>


            <div class="details-total-row grand">

                <span>
                    Grand Total
                </span>

                <strong>
                    ${formatMoney(
                        order.grandTotal
                    )}
                </strong>

            </div>

        </div>

    `;


    modal.dataset.orderId =
        order.orderId || "";


    modal.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );

}


function closeDetails() {

    const modal =
        $("orderDetailsModal");


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    modal.dataset.orderId =
        "";


    document.body.classList.remove(
        "modal-open"
    );

}


/* =====================================================
   PRINT INVOICE
===================================================== */

function printInvoice(orderId) {

    const order =
        getOrderById(orderId);


    if (!order) {

        showToast(
            "অর্ডার পাওয়া যায়নি।",
            "error"
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
        items.length

        ? items.map(
            (item, index) => {

                const quantity =
                    Number(
                        item.quantity || 0
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                const total =
                    quantity * price;


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td class="product-name">
                            ${escapeHtml(
                                item.name ||
                                "পণ্য"
                            )}
                        </td>

                        <td>
                            ${quantity.toLocaleString(
                                "bn-BD"
                            )}
                        </td>

                        <td>
                            ${formatMoney(price)}
                        </td>

                        <td>
                            ${formatMoney(total)}
                        </td>

                    </tr>

                `;

            }
        ).join("")

        : `

            <tr>

                <td
                    colspan="5"
                    class="no-products"
                >
                    কোনো পণ্য পাওয়া যায়নি।
                </td>

            </tr>

        `;


    const invoiceHtml = `

<!DOCTYPE html>

<html lang="bn">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Invoice -
        ${escapeHtml(
            order.orderId || "N/A"
        )}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        body {

            margin: 0;

            padding: 25px;

            background: #f2f2f2;

            color: #111;

            font-family:
                Arial,
                "Noto Sans Bengali",
                sans-serif;

        }


        .invoice {

            width: 210mm;

            min-height: 297mm;

            margin: auto;

            padding: 18mm;

            background: white;

            box-shadow:
                0 5px 25px
                rgba(0,0,0,.12);

        }


        .invoice-header {

            display: flex;

            justify-content: space-between;

            gap: 25px;

            padding-bottom: 18px;

            border-bottom:
                2px solid #166534;

        }


        .shop-name {

            color: #166534;

            font-size: 23px;

            font-weight: 800;

            margin-bottom: 6px;

        }


        .shop-address {

            color: #555;

            font-size: 11px;

            line-height: 1.7;

        }


        .invoice-title {

            text-align: right;

        }


        .invoice-title h1 {

            margin: 0;

            color: #166534;

            font-size: 28px;

            letter-spacing: 1px;

        }


        .invoice-title p {

            margin: 4px 0;

            font-size: 11px;

            color: #555;

        }


        .customer-section {

            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 10px;

            margin-top: 20px;

        }


        .info-box {

            border:
                1px solid #ddd;

            padding: 10px;

            border-radius: 5px;

        }


        .info-box.full {

            grid-column: 1 / -1;

        }


        .info-label {

            color: #666;

            font-size: 9px;

            margin-bottom: 3px;

        }


        .info-value {

            font-size: 11px;

            font-weight: 700;

            overflow-wrap: anywhere;

        }


        .items-title {

            margin:
                22px 0 8px;

            color: #166534;

            font-size: 14px;

        }


        table {

            width: 100%;

            border-collapse: collapse;

        }


        th {

            background: #166534;

            color: white;

            font-size: 10px;

            padding: 9px 7px;

            text-align: left;

        }


        td {

            border:
                1px solid #ddd;

            padding: 8px 7px;

            font-size: 10px;

        }


        td:first-child,
        th:first-child {

            text-align: center;

            width: 35px;

        }


        .product-name {

            font-weight: 700;

        }


        .no-products {

            text-align: center;

            color: #777;

        }


        .summary {

            width: 300px;

            max-width: 100%;

            margin:
                15px 0 0 auto;

        }


        .summary-row {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            padding: 5px 0;

            font-size: 10px;

        }


        .summary-row.total {

            margin-top: 5px;

            padding-top: 9px;

            border-top:
                2px solid #166534;

            font-size: 14px;

            font-weight: 800;

            color: #166534;

        }


        .payment {

            margin-top: 15px;

            padding: 9px;

            background: #f5f8f5;

            border:
                1px solid #ddd;

            font-size: 10px;

        }


        .footer-note {

            margin-top: 45px;

            text-align: center;

            color: #666;

            font-size: 10px;

        }


        .signature-area {

            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 80px;

            margin-top: 55px;

        }


        .signature {

            text-align: center;

        }


        .signature-line {

            border-top:
                1px solid #333;

            padding-top: 7px;

            font-size: 10px;

        }


        .print-actions {

            width: 210mm;

            margin:
                15px auto 0;

            display: flex;

            justify-content: center;

            gap: 10px;

        }


        .print-actions button {

            border: 0;

            padding: 10px 18px;

            border-radius: 6px;

            cursor: pointer;

            font-weight: 700;

        }


        .print-button {

            background: #166534;

            color: white;

        }


        .close-button {

            background: #ddd;

            color: #111;

        }


        @media print {

            @page {

                size: A4;

                margin: 0;

            }


            body {

                padding: 0;

                background: white;

            }


            .invoice {

                width: 210mm;

                min-height: 297mm;

                margin: 0;

                box-shadow: none;

            }


            .print-actions {

                display: none;

            }

        }


        @media screen and (max-width: 800px) {

            body {

                padding: 10px;

            }


            .invoice {

                width: 100%;

                min-height: auto;

                padding: 20px;

            }


            .invoice-header {

                flex-direction: column;

            }


            .invoice-title {

                text-align: left;

            }


            .customer-section {

                grid-template-columns: 1fr;

            }


            .info-box.full {

                grid-column: auto;

            }


            .signature-area {

                gap: 25px;

            }


            .print-actions {

                width: 100%;

            }

        }

    </style>

</head>


<body>


<div class="invoice">


    <div class="invoice-header">

        <div>

            <div class="shop-name">
                ${escapeHtml(SHOP_NAME)}
            </div>

            <div class="shop-address">
                ${escapeHtml(SHOP_ADDRESS)}
            </div>

        </div>


        <div class="invoice-title">

            <h1>
                INVOICE
            </h1>

            <p>
                Order ID:
                <strong>
                    ${escapeHtml(
                        order.orderId || "N/A"
                    )}
                </strong>
            </p>

            <p>
                Date:
                ${escapeHtml(
                    formatDate(
                        order.createdAt
                    )
                )}
            </p>

        </div>

    </div>


    <div class="customer-section">


        <div class="info-box">

            <div class="info-label">
                Customer Name
            </div>

            <div class="info-value">
                ${escapeHtml(
                    customer.name || "—"
                )}
            </div>

        </div>


        <div class="info-box">

            <div class="info-label">
                Phone
            </div>

            <div class="info-value">
                ${escapeHtml(
                    customer.phone || "—"
                )}
            </div>

        </div>


        <div class="info-box">

            <div class="info-label">
                District
            </div>

            <div class="info-value">
                ${escapeHtml(
                    customer.district || "—"
                )}
            </div>

        </div>


        <div class="info-box">

            <div class="info-label">
                Payment Method
            </div>

            <div class="info-value">
                ${escapeHtml(
                    order.paymentMethod ||
                    "Cash on Delivery"
                )}
            </div>

        </div>


        <div class="info-box full">

            <div class="info-label">
                Delivery Address
            </div>

            <div class="info-value">
                ${escapeHtml(
                    customer.address || "—"
                )}
            </div>

        </div>

    </div>


    <h2 class="items-title">
        পণ্যসমূহ
    </h2>


    <table>

        <thead>

            <tr>

                <th>
                    #
                </th>

                <th>
                    পণ্যের নাম
                </th>

                <th>
                    Qty
                </th>

                <th>
                    Unit Price
                </th>

                <th>
                    Total
                </th>

            </tr>

        </thead>


        <tbody>

            ${productRows}

        </tbody>

    </table>


    <div class="summary">

        <div class="summary-row">

            <span>
                Subtotal
            </span>

            <strong>
                ${formatMoney(
                    order.subtotal
                )}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Delivery Charge
            </span>

            <strong>
                ${formatMoney(
                    order.deliveryCharge
                )}
            </strong>

        </div>


        <div class="summary-row total">

            <span>
                Grand Total
            </span>

            <strong>
                ${formatMoney(
                    order.grandTotal
                )}
            </strong>

        </div>

    </div>


    <div class="payment">

        <strong>
            Payment:
        </strong>

        ${escapeHtml(
            order.paymentMethod ||
            "Cash on Delivery"
        )}

        &nbsp;&nbsp; | &nbsp;&nbsp;

        <strong>
            Status:
        </strong>

        ${escapeHtml(
            STATUS_LABELS[
                order.status || "Pending"
            ] ||
            order.status ||
            "Pending"
        )}

    </div>


    <div class="signature-area">

        <div class="signature">

            <div class="signature-line">
                Customer Signature
            </div>

        </div>


        <div class="signature">

            <div class="signature-line">
                Seller Signature
            </div>

        </div>

    </div>


    <div class="footer-note">

        ধন্যবাদ — আমাদের সাথে কেনাকাটা করার জন্য।

        <br>

        ${escapeHtml(SHOP_NAME)}

    </div>

</div>


<div class="print-actions">

    <button
        class="print-button"
        onclick="window.print()"
    >
        🖨️ Print Invoice
    </button>


    <button
        class="close-button"
        onclick="window.close()"
    >
        ✕ Close
    </button>

</div>


</body>

</html>

    `;


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


    if (!printWindow) {

        showToast(
            "Print window খোলা যায়নি। Browser popup অনুমতি দিন।",
            "error"
        );

        return;

    }


    printWindow.document.open();

    printWindow.document.write(
        invoiceHtml
    );

    printWindow.document.close();


    printWindow.focus();


    setTimeout(() => {

        try {

            printWindow.print();

        }

        catch (error) {

            console.error(
                "Print error:",
                error
            );

        }

    }, 700);

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


    const closeDetailsButton =
        $("closeDetailsButton");


    const detailsCloseButton =
        $("detailsCloseButton");


    const detailsPrintButton =
        $("detailsPrintButton");


    const detailsModal =
        $("orderDetailsModal");


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


    /* =================================================
       ORDER LIST EVENTS
    ================================================= */

    if (ordersList) {


        /* STATUS CHANGE */

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


        /* BUTTON CLICKS */

        ordersList.addEventListener(
            "click",
            event => {


                /* DETAILS */

                const detailsButton =
                    event.target.closest(
                        "[data-details-id]"
                    );


                if (detailsButton) {

                    openOrderDetails(
                        detailsButton
                            .dataset
                            .detailsId
                    );

                    return;

                }


                /* PRINT */

                const printButton =
                    event.target.closest(
                        "[data-print-id]"
                    );


                if (printButton) {

                    printInvoice(
                        printButton
                            .dataset
                            .printId
                    );

                    return;

                }


                /* DELETE */

                const deleteButton =
                    event.target.closest(
                        "[data-delete-id]"
                    );


                if (deleteButton) {

                    deleteOrder(
                        deleteButton
                            .dataset
                            .deleteId
                    );

                }

            }
        );

    }


    /* =================================================
       DETAILS MODAL EVENTS
    ================================================= */

    if (closeDetailsButton) {

        closeDetailsButton.addEventListener(
            "click",
            closeDetails
        );

    }


    if (detailsCloseButton) {

        detailsCloseButton.addEventListener(
            "click",
            closeDetails
        );

    }


    if (detailsPrintButton) {

        detailsPrintButton.addEventListener(
            "click",
            () => {

                const modal =
                    $("orderDetailsModal");


                if (!modal) {
                    return;
                }


                const orderId =
                    modal.dataset.orderId;


                if (orderId) {

                    printInvoice(
                        orderId
                    );

                }

            }
        );

    }


    if (detailsModal) {

        const overlay =
            detailsModal.querySelector(
                ".details-overlay"
            );


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeDetails
            );

        }

    }


    /* ESC KEY */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeDetails();

            }

        }
    );


    /* =================================================
       CROSS-TAB ORDER UPDATE
    ================================================= */

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