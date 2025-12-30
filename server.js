const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3001;


// ✅ CORS 허용 (이거 추가)
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

// 업로드 API
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  res.json({
    filename: req.file.filename,
    url: `/products/${req.file.filename}`
  });
});


app.listen(PORT, () => {
  console.log(`서버 실행 중 → http://localhost:${PORT}`);
});
