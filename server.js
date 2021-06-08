const express = require("express");
const cors = require("cors");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: "./uploads/images",
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
    },
});
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads/images"));

app.get("/", (req, res) => {
    res.send(req.headers);
});
app.post("/upload", upload.single("photo"), (req, res) => {
    if (req.file) {
        const response = {
            originalName: req.file.originalname,
            size: req.file.size,
            url:
                req.protocol +
                "://" +
                req.headers.host +
                "/uploads/" +
                req.file.filename,
        };
        res.json(response);
    } else res.status(400).json({ error: "No files set in the request" });
});

const PORT = 3030;
const server = app.listen(PORT, () => {
    console.log("Listening at port " + PORT);
});
console.log(server.address());
