/**
 * Seed Y99 CMS data via Supabase service role (when SQL seed not run yet).
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, 'y99-webadmin', '.env');

function loadEnv() {
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function upsert(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}: ${rows.length} rows`);
}

async function main() {
  await upsert('site_settings', [{
    id: 1,
    company_name: 'CÔNG TY CỔ PHẦN CẦM ĐỒ Y99',
    hotline: '1900575792',
    foreign_phone: '+84 292 38 999 33',
    email: 'cskh@y99.vn',
    address: '99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ',
    tax_id: '1801778932',
    facebook: '',
    zalo: '',
    whatsapp: '',
    header_marquee:
      'Y99 hỗ trợ cầm đồ uy tín, cung cấp dịch vụ cầm đồ online minh bạch, an toàn, tiện lợi - linh hoạt, không giới hạn khoảng cách.',
  }], 'id');

  await upsert('store_locations', [
    { id: 'ct-nk-1', name: 'Y99 Phòng giao dịch Ninh Kiều', address: '99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ', province: 'Cần Thơ', district: 'Ninh Kiều', phone: '1900575792', hours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)', lat: 10.0459, lng: 105.7871, active: true, sort_order: 1 },
    { id: 'ct-nk-2', name: 'Y99 PGD Hưng Phú', address: 'Khu dân cư Hưng Phú, Phường Hưng Phú, Thành phố Cần Thơ', province: 'Cần Thơ', district: 'Cái Răng', phone: '1900575792', hours: '8:00 - 20:00 (Thứ 2 - Chủ nhật)', lat: 10.0123, lng: 105.7489, active: true, sort_order: 2 },
    { id: 'bn-qv-1', name: 'Y99 Bắc Ninh — Quế Võ', address: 'Số 06, Khu phố I, Phường Quế Võ, Tỉnh Bắc Ninh', province: 'Bắc Ninh', district: 'Quế Võ', phone: '1900575792', hours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)', lat: 21.1541, lng: 106.1446, active: true, sort_order: 3 },
    { id: 'bn-tp-1', name: 'Y99 PGD Bắc Ninh (TP)', address: 'Đường Ngô Gia Tự, Phường Suối Hoa, Tỉnh Bắc Ninh', province: 'Bắc Ninh', district: 'Bắc Ninh', phone: '1900575792', hours: '8:00 - 20:30 (Thứ 2 - Thứ 7)', lat: 21.1861, lng: 106.0763, active: true, sort_order: 4 },
    { id: 'hcm-q1-1', name: 'Y99 PGD Quận 1 (đang mở rộng)', address: 'Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh', province: 'TP. Hồ Chí Minh', district: 'Quận 1', phone: '1900575792', hours: '8:00 - 20:00 (Thứ 2 - Chủ nhật)', lat: 10.7769, lng: 106.7009, active: true, sort_order: 5 },
    { id: 'hcm-q7-1', name: 'Y99 PGD Quận 7', address: 'Nguyễn Thị Thập, Phường Tân Phú, TP. Hồ Chí Minh', province: 'TP. Hồ Chí Minh', district: 'Quận 7', phone: '1900575792', hours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)', lat: 10.7314, lng: 106.7181, active: true, sort_order: 6 },
    { id: 'hn-hk-1', name: 'Y99 PGD Hoàn Kiếm', address: 'Phố Hàng Bài, Phường Hàng Bài, Hà Nội', province: 'Hà Nội', district: 'Hoàn Kiếm', phone: '1900575792', hours: '8:00 - 20:30 (Thứ 2 - Chủ nhật)', lat: 21.0245, lng: 105.8412, active: true, sort_order: 7 },
    { id: 'hn-cg-1', name: 'Y99 PGD Cầu Giấy', address: 'Xuân Thủy, Phường Dịch Vọng Hậu, Hà Nội', province: 'Hà Nội', district: 'Cầu Giấy', phone: '1900575792', hours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)', lat: 21.0382, lng: 105.7835, active: true, sort_order: 8 },
  ], 'id');

  await upsert('news_articles', [
    { slug: 'y99-mo-rong-mang-luoi-2026', title: 'Y99 mở rộng mạng lưới lên 500 phòng giao dịch trong năm 2026', excerpt: 'Y99 Finance công bố kế hoạch mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc, mang dịch vụ tài chính đến gần hơn với người dân.', category: 'Tin doanh nghiệp', date_display: '20/04/2026', image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80', content: ['Y99 Finance vừa công bố chiến lược mở rộng mạng lưới phòng giao dịch lên 500 điểm trên toàn quốc trong năm 2026, đánh dấu bước phát triển vượt bậc của doanh nghiệp trong lĩnh vực tài chính tiêu dùng.', 'Theo đại diện Y99, việc mở rộng mạng lưới sẽ giúp công ty phục vụ tốt hơn nhu cầu vay vốn nhanh, minh bạch của hàng triệu khách hàng tại các tỉnh thành. Mỗi phòng giao dịch đều được thiết kế hiện đại, thân thiện và áp dụng quy trình số hóa toàn diện.', 'Bên cạnh việc mở rộng quy mô, Y99 cũng đầu tư mạnh vào công nghệ, ứng dụng AI để tối ưu quy trình thẩm định, giúp khách hàng nhận được khoản vay chỉ trong 15 phút.'], published: true, sort_order: 1 },
    { slug: 'huong-dan-vay-bang-cavet-xe-may', title: 'Hướng dẫn chi tiết vay tiền bằng cà vẹt xe máy tại Y99', excerpt: 'Tất tần tật những điều cần biết khi vay tiền bằng cà vẹt xe máy: điều kiện, hồ sơ và quy trình giải ngân nhanh chỉ trong 15 phút.', category: 'Cẩm nang vay', date_display: '12/04/2026', image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80', content: ['Vay tiền bằng cà vẹt xe máy là một trong những giải pháp tài chính phổ biến nhất hiện nay. Tại Y99, khách hàng chỉ cần mang theo đăng ký xe chính chủ và CCCD là đã có thể nhận khoản vay lên đến 30 triệu đồng.', 'Đặc biệt, khách hàng vẫn được giữ và sử dụng xe bình thường sau khi vay. Y99 chỉ giữ giấy tờ đăng ký xe trong thời gian hợp đồng có hiệu lực.', 'Quy trình vay diễn ra nhanh chóng: đăng ký - định giá xe - ký hợp đồng - nhận tiền, tổng thời gian chỉ khoảng 15 phút.'], published: true, sort_order: 2 },
    { slug: 'y99-trao-tang-hoc-bong-2026', title: 'Y99 trao tặng 1.000 suất học bổng cho học sinh khó khăn năm 2026', excerpt: "Chương trình 'Tiếp sức đến trường' của Y99 năm nay đã trao 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho học sinh nghèo vượt khó trên toàn quốc.", category: 'Trách nhiệm xã hội', date_display: '05/04/2026', image_url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80', content: ["Trong khuôn khổ chương trình thiện nguyện 'Tiếp sức đến trường', Y99 Finance đã trao tặng 1.000 suất học bổng trị giá hơn 5 tỷ đồng cho các em học sinh nghèo vượt khó tại 30 tỉnh thành trên toàn quốc.", 'Chương trình là sự tiếp nối của chuỗi hoạt động trách nhiệm xã hội mà Y99 đã thực hiện trong nhiều năm qua, thể hiện cam kết đồng hành cùng cộng đồng và đóng góp vào sự phát triển bền vững của xã hội.'], published: true, sort_order: 3 },
    { slug: 'tang-truong-quy-1-2026', title: 'Y99 tăng trưởng 45% trong quý I/2026, dẫn đầu phân khúc', excerpt: 'Báo cáo kết quả kinh doanh quý I/2026 cho thấy Y99 đạt mức tăng trưởng ấn tượng 45% so với cùng kỳ năm trước, củng cố vị thế dẫn đầu thị trường.', category: 'Tin doanh nghiệp', date_display: '28/03/2026', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', content: ['Y99 Finance vừa công bố báo cáo kết quả kinh doanh quý I/2026 với mức tăng trưởng doanh thu đạt 45% so với cùng kỳ năm trước. Đây là tín hiệu tích cực cho thấy công ty đang phát triển bền vững.', 'Lợi nhuận trước thuế quý I đạt 250 tỷ đồng, hoàn thành 28% kế hoạch năm 2026. Số lượng khách hàng mới tăng 38%, đặc biệt là các sản phẩm vay theo lương và vay bằng cà vẹt xe máy.'], published: true, sort_order: 4 },
  ], 'slug');

  const products = [
    { slug: 'vay-tien-bang-cavet-xe-may', name: 'Vay tiền bằng cà vẹt xe máy', tagline: 'Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe máy là có ngay khoản vay.', description: 'Vay nhanh bằng cà vẹt (đăng ký) xe máy chính chủ. Y99 chỉ giữ giấy tờ, khách hàng vẫn sử dụng xe bình thường.', max_amount: 'Đến 30 triệu', max_term: '3 - 9 tháng', interest_rate: '1.099%/tháng', approval_time: '15 phút', benefits: ['Vẫn được sử dụng xe sau khi vay', 'Định giá xe minh bạch, công khai', 'Chỉ cần CCCD & VNeID mức 2', 'Duyệt vay nhanh trong 15 phút', 'Áp dụng cho mọi dòng xe máy', 'Tất toán linh hoạt, không phí phạt'], conditions: ['Công dân Việt Nam, từ 18 - 60 tuổi', 'Sở hữu xe máy chính chủ', 'CCCD & VNeID mức 2', 'Hóa đơn điện/ nước/ Wifi'], documents: ['CCCD/CMND bản gốc', 'Đăng ký xe máy bản gốc (cà vẹt)', 'Hộ khẩu / KT3 (bản photo)'], process: [{ title: 'Đăng ký', desc: 'Đăng ký online hoặc đến trực tiếp phòng giao dịch Y99.' }, { title: 'Định giá xe', desc: 'Chuyên viên định giá xe và đưa ra hạn mức vay phù hợp.' }, { title: 'Ký hợp đồng', desc: 'Ký hợp đồng vay tại quầy, giữ lại đăng ký xe gốc.' }, { title: 'Giải ngân', desc: 'Nhận tiền tại quầy hoặc chuyển khoản trong 15 phút.' }], image_key: 'vay-tien-bang-cavet-xe-may', published: true, sort_order: 1 },
    { slug: 'vay-tien-bang-cavet-oto', name: 'Vay tiền bằng cà vẹt ô tô', tagline: 'Vẫn giữ xe để đi - chỉ cần giấy đăng ký xe ô tô là có ngay khoản vay.', description: 'Sản phẩm vay tiền bằng cà vẹt ô tô dành cho khách hàng cần vốn lớn.', max_amount: 'Đến 2 tỷ', max_term: '3 - 9 tháng', interest_rate: '1.099%/tháng', approval_time: '30 phút', benefits: ['Hạn mức vay lên đến 2 tỷ đồng', 'Khách hàng vẫn sử dụng xe bình thường', 'Lãi suất ưu đãi cho khoản vay lớn', 'Định giá xe theo giá thị trường', 'Chỉ cần CCCD & VNeID mức 2', 'Hợp đồng minh bạch, công khai'], conditions: ['Công dân Việt Nam, từ 18 - 60 tuổi', 'Sở hữu xe ô tô chính chủ', 'CCCD & VNeID mức 2', 'Hóa đơn điện/ nước/ Wifi'], documents: ['CCCD/CMND bản gốc', 'Đăng ký xe ô tô bản gốc', 'Đăng kiểm xe còn hiệu lực', 'Bảo hiểm trách nhiệm dân sự còn hạn'], process: [{ title: 'Đăng ký', desc: 'Đăng ký qua hotline 1900575792 hoặc website.' }, { title: 'Định giá xe', desc: 'Chuyên viên đến tận nơi định giá xe của bạn.' }, { title: 'Thẩm định hồ sơ', desc: 'Y99 thẩm định nhanh, duyệt hồ sơ trong 30 phút.' }, { title: 'Giải ngân', desc: 'Ký hợp đồng và nhận tiền chuyển khoản hoặc tại quầy.' }], image_key: 'vay-tien-bang-cavet-oto', published: true, sort_order: 2 },
    { slug: 'vay-bang-icloud', name: 'Vay tiền bằng iCloud', tagline: 'Điện thoại vẫn dùng - tiền vẫn về. Không cần giữ máy.', description: 'Vay nhanh bằng iCloud iPhone của bạn. Y99 không giữ điện thoại.', max_amount: 'Đến 30 triệu', max_term: '3 - 9 tháng', interest_rate: '1.099%/tháng', approval_time: '15 phút', benefits: ['Không giữ máy - vẫn dùng iPhone bình thường', 'Thủ tục cực kỳ đơn giản', 'Duyệt vay siêu tốc trong 15 phút', 'Hạn mức theo giá trị máy', 'Không cần thẩm định người thân', 'Áp dụng cho iPhone từ đời 11 trở lên'], conditions: ['Công dân Việt Nam, từ 18 - 60 tuổi', 'Sở hữu iPhone đời 12 Pro Max trở lên', 'CCCD & VNeID mức 2', 'Hóa đơn điện/ nước/ Wifi'], documents: ['CCCD/CMND bản gốc', 'iPhone đăng nhập sẵn iCloud', 'Mật khẩu iCloud (để cài đặt liên kết)'], process: [{ title: 'Đăng ký', desc: 'Liên hệ CSKH hoặc đến PGD Y99.' }, { title: 'Kiểm tra máy', desc: 'Chuyên viên kiểm tra tình trạng máy và iCloud.' }, { title: 'Ký kết hợp đồng', desc: 'Ký kết hợp đồng và thiết lập bảo mật ICloud Y99.' }, { title: 'Nhận tiền', desc: 'Nhận tiền ngay tại quầy hoặc chuyển khoản.' }], image_key: 'vay-bang-icloud', published: true, sort_order: 3 },
  ];
  await upsert('loan_products', products, 'slug');

  await upsert('recruitment_jobs', [
    { title: 'Chuyên viên tư vấn tài chính', excerpt: 'Tư vấn giải pháp tài chính phù hợp, hỗ trợ khách hàng hoàn thiện hồ sơ và đồng hành xuyên suốt quá trình giải ngân.', location: 'Cần Thơ', job_type: 'Toàn thời gian', deadline: '31/05/2026', published: true, sort_order: 1 },
    { title: 'Nhân viên chăm sóc khách hàng', excerpt: 'Tiếp nhận, hỗ trợ và xử lý phản hồi khách hàng đa kênh.', location: 'TP. Hồ Chí Minh', job_type: 'Toàn thời gian', deadline: '05/06/2026', published: true, sort_order: 2 },
    { title: 'Chuyên viên phát triển kinh doanh', excerpt: 'Mở rộng mạng lưới đối tác, triển khai hoạt động thị trường tại khu vực phụ trách.', location: 'Hà Nội', job_type: 'Toàn thời gian', deadline: '10/06/2026', published: true, sort_order: 3 },
  ]);

  // hero_slides & testimonials: clear duplicates then insert
  const { data: existingSlides } = await supabase.from('hero_slides').select('id');
  if (!existingSlides?.length) {
    await upsert('hero_slides', [
      { title: 'Vay cà vẹt xe máy', alt_text: 'Vay tiền bằng cà vẹt xe máy tại Y99', image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80', link_to: '/cho-vay-cam-co/vay-tien-bang-cavet-xe-may', active: true, sort_order: 1 },
      { title: 'Vay cà vẹt ô tô', alt_text: 'Vay tiền bằng cà vẹt ô tô tại Y99', image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', link_to: '/cho-vay-cam-co/vay-tien-bang-cavet-oto', active: true, sort_order: 2 },
      { title: 'Vay iCloud', alt_text: 'Vay tiền bằng iCloud tại Y99', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ffdaa50?w=800&q=80', link_to: '/cho-vay-cam-co/vay-bang-icloud', active: true, sort_order: 3 },
      { title: 'Vay online', alt_text: 'Khám phá giải pháp vay tiền online của Y99', image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', link_to: '/vay-tien-online', active: true, sort_order: 4 },
      { title: 'Liên hệ', alt_text: 'Liên hệ tư vấn khoản vay nhanh cùng Y99', image_url: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9b?w=800&q=80', link_to: '/lien-he', active: true, sort_order: 5 },
      { title: 'Hệ thống PGD', alt_text: 'Hệ thống cửa hàng Y99 trên toàn quốc', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', link_to: '/he-thong-cua-hang', active: true, sort_order: 6 },
    ]);
  } else {
    console.log('⊙ hero_slides: already has data, skip');
  }

  const { data: existingT } = await supabase.from('testimonials').select('id');
  if (!existingT?.length) {
    await upsert('testimonials', [
      { author: 'Anh Minh Tuấn', role: 'Tài xế công nghệ - Hà Nội', content: 'Mình cần vốn gấp để sửa xe, Y99 duyệt và giải ngân chỉ trong 20 phút. Nhân viên tư vấn rất nhiệt tình.', active: true, sort_order: 1 },
      { author: 'Chị Thu Hằng', role: 'Nhân viên văn phòng - TP.HCM', content: 'Lãi suất rõ ràng, không có phí ẩn. App rất dễ dùng, mình theo dõi khoản trả mỗi tháng cực tiện.', active: true, sort_order: 2 },
      { author: 'Anh Quốc Huy', role: 'Chủ shop kinh doanh - Đà Nẵng', content: 'Lần đầu vay online mà cảm thấy yên tâm. Y99 chuyên nghiệp từ tư vấn đến hợp đồng.', active: true, sort_order: 3 },
      { author: 'Chị Ngọc Mai', role: 'Chủ tiệm làm đẹp - Cần Thơ', content: 'Mình cần xoay vốn nhập hàng gấp, Y99 hỗ trợ rất nhanh và giải thích hợp đồng rõ ràng từng khoản phí.', active: true, sort_order: 4 },
      { author: 'Anh Thanh Bình', role: 'Kỹ thuật viên - Bình Dương', content: 'Thủ tục đơn giản, chỉ cần giấy tờ cơ bản là được tư vấn gói phù hợp. Quy trình làm việc minh bạch, dễ hiểu.', active: true, sort_order: 5 },
      { author: 'Chị Hoài An', role: 'Kinh doanh tự do - Đồng Nai', content: 'Mình đánh giá cao cách chăm sóc khách hàng của Y99. Nhắc lịch thanh toán rõ ràng, hỗ trợ linh hoạt khi cần tư vấn thêm.', active: true, sort_order: 6 },
    ]);
  } else {
    console.log('⊙ testimonials: already has data, skip');
  }

  console.log('\nDone — seed CMS data on Supabase.');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
