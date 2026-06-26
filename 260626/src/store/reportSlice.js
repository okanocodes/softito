import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportslist: [
    {
      id: 1,
      title: "Ciro_Raporu.pdf",
      size: "2.4MB",
      date: "24.06.2026 16.00",
      url: "#",
    },
    {
      id: 2,
      title: "Stok_Raporu.pdf",
      size: "2.4MB",
      date: "24.06.2026 16.00",
      url: "#",
    },
  ],
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    generateReport: (state, action) => {
      const { type, range, format } = action.payload;
      const fileExt = format === "Excel(.xlsx)" ? "xlsx" : "pdf";
      const titleAbbr = type
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase();

      const rangeClean = range.replace(" ", "_");
      const title = `${titleAbbr}_Raporu_${rangeClean}.${fileExt}`;
      const sizeNum = (1.2 + Math.random() * 3).toFixed(1);
      const size = `${sizeNum} MB`;
      const dateStr = new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const nextId =
        state.reportslist.length > 0
          ? Math.max(...state.reportslist.map((r) => r.id)) + 1
          : 1;

      state.reportslist.unshift({
        id: nextId,
        title,
        size,
        date: dateStr,
        url: "#",
      });
    },
  },
});

export const { generateReport } = reportSlice.actions;
export default reportSlice.reducer;
