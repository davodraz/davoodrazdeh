const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
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
  background: #111827;
  color: white;
  margin: 0;
  padding: 25px;
}

.panel {
  max-width: 600px;
  margin: auto;
  background: #1f2937;
  padding: 25px;
  border-radius: 18px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

label {
  display: block;
  margin: 15px 0 7px;
}

input, select, button {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border-radius: 9px;
  border: none;
  font-size: 16px;
}

button {
  margin-top: 20px;
  background: #2563eb;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.uuid-box {
  display: flex;
  gap: 8px;
}

.uuid-box input {
  flex: 1;
}

.uuid-box button {
  width: 110px;
  margin-top: 0;
}

.result {
  margin-top: 25px;
  display: none;
}

textarea {
  width: 100%;
  height: 130px;
  box-sizing: border-box;
  direction: ltr;
  padding: 10px;
  border-radius: 9px;
  border: none;
}

.copy {
  background: #059669;
}

#qrcode {
  margin: 20px auto;
  width: 200px;
  background: white;
  padding: 10px;
}
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

</head>

<body>

<div class="panel">

<h1>پنل ساخت VLESS</h1>

<label>Address / IP سرور</label>
<input id="address" placeholder="example.com">

<label>Port</label>
<input id="port" type="number" value="443">

<label>UUID</label>

<div class="uuid-box">
  <input id="uuid" placeholder="UUID">
  <button type="button" onclick="generateUUID()">تولید UUID</button>
</div>

<label>Transport</label>
<select id="type">
  <option value="tcp">TCP</option>
  <option value="ws">WebSocket</option>
</select>

<label>TLS</label>
<select id="security">
  <option value="tls">TLS</option>
  <option value="none">None</option>
</select>

<button onclick="generateConfig()">
ساخت کانفیگ
</button>

<div class="result" id="result">

<h3>کانفیگ ساخته شد ✅</h3>

<textarea id="config" readonly></textarea>

<button class="copy" onclick="copyConfig()">
کپی کانفیگ
</button>

<h3 style="text-align:center">
QR Code
</h3>

<div id="qrcode"></div>

</div>

</div>

<script>

function generateUUID() {
  const uuid = crypto.randomUUID();
  document.getElementById("uuid").value = uuid;
}

function generateConfig() {

  const address = document.getElementById("address").value.trim();
  const port = document.getElementById("port").value;
  const uuid = document.getElementById("uuid").value.trim();
  const type = document.getElementById("type").value;
  const security = document.getElementById("security").value;

  if (!address) {
    alert("Address یا IP سرور را وارد کنید");
    return;
  }

  if (!uuid) {
    generateUUID();
  }

  const finalUUID = document.getElementById("uuid").value;

  const config =
    "vless://" +
    finalUUID +
    "@" +
    address +
    ":" +
    port +
    "?type=" +
    type +
    "&security=" +
    security +
    "#VLESS-Config";

  document.getElementById("config").value = config;

  document.getElementById("result").style.display = "block";

  document.getElementById("qrcode").innerHTML = "";

  new QRCode(document.getElementById("qrcode"), {
    text: config,
    width: 200,
    height: 200
  });
}

function copyConfig() {

  const config = document.getElementById("config").value;

  navigator.clipboard.writeText(config);

  alert("کانفیگ کپی شد ✅");
}

</script>

</body>
</html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
