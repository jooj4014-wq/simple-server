// إنشاء فيديو (POST)
if (req.method === "POST" && req.url === "/api/create-video") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);

    // 🔹 هنا لاحقًا سيتم إنشاء الفيديو الحقيقي
    // الآن نرجّع رابط تجريبي
    const videoUrl = "https://example.com/final-short.mp4";

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "success",
      finalVideoUrl: videoUrl,
      receivedData: data
    }));
  });

  return;
}
