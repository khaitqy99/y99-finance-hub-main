import type { LoanProductData } from "@/components/site/LoanProductPage";
import imgMotorbike from "@/assets/loan-motorbike.webp";
import imgCar from "@/assets/loan-car.webp";
import imgIcloud from "@/assets/loan-icloud.webp";

export const productImages = {
  "vay-tien-bang-cavet-xe-may": imgMotorbike,
  "vay-tien-bang-cavet-oto": imgCar,
  "vay-bang-icloud": imgIcloud,
} as const;

export const loanProducts: Record<string, LoanProductData> = {
  "vay-tien-bang-cavet-xe-may": {
    slug: "vay-tien-bang-cavet-xe-may",
    name: "Vay tiền bằng cà vẹt xe máy",
    tagline: "Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe máy là có ngay khoản vay.",
    description:
      "Vay nhanh bằng cà vẹt (đăng ký) xe máy chính chủ. Y99 chỉ giữ giấy tờ, khách hàng vẫn sử dụng xe bình thường. Hạn mức cao theo giá trị xe, lãi suất minh bạch.",
    maxAmount: "Đến 30 triệu",
    maxTerm: "3 - 9 tháng",
    interestRate: "1.099%/tháng",
    approvalTime: "15 phút",
    benefits: [
      "Vẫn được sử dụng xe sau khi vay",
      "Định giá xe minh bạch, công khai",
      "Chỉ cần CCCD & VNeID mức 2",
      "Duyệt vay nhanh trong 15 phút",
      "Áp dụng cho mọi dòng xe máy",
      "Tất toán linh hoạt, không phí phạt",
    ],
    conditions: [
      "Công dân Việt Nam, từ 18 - 60 tuổi",
      "Sở hữu xe máy chính chủ (đăng ký xe đứng tên)",
      "CCCD & VNeID mức 2",
      "Hóa đơn điện/ nước/ Wifi",
    ],
    documents: [
      "CCCD/CMND bản gốc",
      "Đăng ký xe máy bản gốc (cà vẹt)",
      "Hộ khẩu / KT3 (bản photo)",
    ],
    process: [
      { title: "Đăng ký", desc: "Đăng ký online hoặc đến trực tiếp phòng giao dịch Y99." },
      { title: "Định giá xe", desc: "Chuyên viên định giá xe và đưa ra hạn mức vay phù hợp." },
      { title: "Ký hợp đồng", desc: "Ký hợp đồng vay tại quầy, giữ lại đăng ký xe gốc." },
      { title: "Giải ngân", desc: "Nhận tiền tại quầy hoặc chuyển khoản trong 15 phút." },
    ],
  },
  "vay-tien-bang-cavet-oto": {
    slug: "vay-tien-bang-cavet-oto",
    name: "Vay tiền bằng cà vẹt ô tô",
    tagline: "Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe ô tô là có ngay khoản vay.",
    description:
      "Sản phẩm vay tiền bằng cà vẹt ô tô dành cho khách hàng cần vốn lớn. Y99 chỉ giữ giấy tờ xe, khách vẫn sử dụng xe bình thường. Hạn mức cao, lãi suất ưu đãi cho khoản vay lớn.",
    maxAmount: "Đến 2 tỷ",
    maxTerm: "3 - 9 tháng",
    interestRate: "1.099%/tháng",
    approvalTime: "30 phút",
    benefits: [
      "Hạn mức vay lên đến 2 tỷ đồng",
      "Khách hàng vẫn sử dụng xe bình thường",
      "Lãi suất ưu đãi cho khoản vay lớn",
      "Định giá xe theo giá thị trường",
      "Chỉ cần CCCD & VNeID mức 2",
      "Hợp đồng minh bạch, công khai",
    ],
    conditions: [
      "Công dân Việt Nam, từ 18 - 60 tuổi",
      "Sở hữu xe ô tô chính chủ",
      "CCCD & VNeID mức 2",
      "Hóa đơn điện/ nước/ Wifi",
    ],
    documents: [
      "CCCD/CMND bản gốc",
      "Đăng ký xe ô tô bản gốc",
      "Đăng kiểm xe còn hiệu lực",
      "Bảo hiểm trách nhiệm dân sự còn hạn",
    ],
    process: [
      { title: "Đăng ký", desc: "Đăng ký qua hotline 1900575792 hoặc website." },
      { title: "Định giá xe", desc: "Chuyên viên đến tận nơi định giá xe của bạn." },
      { title: "Thẩm định hồ sơ", desc: "Y99 thẩm định nhanh, duyệt hồ sơ trong 30 phút." },
      { title: "Giải ngân", desc: "Ký hợp đồng và nhận tiền chuyển khoản hoặc tại quầy." },
    ],
  },
  "vay-bang-icloud": {
    slug: "vay-bang-icloud",
    name: "Vay tiền bằng iCloud",
    tagline: "Điện thoại vẫn dùng - tiền vẫn về. Không cần giữ máy.",
    description:
      "Vay nhanh bằng iCloud iPhone của bạn. Y99 không giữ điện thoại, khách hàng vẫn sử dụng bình thường. Phù hợp với khách hàng cần khoản vay nhỏ trong thời gian ngắn.",
    maxAmount: "Đến 30 triệu",
    maxTerm: "3 - 9 tháng",
    interestRate: "1.099%/tháng",
    approvalTime: "15 phút",
    benefits: [
      "Không giữ máy - vẫn dùng iPhone bình thường",
      "Thủ tục cực kỳ đơn giản",
      "Duyệt vay siêu tốc trong 15 phút",
      "Hạn mức theo giá trị máy",
      "Không cần thẩm định người thân",
      "Áp dụng cho iPhone từ đời 11 trở lên",
    ],
    conditions: [
      "Công dân Việt Nam, từ 18 - 60 tuổi",
      "Sở hữu iPhone đời 12 Pro Max trở lên còn hoạt động tốt",
      "CCCD & VNeID mức 2",
      "Hóa đơn điện/ nước/ Wifi",
    ],
    documents: [
      "CCCD/CMND bản gốc",
      "iPhone đăng nhập sẵn iCloud",
      "Mật khẩu iCloud (để cài đặt liên kết)",
    ],
    process: [
      { title: "Đăng ký", desc: "Liên hệ CSKH để tiến hành đăng ký vay Online hoặc trực tiếp đến phòng giao dịch Y99 gần nhất." },
      { title: "Kiểm tra máy", desc: "Chuyên viên kiểm tra tình trạng máy và iCloud." },
      { title: "Ký kết hợp đồng", desc: "Ký kết hợp đồng và thiết lập bảo mật ICloud Y99." },
      { title: "Nhận tiền", desc: "Nhận tiền ngay tại quầy hoặc chuyển khoản." },
    ],
  },
};
