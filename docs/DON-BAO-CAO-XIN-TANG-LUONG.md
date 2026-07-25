# ĐƠN BÁO CÁO THÀNH TÍCH & ĐỀ XUẤT XEM XÉT TĂNG LƯƠNG

---

**Kính gửi:** Ban Giám đốc Công ty Cổ phần Cầm đồ Y99  
**Người nộp:** [Họ và tên]  
**Chức vụ:** [Chức vụ hiện tại — ví dụ: Developer / Kỹ sư phần mềm]  
**Phòng ban:** [Phòng ban]  
**Ngày nộp:** 05/07/2026  

---

## I. MỤC ĐÍCH

Tôi trân trọng kính trình Ban Giám đốc **Báo cáo tổng hợp thành tích công việc** trong giai đoạn **06/2025 – 07/2026**, cùng **đề xuất xem xét điều chỉnh mức lương** phù hợp với khối lượng công việc, phạm vi trách nhiệm và giá trị thực tế đã mang lại cho Công ty thông qua việc xây dựng, triển khai và vận hành **8 hệ thống phần mềm** phục vụ toàn bộ chuỗi hoạt động của Y99.

---

## II. TÓM TẮT ĐIỀU HÀNH

| Chỉ số | Số liệu |
|--------|---------|
| Số sản phẩm phần mềm đã xây dựng & đưa vào sử dụng | **8 hệ thống** |
| Tổng số commit (phát triển liên tục) | **~504 commits** |
| Quy mô mã nguồn | **~367.000 dòng code** |
| Database migration (schema) | **130+ migration SQL** |
| Thời gian thực hiện | **06/2025 – 07/2026 (~14 tháng)** |
| Phạm vi phủ sóng | Tín dụng, Kế toán, Nhân sự, Vận hành iPhone, Marketing, OTP, Báo cáo tài chính, Tiện ích nội bộ |

**Phạm vi trách nhiệm:** Thiết kế kiến trúc, phát triển full-stack (frontend + backend + database), triển khai production, bảo trì và cải tiến liên tục — **độc lập hoặc với rất ít hỗ trợ**, tương đương output của một team 3–4 developer trong cùng thời gian.

---

## III. BẢNG TỔNG HỢP 8 SẢN PHẨM

| STT | Tên sản phẩm | Đối tượng sử dụng | Số liệu vận hành | Giá trị mang lại |
|-----|--------------|-------------------|------------------|------------------|
| 1 | **LoanLook** | Ban TGĐ, Kế toán, CS, CA | **30 NV**; **1.529 sao kê**; **680 phí DV**; **486 ghi chú quá hạn**; 4 chi nhánh | Dashboard quản lý khoản vay + báo cáo KPI production |
| 2 | **WorkHub** | Toàn bộ NV nội bộ Y99 | 35 commits; 12 module tiện ích; RBAC đầy đủ | Cổng tiện ích nội bộ: duyệt yêu cầu, bảng tin, email giải ngân |
| 3 | **Y99 HR Connect PWA** | Toàn bộ nhân viên Y99 | 35 tài khoản (24 active); 4.494 lượt chấm công; 2.598 đăng ký ca; 153 kỳ lương | Số hóa chấm công & tính lương, thay Excel/giấy |
| 4 | **Y99 OTP System** | Kế toán, CS, Admin | 17 tài khoản; 597 OTP gửi; 564 lượt xác minh | Kiểm soát xác thực khách, giảm rủi ro gian lận |
| 5 | **Y99 Ngắn ngày** | NV tín dụng các PGD | 125 commits; 35 API; 20 migration DB | Số hóa cầm đồ ngắn hạn end-to-end |
| 6 | **Y99 iCloud Management** | Team vận hành vay iPhone | Nội bộ @y99.vn; RBAC 3 cấp | Quản lý & bảo mật tài khoản iCloud tập trung |
| 7 | **Y99 Payment Slip Generator** | Kế toán / thu ngân PGD | Dùng tại 8+ PGD toàn quốc | Phiếu thu chuẩn + VietQR trong ~2 phút |
| 8 | **Y99 Finance Hub** | Khách hàng / Marketing / Vận hành | Website + CMS + LMS (34 KH, 13 khoản vay) | Hệ sinh thái fintech: marketing → vận hành cho vay |

