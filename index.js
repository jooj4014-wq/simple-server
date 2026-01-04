const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end("API OK 🚀");
  }

  if (req.method === "POST" && req.url === "/api/create-video") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "success",
        message: "Request received successfully",
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl
      }));
    });
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
