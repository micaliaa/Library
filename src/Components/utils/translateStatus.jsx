
export const translateStatus = (status, to = "en") => {
  if (!status) return "";

  const map = {
    Dipinjam: "Borrowed",
    Selesai: "Finished",
    Terlambat: "Late",
    Borrowed: "Dipinjam",
    Finished: "Selesai",
    Late: "Terlambat",
  };

  return map[status] || status;
};

// 🔁 Helper untuk normalisasi array data
export const normalizeStatuses = (items, to = "en") => {
  return items.map(item => ({
    ...item,
    StatusPeminjaman: translateStatus(item.StatusPeminjaman, to),
  }));
};
