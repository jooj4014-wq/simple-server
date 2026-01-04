const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // السماح بالطلبات من أي مكان (مهم لـ n8n)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // طلبات OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // الصفحة الرئيسية
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running 🚀");
  }

  // اختبار API
  if (req.method === "GET" && req.url === "/api/test") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // استقبال البيانات من n8n (بدون إنشاء فيديو)
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

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "success",
        message: "Data received successfully ✅",
        receivedData: data
      }));
    });

    return;
  }

  // أي رابط آخر
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
