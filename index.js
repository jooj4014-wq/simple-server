const http = require("http");
const fs = require("fs");
const { exec } = require("child_process");
const https = require("https");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
    return res.end("Server is running 🚀");
  }

  if (req.method === "POST" && req.url === "/api/create-video") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      const videoUrl = data.videoUrl;

      const input = "input.mp4";
      const output = "final.mp4";

      // تحميل الفيديو
      const file = fs.createWriteStream(input);
      https.get(videoUrl, response => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();

          // قص 30 ثانية
          exec(
            `ffmpeg -y -i ${input} -t 30 -vf "scale=1080:1920" ${output}`,
            (err) => {
              if (err) {
                res.writeHead(500);
                return res.end("FFmpeg error");
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                status: "success",
                video: "/download"
              }));
            }
          );
        });
      });
    });
    return;
  }

  if (req.method === "GET" && req.url === "/download") {
    const filePath = path.join(__dirname, "final.mp4");
    res.writeHead(200, { "Content-Type": "video/mp4" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
