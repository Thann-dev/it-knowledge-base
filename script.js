const defaultArticles = [
  {
    title: "Máy in không in được",
    category: "Máy in",
    level: "Cơ bản",
    updated: "05/06/2026",
    keywords: ["printer", "máy in", "không in", "offline"],
    problem:
      "Người dùng gửi lệnh in nhưng máy in không hoạt động, báo Offline hoặc tài liệu bị kẹt trong hàng đợi.",
    steps: [
      "Kiểm tra máy in đã bật nguồn chưa.",
      "Kiểm tra dây mạng hoặc cáp USB kết nối với máy in.",
      "Vào Settings > Bluetooth & devices > Printers & scanners.",
      "Chọn máy in đang sử dụng và kiểm tra trạng thái.",
      "Nếu máy in báo Offline, bỏ chọn chế độ Use Printer Offline.",
      "Xóa các lệnh in đang bị kẹt trong hàng đợi.",
      "Khởi động lại dịch vụ Print Spooler bằng Services.msc.",
      "In thử lại một trang test page."
    ],
    note:
      "Nếu nhiều người cùng không in được, cần kiểm tra máy in, switch mạng hoặc print server."
  },
  {
    title: "Không kết nối được Wi-Fi công ty",
    category: "Wi-Fi",
    level: "Cơ bản",
    updated: "05/06/2026",
    keywords: ["wifi", "wi-fi", "mạng không dây", "không kết nối"],
    problem:
      "Laptop không kết nối được Wi-Fi công ty hoặc báo sai mật khẩu dù nhập đúng.",
    steps: [
      "Kiểm tra Wi-Fi trên laptop đã bật chưa.",
      "Bật tắt Airplane Mode.",
      "Forget mạng Wi-Fi hiện tại rồi kết nối lại.",
      "Nhập lại mật khẩu Wi-Fi chính xác.",
      "Khởi động lại laptop.",
      "Cập nhật driver card Wi-Fi nếu lỗi vẫn còn.",
      "Thử kết nối bằng thiết bị khác để xác định lỗi từ laptop hay hệ thống Wi-Fi."
    ],
    note:
      "Nếu nhiều người cùng không kết nối được, cần kiểm tra Access Point, DHCP hoặc firewall."
  },
  {
    title: "Outlook không nhận được email mới",
    category: "Outlook",
    level: "Cơ bản",
    updated: "05/06/2026",
    keywords: ["outlook", "email", "không nhận mail", "send receive"],
    problem:
      "Người dùng mở Outlook nhưng không thấy email mới, trong khi webmail vẫn nhận bình thường.",
    steps: [
      "Kiểm tra máy tính có Internet không.",
      "Mở Outlook và bấm Send/Receive All Folders.",
      "Kiểm tra Outlook có đang ở chế độ Work Offline không.",
      "Kiểm tra dung lượng mailbox có bị đầy không.",
      "Đóng Outlook rồi mở lại.",
      "Kiểm tra trạng thái tài khoản trong Account Settings.",
      "Tạo lại Outlook profile nếu profile hiện tại bị lỗi.",
      "Kiểm tra với webmail để xác nhận email server vẫn hoạt động."
    ],
    note:
      "Nếu Outlook yêu cầu nhập mật khẩu liên tục, cần kiểm tra mật khẩu tài khoản hoặc xác thực Microsoft 365."
  },
  {
    title: "Không kết nối được VPN",
    category: "VPN",
    level: "Trung bình",
    updated: "05/06/2026",
    keywords: ["vpn", "remote", "không kết nối", "work from home"],
    problem:
      "Người dùng làm việc từ xa không kết nối được VPN vào hệ thống công ty.",
    steps: [
      "Kiểm tra Internet tại nhà hoặc mạng đang sử dụng.",
      "Kiểm tra tài khoản VPN có bị khóa hoặc hết hạn không.",
      "Đảm bảo người dùng nhập đúng username, password và mã MFA nếu có.",
      "Kiểm tra thời gian hệ thống trên laptop có chính xác không.",
      "Thử đổi sang mạng khác, ví dụ 4G hotspot.",
      "Kiểm tra phần mềm VPN đã đúng phiên bản chưa.",
      "Gỡ và cài lại VPN client nếu cần.",
      "Kiểm tra log lỗi VPN để xác định nguyên nhân."
    ],
    note:
      "Không gửi mật khẩu VPN qua chat/email. Luôn yêu cầu người dùng đổi mật khẩu theo quy trình bảo mật."
  },
  {
    title: "Phần mềm không mở được",
    category: "Phần mềm",
    level: "Cơ bản",
    updated: "05/06/2026",
    keywords: ["phần mềm", "không mở", "application", "crash"],
    problem:
      "Người dùng bấm mở phần mềm nhưng phần mềm không chạy hoặc tự tắt.",
    steps: [
      "Khởi động lại máy tính.",
      "Kiểm tra phần mềm có đang chạy ngầm trong Task Manager không.",
      "Run as Administrator để thử quyền chạy phần mềm.",
      "Kiểm tra dung lượng ổ C còn đủ không.",
      "Kiểm tra phần mềm có bị antivirus chặn không.",
      "Cập nhật phần mềm lên phiên bản mới.",
      "Gỡ và cài lại phần mềm nếu lỗi vẫn còn.",
      "Kiểm tra Event Viewer để xem log lỗi chi tiết."
    ],
    note:
      "Trước khi gỡ phần mềm, cần kiểm tra có dữ liệu local cần backup hay không."
  }
];

