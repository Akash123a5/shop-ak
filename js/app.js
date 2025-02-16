document.addEventListener("DOMContentLoaded", () => {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(products => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = "";

            products.forEach(product => {
                let productCard = document.createElement("div");
                productCard.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");
                productCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h6 class="card-title">${product.title}</h6>
                            <p class="text-primary fw-bold">$${product.price}</p>
                            <button class="btn btn-success add-to-cart" 
                                data-id="${product.id}" 
                                data-title="${product.title}" 
                                data-price="${product.price}" 
                                data-image="${product.image}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });

// 🛒 Add to Cart Button Click Event
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
        let product = {
            id: e.target.getAttribute("data-id"),
            title: e.target.getAttribute("data-title"),
            price: e.target.getAttribute("data-price"),
            image: e.target.getAttribute("data-image")
        };
        addToCart(product);

        ✅ পেজ রিলোড হবে কার্টে অ্যাড করার পর
        setTimeout(() => {
            location.reload();
        }, 500); // 0.5 সেকেন্ড ডিলে দিয়ে রিলোড করাচ্ছি যাতে ইউজার বুঝতে পারে
    });
});


            // ✅ Load Cart Count on Page Load
            updateCartCount();
        });
});

// 🛒 লোকাল স্টোরেজে প্রোডাক্ট সংরক্ষণ + UI আপডেট
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        showCustomAlert("⚠️ This product is already in the cart!", "error");
    } else {
        product.quantity = 1;  // ✅ নতুনভাবে quantity সেট করলাম
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();  // ✅ UI আপডেট করবো
        showCustomAlert("✅ Product added to cart!", "success");
    }
}
// এলার্ট তৈরি করা

function showCustomAlert(message, type = "success") {
    // আগের এলার্ট থাকলে মুছে ফেলো
    let oldAlert = document.getElementById("customAlert");
    if (oldAlert) {
        oldAlert.remove();
    }

    // এলার্ট তৈরি করা
    let alertBox = document.createElement("div");
    alertBox.id = "customAlert";
    alertBox.innerText = message;

    // বেসিক স্টাইল
    alertBox.style.position = "fixed";
    alertBox.style.top = "-50px";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.color = "white";
    alertBox.style.padding = "15px 25px";
    alertBox.style.fontSize = "16px";
    alertBox.style.fontWeight = "bold";
    alertBox.style.borderRadius = "8px";
    alertBox.style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.3)";
    alertBox.style.opacity = "0";
    alertBox.style.transition = "top 0.5s ease-in-out, opacity 0.5s ease-in-out";

    // আলাদা রঙ সেট করা (সাক্সেস & এরর)
    if (type === "success") {
        alertBox.style.background = "linear-gradient(90deg, #4CAF50, #2E8B57)";
    } else {
        alertBox.style.background = "linear-gradient(90deg, #FF5733, #C70039)";
    }

    // এলার্টকে বডির মধ্যে যোগ করা
    document.body.appendChild(alertBox);

    // এলার্ট দেখানো (স্লাইড-ইন)
    setTimeout(() => {
        alertBox.style.top = "20px";
        alertBox.style.opacity = "1";
    }, 100);

    // ৩ সেকেন্ড পর অটো রিমুভ
    setTimeout(() => {
        alertBox.style.top = "-50px";
        alertBox.style.opacity = "0";
        setTimeout(() => {
            alertBox.remove();
        }, 500);
    }, 3000);
}






// 🔄 UI-তে "Cart" বাটনের সংখ্যা আপডেট করা
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBadge = document.getElementById("cartBadge"); // ✅ তোমার কার্টের ব্যাজ আপডেট হবে

    if (cartBadge) {
        cartBadge.innerText = cart.length;
        cartBadge.style.display = cart.length > 0 ? "inline-block" : "none"; // 🛒 0 হলে হাইড
    }
}

// cart 

document.getElementById('cartIcon').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
});
document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartUI();

function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cartItems");
    let cartCount = document.getElementById("cartCount");

    cartItemsContainer.innerHTML = ""; // পুরানো ডাটা মুছে নতুন ডাটা বসাবে
    cartCount.innerText = cart.length; // কার্ট আইকনের সংখ্যা আপডেট

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p class='text-center'>Cart is empty</p>";
        return;
    }

    let totalPrice = 0; // টোটাল প্রাইস ক্যালকুলেট করার জন্য

    cart.forEach((item, index) => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "border-bottom", "p-5");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 140px; height: 140px;">
            <div class="flex-grow-1 mx-2">
                <p class="mb-0">${item.title}</p>
                <p class="mb-0">$${item.price}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-primary" onclick="changeQuantity(${index}, 1)">+</button>
                <span>${item.quantity ?? 1}</span>
                <button class="btn btn-sm btn-danger" onclick="changeQuantity(${index}, -1)">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);

        // টোটাল প্রাইস ক্যালকুলেট করা
        totalPrice += item.price * (item.quantity ?? 1);
    });

    // টোটাল প্রাইস দেখানো
    let totalPriceElement = document.createElement("div");
    totalPriceElement.classList.add("cart-footer", "text-end", "mt-3");
    totalPriceElement.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`;
    cartItemsContainer.appendChild(totalPriceElement);
}


function changeQuantity(index, amount) {
    if (cart[index].quantity + amount <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity += amount;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "clearCart") {
        let cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
        showCustomAlert("✅ Cart Cleared Successfully!", "success");
    }
});




function reloadPage() {
    location.reload(); // পেজ রিলোড করবে
}



// ✅ টোস্ট মেসেজ ফাংশন
function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerText = message;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => { toast.remove(); }, 500);
    }, 2000);
}

// mas
document.getElementById("showToastBtn").addEventListener("click", function() {
    let toast = document.getElementById("toast");

    toast.innerText = "🚀 Coming soon!";
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
});


