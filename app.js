const { createClient } = window.supabase;

const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_ANON_KEY;

const message = document.getElementById("message");
const authCard = document.getElementById("auth-card");
const dashboard = document.getElementById("dashboard");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

let db;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "success";
}

function switchTab(tab) {
  const registering = tab === "register";
  registerForm.classList.toggle("hidden", !registering);
  loginForm.classList.toggle("hidden", registering);
  document.getElementById("show-register").classList.toggle("active", registering);
  document.getElementById("show-login").classList.toggle("active", !registering);
  showMessage("");
}

document.getElementById("show-register").addEventListener("click", () => switchTab("register"));
document.getElementById("show-login").addEventListener("click", () => switchTab("login"));

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fullName = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm").value;

  if (fullName.length < 2) return showMessage("Please enter your full name.", true);
  if (!validateEmail(email)) return showMessage("Enter a valid email address.", true);
  if (password.length < 8) return showMessage("Password must be at least 8 characters.", true);
  if (password !== confirmPassword) return showMessage("Passwords do not match.", true);

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error) return showMessage(error.message, true);

  registerForm.reset();
  if (data.session) {
    showMessage("Registration successful. You are signed in.");
    await showDashboard(data.user);
  } else {
    showMessage("Registration received. Check your email to confirm your account, then log in.");
    switchTab("login");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  if (!validateEmail(email)) return showMessage("Enter a valid email address.", true);
  if (!password) return showMessage("Enter your password.", true);

  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return showMessage(error.message, true);

  loginForm.reset();
  await showDashboard(data.user);
});

async function showDashboard(user) {
  authCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  const name = user.user_metadata?.full_name || user.email || "Student";
  document.getElementById("welcome-text").textContent = `Hello, ${name}`;
}

document.getElementById("logout-button").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();
  if (error) return alert(error.message);
  dashboard.classList.add("hidden");
  authCard.classList.remove("hidden");
  switchTab("login");
});

document.getElementById("forgot-password").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  if (!validateEmail(email)) return showMessage("Enter your email in the login field first.", true);

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return showMessage(error.message, true);
  showMessage("If the email is registered, a password reset link will be sent.");
});

async function initialize() {
  if (!supabaseUrl || supabaseUrl.includes("YOUR_") ||
      !supabaseKey || supabaseKey.includes("YOUR_")) {
    showMessage("Add your Supabase Project URL and publishable/anon key in config.js.", true);
    return;
  }

  db = createClient(supabaseUrl, supabaseKey);
  const { data: { session }, error } = await db.auth.getSession();
  if (error) return showMessage(error.message, true);
  if (session?.user) await showDashboard(session.user);
}

initialize();
