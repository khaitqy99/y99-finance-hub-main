export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "y99-mo-rong-mang-luoi-2026",
    title: "Y99 mở rộng mạng lưới lên 500 phòng giao dịch trong năm 2026",
    excerpt: "Y99 Finance công bố kế hoạch mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc, mang dịch vụ tài chính đến gần hơn với người dân.",
    date: "20/04/2026",
    category: "Tin doanh nghiệp",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    content: [
      "Y99 Finance vừa công bố chiến lược mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc trong năm 2026, đánh dấu bước phát triển vượt bậc của doanh nghiệp trong lĩnh vực tài chính tiêu dùng.",
      "Theo đại diện Y99, việc mở rộng mạng lưới sẽ giúp công ty phục vụ tốt hơn nhu cầu vay vốn nhanh, minh bạch của hàng triệu khách hàng tại các tỉnh thành. Mỗi phòng giao dịch đều được thiết kế hiện đại, thân thiện và áp dụng quy trình số hóa toàn diện.",
      "Bên cạnh việc mở rộng quy mô, Y99 cũng đầu tư mạnh vào công nghệ, ứng dụng AI để tối ưu quy trình thẩm định, giúp khách hàng nhận được khoản vay chỉ trong 15 phút.",
    ],
  },
  {
    slug: "huong-dan-vay-bang-cavet-xe-may",
    title: "Hướng dẫn chi tiết vay tiền bằng cà vẹt xe máy tại Y99",
    excerpt: "Tất tần tật những điều cần biết khi vay tiền bằng cà vẹt xe máy: điều kiện, hồ sơ và quy trình giải ngân nhanh chỉ trong 15 phút.",
    date: "12/04/2026",
    category: "Cẩm nang vay",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80",
    content: [
      "Vay tiền bằng cà vẹt xe máy là một trong những giải pháp tài chính phổ biến nhất hiện nay. Tại Y99, khách hàng chỉ cần mang theo đăng ký xe chính chủ và CCCD là đã có thể nhận khoản vay lên đến 30 triệu đồng.",
      "Đặc biệt, khách hàng vẫn được giữ và sử dụng xe bình thường sau khi vay. Y99 chỉ giữ giấy tờ đăng ký xe trong thời gian hợp đồng có hiệu lực.",
      "Quy trình vay diễn ra nhanh chóng: đăng ký - định giá xe - ký hợp đồng - nhận tiền, tổng thời gian chỉ khoảng 15 phút.",
    ],
  },
  {
    slug: "y99-trao-tang-hoc-bong-2026",
    title: "Y99 trao tặng 1.000 suất học bổng cho học sinh khó khăn năm 2026",
    excerpt: "Chương trình 'Tiếp sức đến trường' của Y99 năm nay đã trao 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho học sinh nghèo vượt khó trên toàn quốc.",
    date: "05/04/2026",
    category: "Trách nhiệm xã hội",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
    content: [
      "Trong khuôn khổ chương trình thiện nguyện 'Tiếp sức đến trường', Y99 Finance đã trao tặng 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho các em học sinh nghèo vượt khó tại 30 tỉnh thành trên toàn quốc.",
      "Chương trình là sự tiếp nối của chuỗi hoạt động trách nhiệm xã hội mà Y99 đã thực hiện trong nhiều năm qua, thể hiện cam kết đồng hành cùng cộng đồng và đóng góp vào sự phát triển bền vững của xã hội.",
    ],
  },
  {
    slug: "tang-truong-quy-1-2026",
    title: "Y99 tăng trưởng 45% trong quý I/2026, dẫn đầu phân khúc",
    excerpt: "Báo cáo kết quả kinh doanh quý I/2026 cho thấy Y99 đạt mức tăng trưởng ấn tượng 45% so với cùng kỳ năm trước, củng cố vị thế dẫn đầu thị trường.",
    date: "28/03/2026",
    category: "Tin doanh nghiệp",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    content: [
      "Y99 Finance vừa công bố báo cáo kết quả kinh doanh quý I/2026 với mức tăng trưởng doanh thu đạt 45% so với cùng kỳ năm trước. Đây là tín hiệu tích cực cho thấy công ty đang phát triển bền vững.",
      "Lợi nhuận trước thuế quý I đạt 250 tỷ đồng, hoàn thành 28% kế hoạch năm 2026. Số lượng khách hàng mới tăng 38%, đặc biệt là các sản phẩm vay theo lương và vay bằng cà vẹt xe máy.",
    ],
  },
];
