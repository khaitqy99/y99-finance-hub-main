-- Seed from y99-webclient canonical data

insert into public.site_settings (
  id, company_name, hotline, foreign_phone, email, address, tax_id,
  facebook, zalo, whatsapp, header_marquee
) values (
  1,
  'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
  '1900575792',
  '+84 292 38 999 33',
  'cskh@y99.vn',
  '99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ',
  '1801778932',
  '',
  '',
  '',
  'Y99 hỗ trợ cầm đồ uy tín, cung cấp dịch vụ cầm đồ online minh bạch, an toàn, tiện lợi - linh hoạt, không giới hạn khoảng cách.'
) on conflict (id) do update set
  company_name = excluded.company_name,
  hotline = excluded.hotline,
  foreign_phone = excluded.foreign_phone,
  email = excluded.email,
  address = excluded.address,
  header_marquee = excluded.header_marquee;

insert into public.store_locations (id, name, address, province, district, phone, hours, lat, lng, active, sort_order) values
  ('ct-nk-1', 'Y99 Phòng giao dịch Ninh Kiều', '99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ', 'Cần Thơ', 'Ninh Kiều', '1900575792', '8:00 - 21:00 (Thứ 2 - Chủ nhật)', 10.0459, 105.7871, true, 1),
  ('ct-nk-2', 'Y99 PGD Hưng Phú', 'Khu dân cư Hưng Phú, Phường Hưng Phú, Thành phố Cần Thơ', 'Cần Thơ', 'Cái Răng', '1900575792', '8:00 - 20:00 (Thứ 2 - Chủ nhật)', 10.0123, 105.7489, true, 2),
  ('bn-qv-1', 'Y99 Bắc Ninh — Quế Võ', 'Số 06, Khu phố I, Phường Quế Võ, Tỉnh Bắc Ninh', 'Bắc Ninh', 'Quế Võ', '1900575792', '8:00 - 21:00 (Thứ 2 - Chủ nhật)', 21.1541, 106.1446, true, 3),
  ('bn-tp-1', 'Y99 PGD Bắc Ninh (TP)', 'Đường Ngô Gia Tự, Phường Suối Hoa, Tỉnh Bắc Ninh', 'Bắc Ninh', 'Bắc Ninh', '1900575792', '8:00 - 20:30 (Thứ 2 - Thứ 7)', 21.1861, 106.0763, true, 4),
  ('hcm-q1-1', 'Y99 PGD Quận 1 (đang mở rộng)', 'Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Quận 1', '1900575792', '8:00 - 20:00 (Thứ 2 - Chủ nhật)', 10.7769, 106.7009, true, 5),
  ('hcm-q7-1', 'Y99 PGD Quận 7', 'Nguyễn Thị Thập, Phường Tân Phú, TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Quận 7', '1900575792', '8:00 - 21:00 (Thứ 2 - Chủ nhật)', 10.7314, 106.7181, true, 6),
  ('hn-hk-1', 'Y99 PGD Hoàn Kiếm', 'Phố Hàng Bài, Phường Hàng Bài, Hà Nội', 'Hà Nội', 'Hoàn Kiếm', '1900575792', '8:00 - 20:30 (Thứ 2 - Chủ nhật)', 21.0245, 105.8412, true, 7),
  ('hn-cg-1', 'Y99 PGD Cầu Giấy', 'Xuân Thủy, Phường Dịch Vọng Hậu, Hà Nội', 'Hà Nội', 'Cầu Giấy', '1900575792', '8:00 - 21:00 (Thứ 2 - Chủ nhật)', 21.0382, 105.7835, true, 8)
on conflict (id) do nothing;

