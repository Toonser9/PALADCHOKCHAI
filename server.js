// ====== SETTINGS ======
const CHANNEL_ACCESS_TOKEN = "oaEMFxceVhGWiEOweCUoVJQA4CX8R+RdWRlYkKzL3imcufSGlrZs41jYPiLBg/1Osf3OcxbLhHcAsmS8YpLs13FqxBSBLdg31cLLfSihdCVHos5QxAdZxnGcUGr1uYDCsbvROUz2D2S5lGvR/wT3gQdB04t89/1O/w1cDnyilFU=";
const GROUP_ID = "590135483964064154"; // LINE Group ของหัวหน้า

// ====== ตั้งค่า SERVER ======
const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== รับข้อมูลจากฟอร์ม ======
app.post("/submit", async (req, res) => {
  const data = req.body;

  // สร้างข้อความที่จะส่ง
  const message = `
📌 มีการส่งแบบฟอร์มใหม่

📍 มิติการปฏิบัติงาน: ${data.dimension || "-"}
📍 ตำบล: ${data.subdistrict || "-"}
🏘 หมู่บ้าน: ${data.village || "-"}
📅 วันที่: ${data.day || "-"} / ${data.month || "-"} / ${data.year || "-"}
📝 รายละเอียดงาน:
${data.details || "-"}
`;

  try {
    // ====== ส่งข้อความเข้า LINE GROUP ======
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
      },
      body: JSON.stringify({
        to: GROUP_ID,
        messages: [
          { type: "text", text: message }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("LINE API error:", errText);
      return res.status(500).send("เกิดข้อผิดพลาดในการส่ง LINE");
    }

    res.send("ส่งข้อมูลสำเร็จ!");
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาดในการส่งข้อมูล");
  }
});

// ====== เริ่มเซิร์ฟเวอร์ ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