---

## IV. CHI TIẾT TỪNG SẢN PHẨM & ĐÓNG GÓP

### 1. LoanLook — Hệ thống Quản lý Khoản vay (Production)

**Mô tả:** Dashboard quản lý danh mục khoản vay toàn công ty, tích hợp API Y99 (`api.y99.vn`) và Supabase. Đang vận hành production tại **https://loan.y99.info**.

**Công nghệ:** Next.js 15, Supabase, Y99 REST API, Recharts, ExcelJS, Resend, Telegram Bot, Google Drive backup.

**Số liệu vận hành thực tế** *(database production, tính đến 05/07/2026)*:

| Chỉ số | Số liệu |
|--------|---------|
| Tài khoản nội bộ | **30** nhân viên |
| Vai trò phân quyền | **8** roles (admin, shareholder, accountant, cs, ca, user...) |
| Chi nhánh | **4** |
| Sao kê khoản vay | **1.529** bản ghi |
| Phí dịch vụ | **680** bản ghi |
| Ghi chú xử lý quá hạn | **486** |
| Hồ sơ khoản vay (records) | **252** |
| Khách blacklist | **3** |
| Backup tự động | **601** lần |
| Quy mô mã nguồn | ~45.000 dòng, **160 commits** |

**Chức năng chính:**
- Dashboard khoản vay realtime (filter Today / 7D / 30D / All Time)
- Báo cáo ngày, tháng, năm, KPI, tài sản cầm cố
- Quản lý sao kê, phí dịch vụ (VAT 10%), import/export Excel
- Xử lý nợ quá hạn: phân loại mức độ, ma trận hiệu quả gọi điện, email nhắc nợ
- RBAC chi tiết: 212 permissions, 340 role-permission mappings
- Backup tự động lên Google Drive + cảnh báo Telegram

**Giá trị mang lại cho Công ty:**
- **Ban Giám đốc & lãnh đạo** có dashboard KPI tổng quan khoản vay mọi lúc — không cần chờ báo cáo Excel.
- **Kế toán** quản lý 1.529 sao kê + 680 phí DV tập trung, import hàng loạt.
- **CS/CA** theo dõi 486 case quá hạn có ghi chú, lịch sử xử lý.
- Backup 601 lần + alert Telegram → **an toàn dữ liệu**, giảm rủi ro mất số liệu tài chính.

---

### 2. WorkHub — Cổng Tiện ích Nội bộ Y99

**Mô tả:** Hệ thống tập hợp các tiện ích nhỏ phục vụ công việc hằng ngày của nhân viên Y99 — *"Tập hợp các tiện ích nhỏ giúp công việc hằng ngày nhanh và gọn hơn."*

**Công nghệ:** Next.js 15, Supabase (Auth OTP + RBAC), HeroUI, TipTap editor, Resend, Google Drive, Google Apps Script (OCR).

**Quy mô hệ thống:**

| Chỉ số | Số liệu |
|--------|---------|
| Commits phát triển | **35** (02/2026 – 03/2026) |
| API routes | **24** |
| Module chức năng | **12** |
| Quy mô mã nguồn | ~23.000 dòng, 376 files |

**12 module tiện ích:**

| Module | Mục đích |
|--------|----------|
| **Duyệt yêu cầu** | Gửi/duyệt/từ chối yêu cầu nội bộ + thảo luận realtime |
| **Bảng tin** | Thông báo công ty (TipTap editor, đính kèm file) |
| **Send email giải ngân** | Tạo & gửi email thông báo giải ngân khoản vay cho khách |
| **Calculator** | Tính tất toán, tính quá hạn |
| **Vision OCR** | Nhận dạng văn bản từ ảnh/PDF (Google Apps Script) |
| **Tài nguyên công ty** | Quản lý tài khoản, máy tính, thiết bị giao cho NV |
| **Thống kê** | Dashboard users, requests, departments, resources |
| **Users / Departments / Roles** | Quản trị nhân sự + RBAC (soft delete/restore) |