insert into public.news_articles (slug, title, excerpt, category, date_display, image_url, content, published, sort_order) values
  (
    'y99-mo-rong-mang-luoi-2026',
    'Y99 mở rộng mạng lưới lên 500 phòng giao dịch trong năm 2026',
    'Y99 Finance công bố kế hoạch mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc, mang dịch vụ tài chính đến gần hơn với người dân.',
    'Tin doanh nghiệp', '20/04/2026',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    '["Y99 Finance vừa công bố chiến lược mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc trong năm 2026, đánh dấu bước phát triển vượt bậc của doanh nghiệp trong lĩnh vực tài chính tiêu dùng.","Theo đại diện Y99, việc mở rộng mạng lưới sẽ giúp công ty phục vụ tốt hơn nhu cầu vay vốn nhanh, minh bạch của hàng triệu khách hàng tại các tỉnh thành. Mỗi phòng giao dịch đều được thiết kế hiện đại, thân thiện và áp dụng quy trình số hóa toàn diện.","Bên cạnh việc mở rộng quy mô, Y99 cũng đầu tư mạnh vào công nghệ, ứng dụng AI để tối ưu quy trình thẩm định, giúp khách hàng nhận được khoản vay chỉ trong 15 phút."]'::jsonb,
    true, 1
  ),
  (
    'huong-dan-vay-bang-cavet-xe-may',
    'Hướng dẫn chi tiết vay tiền bằng cà vẹt xe máy tại Y99',
    'Tất tần tật những điều cần biết khi vay tiền bằng cà vẹt xe máy: điều kiện, hồ sơ và quy trình giải ngân nhanh chỉ trong 15 phút.',
    'Cẩm nang vay', '12/04/2026',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    '["Vay tiền bằng cà vẹt xe máy là một trong những giải pháp tài chính phổ biến nhất hiện nay. Tại Y99, khách hàng chỉ cần mang theo đăng ký xe chính chủ và CCCD là đã có thể nhận khoản vay lên đến 30 triệu đồng.","Đặc biệt, khách hàng vẫn được giữ và sử dụng xe bình thường sau khi vay. Y99 chỉ giữ giấy tờ đăng ký xe trong thời gian hợp đồng có hiệu lực.","Quy trình vay diễn ra nhanh chóng: đăng ký - định giá xe - ký hợp đồng - nhận tiền, tổng thời gian chỉ khoảng 15 phút."]'::jsonb,
    true, 2
  ),
  (
    'y99-trao-tang-hoc-bong-2026',
    'Y99 trao tặng 1.000 suất học bổng cho học sinh khó khăn năm 2026',
    'Chương trình ''Tiếp sức đến trường'' của Y99 năm nay đã trao 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho học sinh nghèo vượt khó trên toàn quốc.',
    'Trách nhiệm xã hội', '05/04/2026',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80',
    '["Trong khuôn khổ chương trình thiện nguyện ''Tiếp sức đến trường'', Y99 Finance đã trao tặng 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho các em học sinh nghèo vượt khó tại 30 tỉnh thành trên toàn quốc.","Chương trình là sự tiếp nối của chuỗi hoạt động trách nhiệm xã hội mà Y99 đã thực hiện trong nhiều năm qua, thể hiện cam kết đồng hành cùng cộng đồng và đóng góp vào sự phát triển bền vững của xã hội."]'::jsonb,
    true, 3
  ),
  (
    'tang-truong-quy-1-2026',
    'Y99 tăng trưởng 45% trong quý I/2026, dẫn đầu phân khúc',
    'Báo cáo kết quả kinh doanh quý I/2026 cho thấy Y99 đạt mức tăng trưởng ấn tượng 45% so với cùng kỳ năm trước, củng cố vị thế dẫn đầu thị trường.',
    'Tin doanh nghiệp', '28/03/2026',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    '["Y99 Finance vừa công bố báo cáo kết quả kinh doanh quý I/2026 với mức tăng trưởng doanh thu đạt 45% so với cùng kỳ năm trước. Đây là tín hiệu tích cực cho thấy công ty đang phát triển bền vững.","Lợi nhuận trước thuế quý I đạt 250 tỷ đồng, hoàn thành 28% kế hoạch năm 2026. Số lượng khách hàng mới tăng 38%, đặc biệt là các sản phẩm vay theo lương và vay bằng cà vẹt xe máy."]'::jsonb,
    true, 4
  )
on conflict (slug) do nothing;

