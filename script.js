let products = JSON.parse(localStorage.getItem("products")) || [];
let totalSale = parseFloat(localStorage.getItem("totalSale")) || 0;
let totalDue = parseFloat(localStorage.getItem("totalDue")) || 0;

let lastInvoice = null;

const shop = {
name: "Imran Electronics",
address: "Rahim Sardar Market, Jashore",
phone: "01952325903"
};

function saveData(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("totalSale", totalSale);
localStorage.setItem("totalDue", totalDue);
}

function loadProducts(){
let select = document.getElementById("productSelect");
select.innerHTML="";
products.forEach(p=>{
let option=document.createElement("option");
option.value=p.name;
option.textContent=p.name+" (স্টক:"+p.stock+")";
select.appendChild(option);
});
}

function addProduct(){
let name=document.getElementById("pName").value.trim();
let price=parseFloat(document.getElementById("pPrice").value);
let stock=parseInt(document.getElementById("pStock").value);

if(!name||price<=0||stock<0){
alert("সঠিক তথ্য দিন");
return;
}

products.push({name,price,stock});
saveData();
loadProducts();

document.getElementById("pName").value="";
document.getElementById("pPrice").value="";
document.getElementById("pStock").value="";
}

function sellProduct(){

let customerName=document.getElementById("customerName").value||"Walk-in";
let customerPhone=document.getElementById("customerPhone").value||"-";

let name=document.getElementById("productSelect").value;
let qty=parseInt(document.getElementById("qty").value);

let product=products.find(p=>p.name===name);

if(!product||qty<=0||product.stock<qty){
alert("সমস্যা আছে");
return;
}

let amount=product.price*qty;
let paid=parseFloat(prompt("কত টাকা পেয়েছেন?"));

if(isNaN(paid)||paid<0){
alert("সঠিক Paid দিন");
return;
}

let due=amount-paid;

product.stock-=qty;
totalSale+=amount;
if(due>0) totalDue+=due;

lastInvoice={
customerName,
customerPhone,
product:name,
qty,
price:product.price,
amount,
paid,
due:due>0?due:0,
date:new Date().toLocaleString()
};

saveData();
loadProducts();
updateSummary();

document.getElementById("qty").value="";
document.getElementById("customerName").value="";
document.getElementById("customerPhone").value="";

alert("বিক্রয় সম্পন্ন");
}

function updateSummary(){
document.getElementById("totalSale").innerText=totalSale;
document.getElementById("totalDue").innerText=totalDue;
}

function printInvoice(){

if(!lastInvoice){
alert("আগে বিক্রয় করুন");
return;
}

let w=window.open("","","width=350,height=600");

w.document.write(`
<html>
<head>
<style>
body{font-family:monospace;width:280px;margin:auto;}
h2{text-align:center;margin:5px 0;}
hr{border:1px dashed black;}
p{margin:4px 0;font-size:13px;}
.center{text-align:center;}
.bold{font-weight:bold;}
</style>
</head>
<body>

<h2>${shop.name}</h2>
<div class="center">${shop.address}</div>
<div class="center">Mobile: ${shop.phone}</div>

<hr>

<p>Customer: ${lastInvoice.customerName}</p>
<p>Phone: ${lastInvoice.customerPhone}</p>

<hr>

<p>পণ্য: ${lastInvoice.product}</p>
<p>Qty: ${lastInvoice.qty}</p>
<p>Price: ${lastInvoice.price} ৳</p>

<hr>

<p class="bold">মোট: ${lastInvoice.amount} ৳</p>
<p>Paid: ${lastInvoice.paid} ৳</p>
<p>Due: ${lastInvoice.due} ৳</p>

<hr>

<p>Date: ${lastInvoice.date}</p>

<div class="center">ধন্যবাদ ❤️</div>

</body>
</html>
`);

w.document.close();
w.print();
}

loadProducts();
updateSummary();