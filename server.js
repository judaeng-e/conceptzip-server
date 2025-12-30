const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

if (!fs.existsSync("products")) {
  fs.mkdirSync("products", { recursive: true });
}

// ✅ CORS 허용
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// 이미지 저장 위치 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "products");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// 정적 파일 제공
app.use("/products", express.static(path.join(__dirname, "products")));

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ req.file 없음");
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      filename: req.file.filename,
      url: `/products/${req.file.filename}`
    });
  } catch (err) {
    console.error("🔥 업로드 에러:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


app.listen(PORT, () => {
  console.log(`서버 실행 중 → PORT ${PORT}`);
});
