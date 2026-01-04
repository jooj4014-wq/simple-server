const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  // السماح بالطلبات من n8n
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // الصفحة الرئيسية
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running 🚀");
  }

  // API test
  if (req.method === "GET" && req.url === "/api/test") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // إنشاء فيديو (استقبال من n8n)
  if (req.method === "POST" && req.url === "/api/create-video") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let data = {};

      try {
        data = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      // رابط فيديو تجريبي (لاحقًا نستبدله بفيديو حقيقي)
      const finalVideoUrl = "https://example.com/final-short.mp4";

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        message: "Video request received",
        finalVideoUrl,
        receivedData: data
      }));
    });

    return;
  }

  // غير معروف
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