**Giá trị mang lại cho Công ty:**
- **Một cổng duy nhất** thay vì rải rác nhiều tool lẻ — NV không cần nhớ nhiều link.
- Email giải ngân chuẩn branding Y99 → **chuyên nghiệp**, giảm sai sót thông tin chuyển khoản.
- Calculator tất toán/quá hạn → NV tư vấn khách **nhanh và chính xác** ngay tại quầy.
- OCR → số hóa giấy tờ nhanh, giảm nhập liệu thủ công.
- Quản lý tài nguyên công ty → **bàn giao/thu hồi** thiết bị khi NV nghỉ việc có hệ thống.

---

### 3. Y99 HR Connect PWA — Hệ thống Chấm công & Bảng lương

**Mô tả:** Ứng dụng nhân sự dạng Progressive Web App (PWA), cài trên điện thoại như app native. Hỗ trợ chấm công GPS, đăng ký ca, nghỉ phép và **tự động tính bảng lương** (BHXH, thuế, phụ cấp, khấu trừ).

**Công nghệ:** React 19, Vite, TypeScript, Supabase (PostgreSQL, Storage, Realtime, Edge Functions), PWA offline-first.

**Số liệu vận hành thực tế** *(database production, tính đến 05/07/2026)*:

| Chỉ số | Số liệu |
|--------|---------|
| Tổng tài khoản nhân viên | **35** (24 đang active, 11 đã nghỉ) |
| Phân quyền | 32 Employee, 3 Admin |
| Phòng ban | **7** |
| Chi nhánh | **2** |
| Lượt chấm công | **4.494** (từ 08/02/2026 – 05/07/2026) |
| Lượt đăng ký ca | **2.598** |
| Kỳ lương đã xử lý | **153** |
| Quy mô mã nguồn | ~35.000 dòng, 96 commits |

**Giá trị mang lại cho Công ty:**
- Nhân viên chấm công bằng điện thoại (GPS + chụp ảnh), **không cần máy chấm công vật lý** → tiết kiệm chi phí đầu tư thiết bị.
- Tự động hóa tính lương hàng tháng cho 24 nhân viên active → **ước tính tiết kiệm ~2 ngày công/tháng** cho bộ phận HR so với làm thủ công trên Excel.
- PWA hoạt động offline, đồng bộ khi có mạng → phù hợp nhân viên làm việc tại PGD.
- Minh bạch chấm công (ảnh + GPS), giảm tranh chấp giờ công.

---

### 4. Y99 OTP System — Hệ thống Xác thực OTP Khách hàng

**Mô tả:** Hệ thống nội bộ gửi mã OTP qua email cho khách hàng, với quy trình phân tách trách nhiệm: **Kế toán gửi → CS xác minh → Kế toán duyệt**.

**Công nghệ:** React, Vite, Supabase (PostgreSQL, Edge Functions), Resend Email API, Realtime.

**Số liệu vận hành thực tế:**

| Chỉ số | Số liệu |
|--------|---------|
| Tài khoản nội bộ | **17** (Kế toán, CS, Admin) |
| OTP đã gửi cho khách | **597** |
| Lượt CS xác minh | **564** |
| Quy mô mã nguồn | ~11.000 dòng, 15 commits |

**Giá trị mang lại cho Công ty:**
- Kiểm soát chặt quy trình xác thực khách hàng trong giao dịch tài chính.
- Mọi OTP có log đầy đủ: thời gian gửi, trạng thái, người duyệt → **audit trail** phục vụ kiểm tra nội bộ.
- Khóa tài khoản sau 5 lần nhập sai, OTP có thời hạn → giảm rủi ro gian lận.
- Thay thế quy trình xác thực thủ công qua Zalo/điện thoại không có kiểm soát.

---

### 5. Y99 Ngắn ngày — Hệ thống Cầm đồ Ngắn hạn

