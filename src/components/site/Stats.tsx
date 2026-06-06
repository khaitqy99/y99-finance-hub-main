const stats = [
  { value: "800+", label: "Phòng giao dịch toàn quốc" },
  { value: "2.5M+", label: "Khách hàng tin tưởng" },
  { value: "15 phút", label: "Thời gian giải ngân" },
  { value: "10 năm", label: "Kinh nghiệm hoạt động" },
];

const Stats = () => {
  return (
    <section className="py-6 bg-card border-y border-border">
      <div className="container grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-primary">
              {s.value}
            </div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
