// ===== ORDER HANDLING =====
function placeOrder(productName) {
  alert(`✅ You placed an order for: ${productName}`);

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(productName);
  localStorage.setItem("orders", JSON.stringify(orders));
}

// ===== CUSTOMER DASHBOARD =====
function loadCustomerOrders() {
  // Protect page: redirect if not logged in as customer
  if (localStorage.getItem("isAdmin") === null) {
    alert("⛔ Please login first!");
    window.location.href = "../login.html";
    return;
  }
  if (localStorage.getItem("isAdmin") === "true") {
    alert("⛔ Customers only! Redirecting...");
    window.location.href = "../login.html";
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderList = document.getElementById("orderList");

  if (orderList) {
    if (orders.length === 0) {
      orderList.innerHTML = "<li>No orders yet.</li>";
    } else {
      orderList.innerHTML = orders.map(o => `<li>${o}</li>`).join("");
    }
  }
}

// ===== REGISTER =====
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  // Save user in localStorage (simple demo only)
  localStorage.setItem("user", JSON.stringify({ name, email, password }));

  alert("✅ Registration successful! You can now login.");
  window.location.href = "login.html";
});

// ===== LOGIN (CUSTOMER + ADMIN) =====
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Admin fixed credentials
  if (email === "admin@agrimach.com" && password === "admin123") {
    alert("✅ Admin login successful!");
    localStorage.setItem("isAdmin", "true"); // flag for session
    window.location.href = "dashboard/admin.html";
    return;
  }

  // Customer login
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    alert("✅ Customer login successful!");
    localStorage.setItem("isAdmin", "false");
    window.location.href = "dashboard/customer.html";
  } else {
    alert("❌ Invalid email or password. Try again!");
  }
});

// ===== ADMIN DASHBOARD =====
function loadAdminDashboard() {
  // Protect page: redirect if not logged in as admin
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("⛔ Access denied! Admins only.");
    window.location.href = "../login.html";
    return;
  }

  // Load registered user
  const storedUser = JSON.parse(localStorage.getItem("user"));
  let userList = document.getElementById("userList");

  if (userList) {
    if (storedUser) {
      userList.innerHTML = `<li>${storedUser.name} (${storedUser.email})</li>`;
    } else {
      userList.innerHTML = "<li>No registered users yet.</li>";
    }
  }

  // Load all orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderList = document.getElementById("orderList");

  if (orderList) {
    if (orders.length === 0) {
      orderList.innerHTML = "<li>No orders yet.</li>";
    } else {
      orderList.innerHTML = orders.map(o => `<li>${o}</li>`).join("");
    }
  }

  // Display machineries when admin page loads
  displayMachineries();
}

// ===== CONTACT FORM =====
document.getElementById("contactForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;

  alert(`📩 Message sent!\n\nFrom: ${name}\nEmail: ${email}\nMessage: ${message}`);
});

// ===== MACHINERY UPLOAD =====
document.getElementById("uploadForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("machineryName").value;
  const fileInput = document.getElementById("machineryImage");
  const fileName = fileInput.value.split("\\").pop(); // extract filename

  let machineries = JSON.parse(localStorage.getItem("machineries")) || [];
  machineries.push({
    name,
    image: `../assets/images/${fileName}` // assumes admin manually placed images in repo
  });
  localStorage.setItem("machineries", JSON.stringify(machineries));

  alert("✅ Machinery added!");
  displayMachineries();

  // reset form
  document.getElementById("uploadForm").reset();
});

// ===== DISPLAY MACHINERY GALLERY =====
function displayMachineries() {
  let gallery = document.getElementById("machineryGallery");
  if (!gallery) return;

  let machineries = JSON.parse(localStorage.getItem("machineries")) || [];
  gallery.innerHTML = machineries.map(
    m => `
      <div class="machinery-item">
        <img src="${m.image}" alt="${m.name}" width="200">
        <p>${m.name}</p>
      </div>
    `
  ).join("");
}
