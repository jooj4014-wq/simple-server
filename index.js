const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // السماح لـ n8n
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // اختبار السيرفر
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running ✅");
  }

  // API إنشاء فيديو (اختبار فقط)
  if (req.method === "POST" && req.url === "/api/create-video") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let data;

      try {
        data = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      // نرجع البيانات فقط (اختبار)
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "success",
        message: "Data received",
        received: data
      }));
    });

    return;
  }

  // أي شيء آخر
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
