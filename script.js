import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let articles = [];
let currentCategory = "Tất cả";
let currentUser = null;
let currentUserRole = "guest";
let authMode = "login";

const articleList = document.getElementById("articleList");
const searchInput = document.getElementById("searchInput");
const totalArticles = document.getElementById("totalArticles");
const currentFilter = document.getElementById("currentFilter");
const categoryButtons = document.querySelectorAll(".category-btn");

const currentUserText = document.getElementById("currentUserText");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authModal = document.getElementById("authModal");
const modalTitle = document.getElementById("modalTitle");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const submitAuthBtn = document.getElementById("submitAuthBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const authMessage = document.getElementById("authMessage");

const adminPanel = document.getElementById("adminPanel");
const editIndex = document.getElementById("editIndex");
const articleTitle = document.getElementById("articleTitle");
const articleCategory = document.getElementById("articleCategory");
const articleLevel = document.getElementById("articleLevel");
const articleKeywords = document.getElementById("articleKeywords");
const articleProblem = document.getElementById("articleProblem");
const articleSteps = document.getElementById("articleSteps");
const articleNote = document.getElementById("articleNote");
const saveArticleBtn = document.getElementById("saveArticleBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

function removeVietnameseAccent(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function getToday() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

function isAdmin() {
  return currentUser && currentUserRole === "admin";
}

async function loadArticlesFromFirestore() {
  articles = [];

  const querySnapshot = await getDocs(collection(db, "articles"));

  querySnapshot.forEach((docItem) => {
    articles.push({
      id: docItem.id,
      ...docItem.data()
    });
  });

  renderArticles();
}

async function getUserRole(uid) {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().role || "user";
  }

  return "user";
}

function updateAuthUI() {
  if (currentUser) {
    currentUserText.textContent = `${currentUser.email} (${currentUserRole})`;
    loginBtn.classList.add("hidden");
    registerBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    currentUserText.textContent = "Chưa đăng nhập";
    loginBtn.classList.remove("hidden");
    registerBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  if (isAdmin()) {
    adminPanel.classList.remove("hidden");
  } else {
    adminPanel.classList.add("hidden");
  }

  renderArticles();
}

function openAuthModal(mode) {
  authMode = mode;
  authModal.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
  authMessage.textContent = "";

  if (mode === "login") {
    modalTitle.textContent = "Đăng nhập";
    submitAuthBtn.textContent = "Đăng nhập";
    usernameInput.placeholder = "Nhập email";
  } else {
    modalTitle.textContent = "Đăng ký";
    submitAuthBtn.textContent = "Đăng ký";
    usernameInput.placeholder = "Nhập email";
  }
}

function closeAuthModal() {
  authModal.classList.add("hidden");
}

async function handleAuthSubmit() {
  const email = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    authMessage.textContent = "Vui lòng nhập đầy đủ email và mật khẩu.";
    return;
  }

  try {
    if (authMode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
      closeAuthModal();
      return;
    }

    if (authMode === "register") {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: serverTimestamp()
      });

      closeAuthModal();
    }
  } catch (error) {
    authMessage.textContent = "Lỗi: " + error.message;
  }
}

async function logout() {
  await signOut(auth);
}

function clearArticleForm() {
  editIndex.value = "";
  articleTitle.value = "";
  articleCategory.value = "Máy in";
  articleLevel.value = "Cơ bản";
  articleKeywords.value = "";
  articleProblem.value = "";
  articleSteps.value = "";
  articleNote.value = "";
  saveArticleBtn.textContent = "Lưu bài viết";
}

async function saveArticleFromForm() {
  if (!isAdmin()) {
    alert("Bạn không có quyền thực hiện chức năng này.");
    return;
  }

  const title = articleTitle.value.trim();
  const category = articleCategory.value;
  const level = articleLevel.value;
  const keywords = articleKeywords.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  const problem = articleProblem.value.trim();

  const steps = articleSteps.value
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  const note = articleNote.value.trim();

  if (!title || !problem || steps.length === 0) {
    alert("Vui lòng nhập tiêu đề, triệu chứng và các bước xử lý.");
    return;
  }

  const articleData = {
    title,
    category,
    level,
    updated: getToday(),
    keywords,
    problem,
    steps,
    note,
    updatedAt: serverTimestamp()
  };

  try {
    if (editIndex.value === "") {
      await addDoc(collection(db, "articles"), {
        ...articleData,
        createdAt: serverTimestamp()
      });
    } else {
      const articleId = editIndex.value;
      await updateDoc(doc(db, "articles", articleId), articleData);
    }

    clearArticleForm();
    await loadArticlesFromFirestore();
  } catch (error) {
    alert("Lỗi khi lưu bài viết: " + error.message);
  }
}

