const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const FILE = "urls.json";

// Generate short code
function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

// Create short URL
app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    fs.readFile(FILE, "utf8", (err, data) => {
        let urls = [];

        if (!err && data) {
            urls = JSON.parse(data);
        }

        const shortCode = generateCode();

        urls.push({
            longUrl,
            shortCode
        });

        fs.writeFile(FILE, JSON.stringify(urls, null, 2), () => {
            res.json({
                shortUrl: `http://localhost:${PORT}/${shortCode}`
            });
        });
    });
});

// Redirect
app.get("/:code", (req, res) => {
    const code = req.params.code;

    fs.readFile(FILE, "utf8", (err, data) => {
        const urls = JSON.parse(data || "[]");

        const found = urls.find(u => u.shortCode === code);

        if (found) {
            res.redirect(found.longUrl);
        } else {
            res.send("URL not found");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});