let articles = JSON.parse(localStorage.getItem("kb_articles")) || defaultArticles;
let currentCategory = "Tất cả";
let authMode = "login";

const defaultUsers = [
  {
    username: "admin",
    password: "admin123",
    role: "admin"
  }
];

let users = JSON.parse(localStorage.getItem("kb_users")) || defaultUsers;
let currentUser = JSON.parse(localStorage.getItem("kb_current_user")) || null;

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

function saveArticles() {
  localStorage.setItem("kb_articles", JSON.stringify(articles));
}

function saveUsers() {
  localStorage.setItem("kb_users", JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem("kb_current_user", JSON.stringify(currentUser));
}

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
  return currentUser && currentUser.role === "admin";
}

function updateAuthUI() {
  if (currentUser) {
    currentUserText.textContent = `${currentUser.username} (${currentUser.role})`;
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
  } else {
    modalTitle.textContent = "Đăng ký";
    submitAuthBtn.textContent = "Đăng ký";
  }
}

function closeAuthModal() {
  authModal.classList.add("hidden");
}

function handleAuthSubmit() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    authMessage.textContent = "Vui lòng nhập đầy đủ username và mật khẩu.";
    return;
  }

  if (authMode === "login") {
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!foundUser) {
      authMessage.textContent = "Sai username hoặc mật khẩu.";
      return;
    }

    currentUser = {
      username: foundUser.username,
      role: foundUser.role
    };

    saveCurrentUser();
    closeAuthModal();
    updateAuthUI();
    return;
  }

  if (authMode === "register") {
    const existedUser = users.find((user) => user.username === username);

    if (existedUser) {
      authMessage.textContent = "Username này đã tồn tại.";
      return;
    }

    users.push({
      username,
      password,
      role: "user"
    });

    saveUsers();

    currentUser = {
      username,
      role: "user"
    };

    saveCurrentUser();
    closeAuthModal();
    updateAuthUI();
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("kb_current_user");
  updateAuthUI();
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

function saveArticleFromForm() {
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
    note
  };

  if (editIndex.value === "") {
    articles.unshift(articleData);
  } else {
    articles[Number(editIndex.value)] = articleData;
  }

  saveArticles();
  clearArticleForm();
  renderArticles();
}

function editArticle(index) {
  if (!isAdmin()) {
    alert("Bạn không có quyền sửa bài.");
    return;
  }

  const article = articles[index];

  editIndex.value = index;
  articleTitle.value = article.title;
  articleCategory.value = article.category;
  articleLevel.value = article.level;
  articleKeywords.value = article.keywords.join(", ");
  articleProblem.value = article.problem;
  articleSteps.value = article.steps.join("\n");
  articleNote.value = article.note;

  saveArticleBtn.textContent = "Cập nhật bài viết";
  window.scrollTo({
    top: adminPanel.offsetTop - 20,
    behavior: "smooth"
  });
}

function deleteArticle(index) {
  if (!isAdmin()) {
    alert("Bạn không có quyền xóa bài.");
    return;
  }

  const confirmDelete = confirm("Bạn có chắc muốn xóa bài viết này không?");

  if (!confirmDelete) {
    return;
  }

  articles.splice(index, 1);
  saveArticles();
  renderArticles();
}

function renderArticles() {
  const searchText = removeVietnameseAccent(searchInput.value.toLowerCase());

  const filteredArticles = articles
    .map((article, originalIndex) => {
      return {
        ...article,
        originalIndex
      };
    })
    .filter((article) => {
      const fullText = removeVietnameseAccent(
        `
        ${article.title}
        ${article.category}
        ${article.level}
        ${article.keywords.join(" ")}
        ${article.problem}
        ${article.steps.join(" ")}
        ${article.note}
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
      const stepsHtml = article.steps
        .map((step) => `<li>${step}</li>`)
        .join("");

      const adminButtons = isAdmin()
        ? `
          <div class="article-admin-actions">
            <button class="edit-btn" onclick="editArticle(${article.originalIndex})">Sửa</button>
            <button class="delete-btn" onclick="deleteArticle(${article.originalIndex})">Xóa</button>
          </div>
        `
        : "";

      return `
        <article class="article-card">
          <h3>${article.title}</h3>

          <div class="article-meta">
            <span class="tag">${article.category}</span>
            <span class="tag level">${article.level}</span>
            <span class="tag updated">Cập nhật: ${article.updated}</span>
          </div>

          <p><strong>Triệu chứng:</strong> ${article.problem}</p>

          <details>
            <summary>Xem hướng dẫn xử lý</summary>

            <ol class="steps">
              ${stepsHtml}
            </ol>

            <div class="note-box">
              <strong>Ghi chú IT:</strong> ${article.note}
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

updateAuthUI();