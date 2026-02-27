let products = JSON.parse(localStorage.getItem("products")) || [];
let totalSale = parseFloat(localStorage.getItem("totalSale")) || 0;
let totalDue = parseFloat(localStorage.getItem("totalDue")) || 0;
let lastInvoice = "";

function saveData(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("totalSale", totalSale);
localStorage.setItem("totalDue", totalDue);
}

function loadProducts(){
let select = document.getElementById("productSelect");
select.innerHTML = "";

products.forEach(p=>{
let option = document.createElement("option");
option.value = p.name;
option.textContent = p.name + " (স্টক: " + p.stock + ")";
select.appendChild(option);
});
}

function addProduct(){
let name = document.getElementById("pName").value.trim();
let price = parseFloat(document.getElementById("pPrice").value);
let stock = parseInt(document.getElementById("pStock").value);

if(!name || price<=0 || stock<0){
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
let name = document.getElementById("productSelect").value;
let qty = parseInt(document.getElementById("qty").value);

let product = products.find(p=>p.name===name);

if(!product || qty<=0 || product.stock<qty){
alert("সমস্যা আছে");
return;
}

let amount = product.price * qty;

let paid = prompt("কত টাকা পেয়েছেন?");
paid = parseFloat(paid);

if(isNaN(paid) || paid<0){
alert("সঠিক Paid দিন");
return;
}

let due = amount - paid;

product.stock -= qty;
totalSale += amount;

if(due>0){
totalDue += due;
}

lastInvoice = `
<h2 style="text-align:center;">Imran Electronics</h2>
<hr>
<p>পণ্য: ${product.name}</p>
<p>পরিমাণ: ${qty}</p>
<p>দাম: ${product.price} ৳</p>
<p>মোট: ${amount} ৳</p>
<p>Paid: ${paid} ৳</p>
<p>Due: ${due>0?due:0} ৳</p>
<hr>
<p>ধন্যবাদ</p>
`;

saveData();
loadProducts();
updateSummary();

document.getElementById("qty").value="";
alert("বিক্রয় সম্পন্ন");
}

function updateSummary(){
document.getElementById("totalSale").innerText = totalSale;
document.getElementById("totalDue").innerText = totalDue;
}

function printInvoice(){
if(!lastInvoice){
alert("প্রিন্ট করার জন্য আগে বিক্রয় করুন");
return;
}

let printWindow = window.open("", "", "width=400,height=600");
printWindow.document.write(lastInvoice);
printWindow.document.close();
printWindow.print();
}

loadProducts();
updateSummary();