**Mô tả:** Hệ thống quản lý khoản vay cầm đồ ngắn hạn end-to-end: tạo hồ sơ → phê duyệt → ký hợp đồng PDF → giải ngân → thu lãi → chuộc đồ / xử lý quá hạn.

**Công nghệ:** Next.js 15, Supabase, Puppeteer (PDF), Google Drive, Zod validation.

**Quy mô hệ thống:**

| Chỉ số | Số liệu |
|--------|---------|
| Commits phát triển | **125** |
| API routes | **35** |
| Database migrations | **20** |
| Loại hợp đồng pháp lý tự động | **4** (Cầm cố, Thuê TS, Xác nhận TT, Ủy quyền thanh lý) |
| Gói vay (logic lãi suất) | **3** gói |
| Quy mô mã nguồn | ~23.500 dòng |

**Giá trị mang lại cho Công ty:**
- **Số hóa toàn bộ quy trình cầm đồ ngắn hạn** — thay sổ sách, Word, in ấn thủ công.
- Tạo hợp đồng PDF tự động, ký số trên màn hình, lưu trữ Google Drive → hợp đồng chuẩn pháp lý, dễ tra cứu.
- Theo dõi đóng lãi theo chu kỳ, chuộc đồ, kanban khách quá hạn → NV tín dụng nắm tình hình realtime.
- Hỗ trợ **multi-chi nhánh** — sẵn sàng mở rộng PGD mới.

---

### 6. Y99 iCloud Management — Quản lý Tài khoản iCloud

**Mô tả:** Hệ thống nội bộ quản lý tài khoản iCloud gán cho khách hàng vay iPhone: theo dõi trạng thái, lưu credential bảo mật, audit log.

**Công nghệ:** Next.js 16, Supabase, AES-256-GCM encryption, Google OAuth, Realtime.

**Quy mô hệ thống:**

| Chỉ số | Số liệu |
|--------|---------|
| Commits | **35** |
| Quy mô mã nguồn | ~13.000 dòng |
| Phân quyền | Owner / Admin / User (RBAC) |
| Bảo mật | Mã hóa AES-256-GCM cho mật khẩu iCloud |

**Giá trị mang lại cho Công ty:**
- Quản lý tập trung hàng loạt tài khoản iCloud — biết ai đang dùng, ai quá hạn, ai đã trả.
- **Mật khẩu mã hóa**, không lưu plain text → giảm rủi ro lộ thông tin nhạy cảm.
- Audit log mọi thao tác → truy vết khi có sự cố.
- Import/Export CSV, soft delete → vận hành linh hoạt.

---

### 7. Y99 Payment Slip Generator — Tạo Phiếu thu & VietQR

**Mô tả:** Công cụ web tạo phiếu thu tiền / phiếu tất toán / phiếu thu tiền mặt kèm mã QR chuyển khoản Vietcombank chuẩn EMVCo.

**Công nghệ:** React 19, Vite, VietQR (EMVCo TLV + CRC16), html2canvas + jsPDF.

**Phạm vi sử dụng:**

| Chỉ số | Số liệu |
|--------|---------|
| PGD đang sử dụng | **8+** (Cần Thơ, Bắc Ninh, TP.HCM, Hà Nội...) |
| Loại phiếu | **3** (Thu CK, Tất toán, Thu tiền mặt) |
| Thời gian tạo 1 phiếu | **~2 phút** (trước: ~15 phút làm thủ công) |
| Quy mô mã nguồn | ~2.000 dòng, 27 commits |

**Giá trị mang lại cho Công ty:**
- **Chuẩn hóa phiếu thu** toàn hệ thống — format thống nhất, chuyên nghiệp.
- QR chuyển khoản chính xác (đúng số tiền, đúng nội dung) → khách chuyển khoản nhanh, giảm sai sót.
- **Ước tính tiết kiệm:** 8 PGD × 5 phiếu/ngày × 13 phút/phiếu ≈ **~8,5 giờ công/ngày** toàn hệ thống.
- Không cần backend/server — chạy trên trình duyệt, triển khai đơn giản.

---

### 8. Y99 Finance Hub — Website + CMS + LMS/ERP

