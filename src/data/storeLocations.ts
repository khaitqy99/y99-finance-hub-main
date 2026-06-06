export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
};

/** PGD Y99 — tọa độ xấp xỉ; có thể thay bằng dữ liệu CMS/API. */
export const storeLocations: StoreLocation[] = [
  {
    id: "ct-nk-1",
    name: "Y99 Phòng giao dịch Ninh Kiều",
    address: "99B Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ",
    province: "Cần Thơ",
    district: "Ninh Kiều",
    phone: "1900575792",
    hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
    lat: 10.0459,
    lng: 105.7871,
  },
  {
    id: "ct-nk-2",
    name: "Y99 PGD Hưng Phú",
    address: "Khu dân cư Hưng Phú, Phường Hưng Phú, Thành phố Cần Thơ",
    province: "Cần Thơ",
    district: "Cái Răng",
    phone: "1900575792",
    hours: "8:00 - 20:00 (Thứ 2 - Chủ nhật)",
    lat: 10.0123,
    lng: 105.7489,
  },
  {
    id: "bn-qv-1",
    name: "Y99 Bắc Ninh — Quế Võ",
    address: "Số 06, Khu phố I, Phường Quế Võ, Tỉnh Bắc Ninh",
    province: "Bắc Ninh",
    district: "Quế Võ",
    phone: "1900575792",
    hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
    lat: 21.1541,
    lng: 106.1446,
  },
  {
    id: "bn-tp-1",
    name: "Y99 PGD Bắc Ninh (TP)",
    address: "Đường Ngô Gia Tự, Phường Suối Hoa, Tỉnh Bắc Ninh",
    province: "Bắc Ninh",
    district: "Bắc Ninh",
    phone: "1900575792",
    hours: "8:00 - 20:30 (Thứ 2 - Thứ 7)",
    lat: 21.1861,
    lng: 106.0763,
  },
  {
    id: "hcm-q1-1",
    name: "Y99 PGD Quận 1 (đang mở rộng)",
    address: "Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    phone: "1900575792",
    hours: "8:00 - 20:00 (Thứ 2 - Chủ nhật)",
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: "hcm-q7-1",
    name: "Y99 PGD Quận 7",
    address: "Nguyễn Thị Thập, Phường Tân Phú, TP. Hồ Chí Minh",
    province: "TP. Hồ Chí Minh",
    district: "Quận 7",
    phone: "1900575792",
    hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
    lat: 10.7314,
    lng: 106.7181,
  },
  {
    id: "hn-hk-1",
    name: "Y99 PGD Hoàn Kiếm",
    address: "Phố Hàng Bài, Phường Hàng Bài, Hà Nội",
    province: "Hà Nội",
    district: "Hoàn Kiếm",
    phone: "1900575792",
    hours: "8:00 - 20:30 (Thứ 2 - Chủ nhật)",
    lat: 21.0245,
    lng: 105.8412,
  },
  {
    id: "hn-cg-1",
    name: "Y99 PGD Cầu Giấy",
    address: "Xuân Thủy, Phường Dịch Vọng Hậu, Hà Nội",
    province: "Hà Nội",
    district: "Cầu Giấy",
    phone: "1900575792",
    hours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
    lat: 21.0382,
    lng: 105.7835,
  },
];

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "vi"));
}

export function provincesFromStores(stores: StoreLocation[]) {
  return uniqueSorted(stores.map((s) => s.province));
}

export function districtsForProvince(stores: StoreLocation[], province: string | null) {
  if (!province) return uniqueSorted(stores.map((s) => s.district));
  return uniqueSorted(stores.filter((s) => s.province === province).map((s) => s.district));
}
