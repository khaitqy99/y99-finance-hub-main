const disclaimerHeading = "TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM - Y99.VN";

const disclaimerContent = `Chào mừng quý khách đến với website chính thức của Y99 (tại địa chỉ: y99.vn). Trước khi sử dụng thông tin hoặc dịch vụ của chúng tôi, vui lòng đọc kỹ bản Tuyên bố Miễn trừ Trách nhiệm này. Việc bạn tiếp tục truy cập và sử dụng website đồng nghĩa với việc bạn chấp nhận các điều khoản dưới đây:

1. Thông tin mang tính chất tham khảo
Mọi nội dung trên website y99.vn, bao gồm nhưng không giới hạn ở: bài viết, video, thông tin lãi suất, quy trình cầm cố và các công cụ tính toán tài chính, đều chỉ mang tính chất tham khảo. Chúng tôi nỗ lực cập nhật thông tin chính xác nhất, tuy nhiên, các chính sách, lãi suất và điều khoản dịch vụ có thể thay đổi tùy từng thời điểm và từng trường hợp khách hàng cụ thể mà không cần báo trước.

2. Không phải là lời khuyên tài chính chuyên nghiệp
Các nội dung trên website không cấu thành một lời khuyên tài chính, tư vấn đầu tư hay cam kết pháp lý bắt buộc. Khách hàng cần tự đánh giá khả năng tài chính và rủi ro cá nhân trước khi thực hiện bất kỳ giao dịch cầm cố hoặc vay mượn nào. Y99 khuyến khích quý khách đọc kỹ hợp đồng thực tế tại cửa hàng trước khi ký kết.

3. Trách nhiệm của người dùng
Y99 không chịu trách nhiệm cho bất kỳ tổn thất, thiệt hại (trực tiếp hoặc gián tiếp) phát sinh từ việc người dùng sử dụng thông tin trên website này để đưa ra các quyết định cá nhân mà không thông qua sự tư vấn trực tiếp từ nhân viên của chúng tôi. Người dùng hoàn toàn chịu trách nhiệm về việc bảo mật thông tin cá nhân khi tương tác trên môi trường internet.

4. Liên kết từ bên thứ ba
Website có thể chứa các liên kết đến các trang web bên thứ ba (như mạng xã hội, bản đồ, đối tác liên kết). Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách bảo mật hoặc tính chính xác của các trang web bên thứ ba này. Việc truy cập vào các liên kết đó là sự tự nguyện và rủi ro của riêng người dùng.

5. Sự cố kỹ thuật
Chúng tôi không cam kết website sẽ luôn hoạt động liên tục, không có lỗi hoặc không bị nhiễm virus/mã độc do các yếu tố khách quan ngoài tầm kiểm soát. Y99 sẽ không chịu trách nhiệm về các thiệt hại liên quan đến việc gián đoạn truy cập hoặc sự cố kỹ thuật của hệ thống mạng.

6. Quy định về tính pháp lý
Dịch vụ cầm cố của Y99 được thực hiện dựa trên sự tự nguyện và tuân thủ các quy định hiện hành của pháp luật Việt Nam về dịch vụ cầm đồ và cho vay dân sự. Mọi tranh chấp phát sinh (nếu có) sẽ được giải quyết dựa trên văn bản hợp đồng chính thức được ký kết giữa hai bên tại cơ sở hoạt động, không căn cứ duy nhất trên nội dung sơ bộ tại website.

THÔNG TIN LIÊN HỆ CHÍNH THỨC: Nếu quý khách có bất kỳ câu hỏi nào liên quan đến nội dung hoặc cần tư vấn trực tiếp để có thông tin chính xác nhất, vui lòng liên hệ:
Hệ thống Y99 - Cầm đồ & Vay nhanh uy tín
Website: y99.vn
Hotline/Zalo: 1900575792
Địa chỉ: 99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ`;

const Disclaimer = () => {
  const contentLines = disclaimerContent.split("\n");

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <article className="rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-extrabold text-foreground">
            Tuyên bố miễn trừ trách nhiệm
          </h1>
          <p className="mt-3 text-center text-base md:text-lg font-bold text-foreground">
            {disclaimerHeading}
          </p>
          <div className="mt-4 space-y-1 text-sm md:text-base leading-7 text-muted-foreground">
            {contentLines.map((line, index) => {
              const isSectionTitle = /^\d+\.\s+/.test(line.trim());
              const isContactHeader = line.trim().startsWith("THÔNG TIN LIÊN HỆ CHÍNH THỨC:");

              if (!line.trim()) {
                return <div key={`line-${index}`} className="h-3" />;
              }

              return (
                <p
                  key={`line-${index}`}
                  className={isSectionTitle || isContactHeader ? "font-bold text-foreground pt-2" : undefined}
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

export default Disclaimer;