**Mô tả:** Hệ sinh thái fintech gồm 3 ứng dụng trong monorepo: website marketing công khai, CMS quản trị nội dung, và LMS/ERP cho vay dài hạn.

**Công nghệ:** Next.js 15 monorepo, Supabase (2 database), Redis, Bull queue, DDD + CQRS architecture.

**Quy mô hệ thống:**

| Thành phần | Mô tả | Quy mô |
|------------|-------|--------|
| **y99-webclient** | Website công khai (SEO, đăng ký vay, bản tin, PGD) | ~8.800 dòng |
| **y99-webadmin** | CMS (tin tức, sản phẩm vay, leads, media) | ~6.200 dòng |
| **y99-lms** | LMS/ERP cho vay (18 module domain) | ~185.700 dòng |
| **Tổng** | | **~214.500 dòng, 11 commits** |

**Số liệu LMS (giai đoạn triển khai):**

| Chỉ số | Số liệu |
|--------|---------|
| Khách hàng | **34** |
| Hồ sơ vay | **33** |
| Khoản vay | **13** |
| Chi nhánh | **3** |

**18 module domain LMS:** Loan Origination, Underwriting, Disbursement, Repayment, Collection, Foreclosure, Contracts, Payment Tracking, Analytics, NPA/IRAC, Accounting (GL), Customer Management, Branch Management, Notifications, v.v.

**Giá trị mang lại cho Công ty:**
- **Website thu lead online** → khách đăng ký vay 24/7, đồng bộ tự động vào LMS.
- **CMS:** Team marketing tự cập nhật tin tức, sản phẩm vay, PGD — **không phụ thuộc developer**.
- **LMS:** Nền tảng ERP cho vay dài hạn chuyên nghiệp — sẵn sàng scale khi công ty mở rộng.
- Kiến trúc DDD/CQRS — dễ bảo trì, mở rộng module mới.

---

## V. NĂNG LỰC KỸ THUẬT THỂ HIỆN

| Kỹ năng | Mức độ | Minh chứng |
|---------|--------|------------|
| Full-stack TypeScript | Expert | 6/6 dự án |
| Next.js / React (App Router + Pages Router) | Expert | 5/6 dự án |
| Supabase (PostgreSQL, Auth, Realtime, Edge Functions, Storage, RLS) | Expert | 5/6 dự án, 100+ migration |
| Bảo mật (AES-256, OAuth, RBAC, RLS, middleware) | Advanced | iCloud, HR, OTP, LMS |
| PDF / Document generation | Advanced | Receipt (VietQR), Short Loan (Puppeteer), LMS (contracts) |
| PWA / Offline-first | Advanced | HR Connect |
| Domain-Driven Design / CQRS | Advanced | Finance Hub LMS |
| Real-time systems | Intermediate | 4/6 dự án |
| Email integration (Resend) | Intermediate | OTP, HR Connect |
| Google Drive / Cloud APIs | Intermediate | Short Loan |
| Background jobs (Redis/Bull) | Intermediate | Finance Hub LMS |
| Nghiệp vụ Việt Nam | Expert | Cầm đồ, lương BHXH, VietQR, HĐ pháp lý |

---

## VI. TÁC ĐỘNG KINH DOANH TỔNG HỢP

### 6.1. Tiết kiệm thời gian & chi phí vận hành

| Hạng mục | Trước (thủ công) | Sau (phần mềm) | Tiết kiệm ước tính |
|----------|-------------------|----------------|---------------------|
| Tính lương 24 NV/tháng | ~2 ngày (Excel) | ~30 phút (tự động) | **~2 ngày công/tháng** |
| Tạo phiếu thu (8 PGD) | ~15 phút/phiếu | ~2 phút/phiếu | **~8,5 giờ/ngày** |
| Tạo hợp đồng cầm đồ | ~30 phút (Word + in) | ~5 phút (PDF tự động) | **~25 phút/HĐ** |
| Xác thực OTP khách | Không kiểm soát | 597 OTP có log | **Giảm rủi ro gian lận** |
| Quản lý iCloud | Excel/Zalo | Hệ thống tập trung + mã hóa | **Giảm rủi ro lộ credential** |

