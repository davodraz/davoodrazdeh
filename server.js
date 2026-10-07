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
      padding: 30px;
    }

    .panel {
      max-width: 600px;
      margin: auto;
      background: #1f2937;
      padding: 25px;
      border-radius: 15px;
    }

    h1 {
      text-align: center;
    }

    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 6px;
    }

    input, select, button {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border-radius: 8px;
      border: none;
      margin-bottom: 10px;
      font-size: 16px;
    }

    button {
      cursor: pointer;
      background: #2563eb;
      color: white;
      font-weight: bold;
    }

    button:hover {
      background: #1d4ed8;
    }

    textarea {
      width: 100%;
      box-sizing: border-box;
      height: 130px;
      border-radius: 8px;
      padding: 10px;
      margin-top: 10px;
      direction: ltr;
    }

    .result {
      margin-top: 20px;
    }
  </style>
</head>

<body>

<div class="panel">

  <h1>پنل ساخت VLESS</h1>

  <form method="POST" action="/generate">

    <label>Address / دامنه یا IP سرور</label>
    <input
      type="text"
      name="address"
      placeholder="example.com"
      required
    >

    <label>Port</label>
    <input
      type="number"
      name="port"
      value="443"
      required
    >

    <label>UUID</label>
    <input
      type="text"
      name="uuid"
      placeholder="UUID را وارد کنید"
      required
    >

    <label>Transport</label>
    <select name="type">
      <option value="tcp">TCP</option>
      <option value="ws">WebSocket</option>
    </select>

    <label>TLS</label>
    <select name="security">
      <option value="tls">TLS</option>
      <option value="none">None</option>
    </select>

    <button type="submit">
      ساخت کانفیگ
    </button>

  </form>

</div>

</body>
</html>
  `);
});

app.post("/generate", (req, res) => {
  const { address, port, uuid, type, security } = req.body;

  const config =
    `vless://${uuid}@${address}:${port}?type=${type}&security=${security}#VLESS-Config`;

  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VLESS Config</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #111827;
      color: white;
      padding: 30px;
    }

    .panel {
      max-width: 700px;
      margin: auto;
      background: #1f2937;
      padding: 25px;
      border-radius: 15px;
    }

    textarea {
      width: 100%;
      height: 160px;
      box-sizing: border-box;
      direction: ltr;
      padding: 10px;
      border-radius: 8px;
    }

    button {
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }

    a {
      display: block;
      text-align: center;
      margin-top: 15px;
      color: white;
    }
  </style>
</head>

<body>

<div class="panel">

  <h2>کانفیگ ساخته شد ✅</h2>

  <textarea id="config" readonly>${config}</textarea>

  <button onclick="copyConfig()">
    کپی کانفیگ
  </button>

  <a href="/">
    ساخت کانفیگ جدید
  </a>

</div>

<script>
function copyConfig() {
  const text = document.getElementById("config").value;

  navigator.clipboard.writeText(text).then(() => {
    alert("کانفیگ کپی شد ✅");
  });
}
</script>

</body>
</html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