-- Loan products (full JSON from client)
insert into public.loan_products (
  slug, name, tagline, description, max_amount, max_term, interest_rate, approval_time,
  benefits, conditions, documents, process, image_key, published, sort_order
) values
  (
    'vay-tien-bang-cavet-xe-may',
    'Vay tiền bằng cà vẹt xe máy',
    'Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe máy là có ngay khoản vay.',
    'Vay nhanh bằng cà vẹt (đăng ký) xe máy chính chủ. Y99 chỉ giữ giấy tờ, khách hàng vẫn sử dụng xe bình thường. Hạn mức cao theo giá trị xe, lãi suất minh bạch.',
    'Đến 30 triệu', '3 - 9 tháng', '1.099%/tháng', '15 phút',
    '["Vẫn được sử dụng xe sau khi vay","Định giá xe minh bạch, công khai","Chỉ cần CCCD & VNeID mức 2","Duyệt vay nhanh trong 15 phút","Áp dụng cho mọi dòng xe máy","Tất toán linh hoạt, không phí phạt"]'::jsonb,
    '["Công dân Việt Nam, từ 18 - 60 tuổi","Sở hữu xe máy chính chủ (đăng ký xe đứng tên)","CCCD & VNeID mức 2","Hóa đơn điện/ nước/ Wifi"]'::jsonb,
    '["CCCD/CMND bản gốc","Đăng ký xe máy bản gốc (cà vẹt)","Hộ khẩu / KT3 (bản photo)"]'::jsonb,
    '[{"title":"Đăng ký","desc":"Đăng ký online hoặc đến trực tiếp phòng giao dịch Y99."},{"title":"Định giá xe","desc":"Chuyên viên định giá xe và đưa ra hạn mức vay phù hợp."},{"title":"Ký hợp đồng","desc":"Ký hợp đồng vay tại quầy, giữ lại đăng ký xe gốc."},{"title":"Giải ngân","desc":"Nhận tiền tại quầy hoặc chuyển khoản trong 15 phút."}]'::jsonb,
    'vay-tien-bang-cavet-xe-may', true, 1
  ),
  (
    'vay-tien-bang-cavet-oto',
    'Vay tiền bằng cà vẹt ô tô',
    'Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe ô tô là có ngay khoản vay.',
    'Sản phẩm vay tiền bằng cà vẹt ô tô dành cho khách hàng cần vốn lớn. Y99 chỉ giữ giấy tờ xe, khách vẫn sử dụng xe bình thường. Hạn mức cao, lãi suất ưu đãi cho khoản vay lớn.',
    'Đến 2 tỷ', '3 - 9 tháng', '1.099%/tháng', '30 phút',
    '["Hạn mức vay lên đến 2 tỷ đồng","Khách hàng vẫn sử dụng xe bình thường","Lãi suất ưu đãi cho khoản vay lớn","Định giá xe theo giá thị trường","Chỉ cần CCCD & VNeID mức 2","Hợp đồng minh bạch, công khai"]'::jsonb,
    '["Công dân Việt Nam, từ 18 - 60 tuổi","Sở hữu xe ô tô chính chủ","CCCD & VNeID mức 2","Hóa đơn điện/ nước/ Wifi"]'::jsonb,
    '["CCCD/CMND bản gốc","Đăng ký xe ô tô bản gốc","Đăng kiểm xe còn hiệu lực","Bảo hiểm trách nhiệm dân sự còn hạn"]'::jsonb,
    '[{"title":"Đăng ký","desc":"Đăng ký qua hotline 1900575792 hoặc website."},{"title":"Định giá xe","desc":"Chuyên viên đến tận nơi định giá xe của bạn."},{"title":"Thẩm định hồ sơ","desc":"Y99 thẩm định nhanh, duyệt hồ sơ trong 30 phút."},{"title":"Giải ngân","desc":"Ký hợp đồng và nhận tiền chuyển khoản hoặc tại quầy."}]'::jsonb,
    'vay-tien-bang-cavet-oto', true, 2
  ),
  (
    'vay-bang-icloud',
    'Vay tiền bằng iCloud',
    'Điện thoại vẫn dùng - tiền vẫn về. Không cần giữ máy.',
    'Vay nhanh bằng iCloud iPhone của bạn. Y99 không giữ điện thoại, khách hàng vẫn sử dụng bình thường. Phù hợp với khách hàng cần khoản vay nhỏ trong thời gian ngắn.',
    'Đến 30 triệu', '3 - 9 tháng', '1.099%/tháng', '15 phút',
    '["Không giữ máy - vẫn dùng iPhone bình thường","Thủ tục cực kỳ đơn giản","Duyệt vay siêu tốc trong 15 phút","Hạn mức theo giá trị máy","Không cần thẩm định người thân","Áp dụng cho iPhone từ đời 11 trở lên"]'::jsonb,
    '["Công dân Việt Nam, từ 18 - 60 tuổi","Sở hữu iPhone đời 12 Pro Max trở lên còn hoạt động tốt","CCCD & VNeID mức 2","Hóa đơn điện/ nước/ Wifi"]'::jsonb,
    '["CCCD/CMND bản gốc","iPhone đăng nhập sẵn iCloud","Mật khẩu iCloud (để cài đặt liên kết)"]'::jsonb,
    '[{"title":"Đăng ký","desc":"Liên hệ CSKH để tiến hành đăng ký vay Online hoặc trực tiếp đến phòng giao dịch Y99 gần nhất."},{"title":"Kiểm tra máy","desc":"Chuyên viên kiểm tra tình trạng máy và iCloud."},{"title":"Ký kết hợp đồng","desc":"Ký kết hợp đồng và thiết lập bảo mật ICloud Y99."},{"title":"Nhận tiền","desc":"Nhận tiền ngay tại quầy hoặc chuyển khoản."}]'::jsonb,
    'vay-bang-icloud', true, 3
  )
