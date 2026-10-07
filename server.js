const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Public VLESS subscription source
const SOURCE_URL =
  "https://" +
  "raw.githubusercontent.com/mehrtat/vless-collector/main/sub.txt";

// Subscription token
const SUB_TOKEN = process.env.SUB_TOKEN || "free-vless";

async function getSubscription() {
  const response = await fetch(SOURCE_URL);

  if (!response.ok) {
    throw new Error("Could not download subscription source");
  }

  return await response.text();
}

// Main panel
app.get("/", async (req, res) => {
  let count = "نامشخص";

  try {
    const data = await getSubscription();

    const decoded = Buffer.from(
      data.replace(/\s/g, ""),
      "base64"
    ).toString("utf8");

    count = decoded
      .split(/\r?\n/)
      .filter(line => line.trim().startsWith("vless://"))
      .length;
  } catch (error) {
    console.error(error);
  }

  const subscriptionUrl =
    `${req.protocol}://${req.get("host")}/sub/${SUB_TOKEN}`;

  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>VLESS Panel</title>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f2f2f2;
  margin: 0;
  padding: 30px;
}

.box {
  max-width: 700px;
  margin: auto;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,.1);
}

h1 {
  text-align: center;
}

.info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
}

textarea {
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  direction: ltr;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 13px;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: #222;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  opacity: .85;
}

.success {
  color: green;
  font-weight: bold;
}
</style>
</head>

<body>

<div class="box">

<h1>پنل VLESS</h1>

<div class="info">
تعداد کانفیگ‌های موجود:
<strong>${count}</strong>
</div>

<p>آدرس Subscription شما:</p>

<textarea id="subUrl" readonly>${subscriptionUrl}</textarea>

<button onclick="copySub()">
کپی لینک Subscription
</button>

<p class="success" id="message"></p>

<hr>

<p>
این لینک را می‌توانی داخل v2rayNG، V2Box یا کلاینت‌های سازگار با Subscription وارد کنی.
</p>

</div>

<script>
function copySub() {
  const text = document.getElementById("subUrl").value;

  navigator.clipboard.writeText(text);

  document.getElementById("message").innerText =
    "لینک کپی شد ✅";
}
</script>

</body>
</html>
  `);
});

// Subscription endpoint
app.get("/sub/:token", async (req, res) => {

  if (req.params.token !== SUB_TOKEN) {
    return res.status(404).send("Subscription not found");
  }

  try {
    const subscription = await getSubscription();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    res.send(subscription);

  } catch (error) {

    console.error(error);

    res.status(502).send(
      "Unable to get VLESS subscription"
    );
  }
});

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Panel running on port ${PORT}`);
});
