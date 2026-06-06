const policyHeading = "CHÍNH SÁCH LÃI SUẤT & PHÍ DỊCH VỤ TẠI Y99";
const policySubheading = "(Áp dụng cho các sản phẩm Cầm cố Tài sản/Vay nhanh)";

const policyContent = `Hệ thống Y99 cam kết mang đến giải pháp tài chính minh bạch, an toàn và tối ưu nhất cho khách hàng. Dưới đây là chi tiết về biểu phí và lãi suất áp dụng cho các gói vay tại hệ thống của chúng tôi:

1. LÃI SUẤT VAY ƯU ĐÃI
Mức lãi suất: 1,09% / tháng (tương đương khoảng 13,08% / năm).
Cách tính: Lãi suất được tính trên dư nợ gốc thực tế.

2. BIỂU PHÍ DỊCH VỤ CƠ BẢN
Để duy trì hệ thống vận hành và đảm bảo quyền lợi tốt nhất cho khách hàng, Y99 áp dụng các loại phí sau:
Phí Thẩm định hồ sơ/Tài sản: 3% - 5% trên giá trị khoản vay.
Mức phí này bao gồm: Chi phí định giá tài sản, kiểm tra tình trạng pháp lý và xét duyệt hồ sơ nhanh.
Phí Bảo hiểm Khoản vay/Tài sản: 3% - 5% trên giá trị khoản vay.
Mức phí này đảm bảo tài sản cầm cố (xe máy, điện thoại, iCloud...) được bảo quản trong tình trạng tốt nhất hoặc bảo vệ khách hàng trước các rủi ro tài chính bất khả kháng.
Lưu ý: Tỷ lệ phần trăm phí cụ thể (từ 3% đến 5%) sẽ được áp dụng tùy vào loại tài sản cầm cố, thời gian vay và giá trị khoản vay thực tế của khách hàng.

3. VÍ DỤ MINH HỌA (Tạm tính)
Nếu khách hàng vay số tiền: 10.000.000 VNĐ trong vòng 1 tháng:
Tiền lãi (1,09%): 109.000 VNĐ
Phí thẩm định (Tạm tính 4%): 400.000 VNĐ
Phí bảo hiểm (Tạm tính 4%): 400.000 VNĐ
Tổng chi phí trả cho tháng đó: 909.000 VNĐ

4. QUY ĐỊNH VỀ THANH TOÁN & TẤT TOÁN
Kỳ hạn vay: Linh hoạt theo nhu cầu của khách hàng (từ 1 tháng đến 12 tháng hoặc dài hơn).
Tất toán trước hạn: Y99 khuyến khích khách hàng trả nợ trước hạn để tiết kiệm chi phí lãi suất. Không áp dụng phí phạt tất toán (hoặc áp dụng mức phí cực thấp tùy theo gói vay cụ thể).
Gia hạn khoản vay: Khách hàng có thể gia hạn khoản vay bằng cách thanh toán đầy đủ tiền lãi và các khoản phí của kỳ hiện tại.

5. CAM KẾT TỪ Y99
Minh bạch 100%: Mọi chi phí được thông báo rõ ràng trước khi ký kết hợp đồng. Không có phí ẩn.
Bảo mật thông tin: Tuyệt đối giữ kín thông tin cá nhân và giao dịch của khách hàng.
Thủ tục nhanh gọn: Giải ngân nhanh chóng trong 15-30 phút sau khi thẩm định tài sản thành công.

HỆ THỐNG Y99 - NHANH CHÓNG • UY TÍN • ĐƠN GIẢN
Website: y99.vn
Hotline: 1900575792
Trụ sở: 99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ`;

const InterestFeePolicy = () => {
  const contentLines = policyContent.split("\n");

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <article className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-extrabold text-foreground">
            Chính sách lãi suất và phí dịch vụ
          </h1>
          <p className="mt-3 text-center text-base md:text-lg font-bold text-foreground">
            {policyHeading}
          </p>
          <p className="mt-1 text-center text-sm md:text-base text-muted-foreground">
            {policySubheading}
          </p>
          <div className="mt-4 space-y-1 text-sm md:text-base leading-7 text-muted-foreground">
            {contentLines.map((line, index) => {
              const isSectionTitle = /^\d+\.\s+/.test(line.trim());
              const isFinalHeader = line.trim().startsWith("HỆ THỐNG Y99");

              if (!line.trim()) {
                return <div key={`line-${index}`} className="h-3" />;
              }

              return (
                <p
                  key={`line-${index}`}
                  className={isSectionTitle || isFinalHeader ? "font-bold text-foreground pt-2" : undefined}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
};

export default InterestFeePolicy;