function editArticle(articleId) {
  if (!isAdmin()) {
    alert("Bạn không có quyền sửa bài.");
    return;
  }

  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    alert("Không tìm thấy bài viết.");
    return;
  }

  editIndex.value = article.id;
  articleTitle.value = article.title || "";
  articleCategory.value = article.category || "Máy in";
  articleLevel.value = article.level || "Cơ bản";
  articleKeywords.value = Array.isArray(article.keywords)
    ? article.keywords.join(", ")
    : "";
  articleProblem.value = article.problem || "";
  articleSteps.value = Array.isArray(article.steps)
    ? article.steps.join("\n")
    : "";
  articleNote.value = article.note || "";

  saveArticleBtn.textContent = "Cập nhật bài viết";

  window.scrollTo({
    top: adminPanel.offsetTop - 20,
    behavior: "smooth"
  });
}

async function deleteArticle(articleId) {
  if (!isAdmin()) {
    alert("Bạn không có quyền xóa bài.");
    return;
  }

  const confirmDelete = confirm("Bạn có chắc muốn xóa bài viết này không?");

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteDoc(doc(db, "articles", articleId));
    await loadArticlesFromFirestore();
  } catch (error) {
    alert("Lỗi khi xóa bài viết: " + error.message);
  }
}

function renderArticles() {
  const searchText = removeVietnameseAccent(searchInput.value.toLowerCase());

  const filteredArticles = articles.filter((article) => {
    const keywords = Array.isArray(article.keywords) ? article.keywords : [];
    const steps = Array.isArray(article.steps) ? article.steps : [];

    const fullText = removeVietnameseAccent(
      `
      ${article.title || ""}
      ${article.category || ""}
      ${article.level || ""}
      ${keywords.join(" ")}
      ${article.problem || ""}
      ${steps.join(" ")}
      ${article.note || ""}
      `.toLowerCase()
    );

    const matchSearch = fullText.includes(searchText);
    const matchCategory =
      currentCategory === "Tất cả" || article.category === currentCategory;

    return matchSearch && matchCategory;
  });

  totalArticles.textContent = filteredArticles.length;
  currentFilter.textContent = currentCategory;

  if (filteredArticles.length === 0) {
    articleList.innerHTML = `
      <div class="empty-state">
        <h3>Không tìm thấy hướng dẫn phù hợp</h3>
        <p>Thử tìm bằng từ khóa khác, ví dụ: máy in, Outlook, VPN, Wi-Fi.</p>
      </div>
    `;
    return;
  }

  articleList.innerHTML = filteredArticles
    .map((article) => {
      const steps = Array.isArray(article.steps) ? article.steps : [];

      const stepsHtml = steps.map((step) => `<li>${step}</li>`).join("");

      const adminButtons = isAdmin()
        ? `
          <div class="article-admin-actions">
            <button class="edit-btn" onclick="editArticle('${article.id}')">Sửa</button>
            <button class="delete-btn" onclick="deleteArticle('${article.id}')">Xóa</button>
          </div>
        `
        : "";

      return `
        <article class="article-card">
          <h3>${article.title || ""}</h3>

          <div class="article-meta">
            <span class="tag">${article.category || ""}</span>
            <span class="tag level">${article.level || ""}</span>
            <span class="tag updated">Cập nhật: ${article.updated || ""}</span>
          </div>

          <p><strong>Triệu chứng:</strong> ${article.problem || ""}</p>

          <details>
            <summary>Xem hướng dẫn xử lý</summary>

            <ol class="steps">
              ${stepsHtml}
            </ol>

            <div class="note-box">
              <strong>Ghi chú IT:</strong> ${article.note || ""}
            </div>
          </details>

          ${adminButtons}
        </article>
      `;
    })
    .join("");
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentCategory = button.dataset.category;
    renderArticles();
  });
});

searchInput.addEventListener("input", renderArticles);

loginBtn.addEventListener("click", () => openAuthModal("login"));
registerBtn.addEventListener("click", () => openAuthModal("register"));
logoutBtn.addEventListener("click", logout);
closeModalBtn.addEventListener("click", closeAuthModal);
submitAuthBtn.addEventListener("click", handleAuthSubmit);
saveArticleBtn.addEventListener("click", saveArticleFromForm);
cancelEditBtn.addEventListener("click", clearArticleForm);

window.editArticle = editArticle;
window.deleteArticle = deleteArticle;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    currentUserRole = await getUserRole(user.uid);
  } else {
    currentUser = null;
    currentUserRole = "guest";
  }

  updateAuthUI();
});

loadArticlesFromFirestore();