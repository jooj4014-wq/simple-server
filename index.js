const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;

// ======================
// إنشاء السيرفر
// ======================
const server = http.createServer((req, res) => {

  // ======================
  // الصفحة الرئيسية
  // ======================
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running 🚀");
  }

  // ======================
  // اختبار API
  // ======================
  if (req.method === "GET" && req.url === "/api/test") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // ======================
  // إنشاء فيديو Short
  // ======================
  if (req.method === "POST" && req.url === "/api/create-video") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        const videoUrl = data.videoUrl;
        const duration = data.duration || 30;

        if (!videoUrl) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "videoUrl is required" }));
        }

        const outputFile = `short_${Date.now()}.mp4`;
        const outputPath = path.join(__dirname, outputFile);

        // ======================
        // ffmpeg command
        // ======================
        const ffmpegCommand = `
          ffmpeg -y -i "${videoUrl}" 
          -t ${duration}
          -vf "scale=1080:1920:force_original_aspect_ratio=decrease,
               pad=1080:1920:(ow-iw)/2:(oh-ih)/2"
          -c:a copy
          "${outputPath}"
        `;

        exec(ffmpegCommand, (error) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({
              status: "error",
              message: error.message
            }));
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            status: "success",
            finalVideoUrl: `${req.headers.origin || "https://YOUR-RENDER-URL"}/${outputFile}`
          }));
        });

      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });

    return;
  }

  // ======================
  // تقديم ملفات MP4
  // ======================
  if (req.method === "GET" && req.url.endsWith(".mp4")) {
    const filePath = path.join(__dirname, req.url);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": "video/mp4" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end("File not found");
    }
    return;
  }

  // ======================
  // غير ذلك
  // ======================
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
