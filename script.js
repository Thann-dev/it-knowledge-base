const articles = [
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

let currentCategory = "Tất cả";

const articleList = document.getElementById("articleList");
const searchInput = document.getElementById("searchInput");
const totalArticles = document.getElementById("totalArticles");
const currentFilter = document.getElementById("currentFilter");
const categoryButtons = document.querySelectorAll(".category-btn");

function removeVietnameseAccent(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function renderArticles() {
  const searchText = removeVietnameseAccent(searchInput.value.toLowerCase());

  const filteredArticles = articles.filter((article) => {
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

renderArticles();