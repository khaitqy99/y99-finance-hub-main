export type CommunitySlide = {
  id: string;
  title: string;
  alt: string;
  image: string;
  videoUrl?: string;
  linkTo?: string;
};

export const fallbackCommunitySlides: CommunitySlide[] = [
  {
    id: "1",
    title: "Tiếp sức đến trường",
    alt: "Y99 trao học bổng cho học sinh khó khăn",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1400&q=80",
  },
  {
    id: "2",
    title: "Đồng hành cùng cộng đồng",
    alt: "Hoạt động thiện nguyện Y99",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&q=80",
  },
  {
    id: "3",
    title: "Kết nối địa phương",
    alt: "Y99 đồng hành cùng người dân địa phương",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=80",
  },
];