on conflict (slug) do nothing;

insert into public.recruitment_jobs (title, excerpt, location, job_type, deadline, published, sort_order) values
  (
    'Chuyên viên tư vấn tài chính',
    'Tư vấn giải pháp tài chính phù hợp, hỗ trợ khách hàng hoàn thiện hồ sơ và đồng hành xuyên suốt quá trình giải ngân.',
    'Cần Thơ', 'Toàn thời gian', '31/05/2026', true, 1
  ),
  (
    'Nhân viên chăm sóc khách hàng',
    'Tiếp nhận, hỗ trợ và xử lý phản hồi khách hàng đa kênh, đảm bảo trải nghiệm dịch vụ minh bạch và hài lòng.',
    'TP. Hồ Chí Minh', 'Toàn thời gian', '05/06/2026', true, 2
  ),
  (
    'Chuyên viên phát triển kinh doanh',
    'Mở rộng mạng lưới đối tác, triển khai hoạt động thị trường tại khu vực phụ trách và thúc đẩy hiệu quả tăng trưởng.',
    'Hà Nội', 'Toàn thời gian', '10/06/2026', true, 3
  );

insert into public.hero_slides (title, alt_text, image_url, link_to, active, sort_order) values
  ('Vay cà vẹt xe máy', 'Vay tiền bằng cà vẹt xe máy tại Y99', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80', '/cho-vay-cam-co/vay-tien-bang-cavet-xe-may', true, 1),
  ('Vay cà vẹt ô tô', 'Vay tiền bằng cà vẹt ô tô tại Y99', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', '/cho-vay-cam-co/vay-tien-bang-cavet-oto', true, 2),
  ('Vay iCloud', 'Vay tiền bằng iCloud tại Y99', 'https://images.unsplash.com/photo-1511707171634-5f897ffdaa50?w=800&q=80', '/cho-vay-cam-co/vay-bang-icloud', true, 3),
  ('Vay online', 'Khám phá giải pháp vay tiền online của Y99', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', '/vay-tien-online', true, 4),
  ('Liên hệ', 'Liên hệ tư vấn khoản vay nhanh cùng Y99', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9b?w=800&q=80', '/lien-he', true, 5),
  ('Hệ thống PGD', 'Hệ thống cửa hàng Y99 trên toàn quốc', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', '/he-thong-cua-hang', true, 6);

insert into public.testimonials (author, role, content, active, sort_order) values
  ('Anh Minh Tuấn', 'Tài xế công nghệ - Hà Nội', 'Mình cần vốn gấp để sửa xe, Y99 duyệt và giải ngân chỉ trong 20 phút. Nhân viên tư vấn rất nhiệt tình.', true, 1),
  ('Chị Thu Hằng', 'Nhân viên văn phòng - TP.HCM', 'Lãi suất rõ ràng, không có phí ẩn. App rất dễ dùng, mình theo dõi khoản trả mỗi tháng cực tiện.', true, 2),
  ('Anh Quốc Huy', 'Chủ shop kinh doanh - Đà Nẵng', 'Lần đầu vay online mà cảm thấy yên tâm. Y99 chuyên nghiệp từ tư vấn đến hợp đồng.', true, 3),
  ('Chị Ngọc Mai', 'Chủ tiệm làm đẹp - Cần Thơ', 'Mình cần xoay vốn nhập hàng gấp, Y99 hỗ trợ rất nhanh và giải thích hợp đồng rõ ràng từng khoản phí.', true, 4),
  ('Anh Thanh Bình', 'Kỹ thuật viên - Bình Dương', 'Thủ tục đơn giản, chỉ cần giấy tờ cơ bản là được tư vấn gói phù hợp. Quy trình làm việc minh bạch, dễ hiểu.', true, 5),
  ('Chị Hoài An', 'Kinh doanh tự do - Đồng Nai', 'Mình đánh giá cao cách chăm sóc khách hàng của Y99. Nhắc lịch thanh toán rõ ràng, hỗ trợ linh hoạt khi cần tư vấn thêm.', true, 6);