### 6.2. Phủ sóng nội bộ

```
┌─────────────────────────────────────────────────────────┐
│                    TOÀN BỘ CÔNG TY Y99                   │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  NHÂN SỰ    │  TÍN DỤNG   │  KẾ TOÁN    │  VẬN HÀNH     │
│  24 NV      │  NV PGD     │  17 TK OTP  │  iCloud team  │
│  HR Connect │  Short Loan │  OTP System │  iCloud Mgmt  │
│             │  Finance Hub│  Receipt    │               │
├─────────────┴─────────────┴─────────────┴───────────────┤
│              KHÁCH HÀNG (Website Y99 + OTP)              │
└─────────────────────────────────────────────────────────┘
```

### 6.3. Sẵn sàng mở rộng

- Tất cả hệ thống hỗ trợ **multi-chi nhánh** — khi Y99 mở PGD mới, chỉ cần thêm chi nhánh trên hệ thống, không cần xây lại.
- LMS/ERP sẵn sàng scale cho **hàng nghìn khoản vay** với kiến trúc modular monolith.
- Website + CMS giúp **marketing online** không phụ thuộc agency bên ngoài.

---

## VII. SO SÁNH KHỐI LƯỢNG CÔNG VIỆC

| Tiêu chí | Mức thông thường (1 developer) | Thực tế đã thực hiện |
|----------|--------------------------------|----------------------|
| Số sản phẩm / 14 tháng | 1–2 | **8 sản phẩm** |
| Dòng code | ~20.000–50.000 | **~367.000** |
| Phạm vi | 1 domain | **7 domain** (HR, Tín dụng, Kế toán, Vận hành, Marketing, Báo cáo, Tiện ích nội bộ) |
| Vai trò | Frontend HOẶC Backend | **Full-stack + DevOps + DBA** |
| Tương đương team size | — | **3–4 developer** |

---

## VIII. KẾ HOẠCH TIẾP THEO (nếu được duy trì)

1. **HR Connect:** Hoàn thiện tính năng nghỉ phép, báo cáo dashboard cho Ban Giám đốc.
2. **Finance Hub LMS:** Đưa vào vận hành chính thức, training NV tín dụng.
3. **Short Loan:** Mở rộng cho thêm PGD, tích hợp báo cáo tài chính.
4. **Tích hợp chéo:** Lead website → LMS → Short Loan → Receipt (luồng dữ liệu end-to-end).

---

## IX. ĐỀ XUẤT

Căn cứ trên các thành tích và giá trị thực tế nêu trên, tôi kính đề nghị Ban Giám đốc **xem xét điều chỉnh mức lương** phù hợp với:

1. **Khối lượng công việc vượt trội:** 8 sản phẩm production trong 14 tháng (06/2025 – 07/2026), tương đương output team 3–4 người.
2. **Phạm vi trách nhiệm mở rộng:** Không chỉ code mà còn kiến trúc hệ thống, database design, triển khai production, bảo trì.
3. **Giá trị kinh doanh trực tiếp:** Tiết kiệm hàng trăm giờ công/tháng, giảm rủi ro vận hành, sẵn sàng scale đa chi nhánh.
4. **Cam kết tiếp tục:** Duy trì, cải tiến và mở rộng hệ sinh thái phần mềm Y99.

**Mức lương hiện tại:** [Điền mức lương hiện tại]  
**Mức lương đề xuất:** [Điền mức lương mong muốn]  
**Mức tăng đề xuất:** [Điền % hoặc số tiền]

---

## X. CAM KẾT

Tôi cam kết tiếp tục nỗ lực, hoàn thiện các hệ thống đang vận hành và phát triển thêm giá trị cho Công ty. Trân trọng cảm ơn Ban Giám đốc đã xem xét.

---

**Người nộp**

[Họ và tên]  
[Chữ ký]  
[Ngày tháng]

---

*Phụ lục: Số liệu LoanLook, HR Connect & OTP System được trích xuất trực tiếp từ database production (Supabase) ngày 05/07/2026.*
