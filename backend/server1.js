const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/uploads", express.static("uploads"));

// DB connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ================= AUTH =================

// REGISTER
app.post("/signup", async (req, res) => {
  const { name, email, password, mobile, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name,email,password,mobile,address) VALUES (?,?,?,?,?)",
      [name, email, hashedPassword, mobile, address],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
          }
          return res.status(500).json(err);
        }

        res.json({ message: "Registered successfully" });
      },
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN (single clean version)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Remove password before sending
      delete user.password;

      res.json({
        message: "Login successful",
        token,
        user,
      });
    },
  );
});

// ================= MIDDLEWARE =================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.id;
    next();
  });
};

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= PRODUCTS =================

// Add Product (Protected)
app.post("/add-product", verifyToken, upload.single("image"), (req, res) => {
  const { name, price } = req.body;

  if (!name || !price)
    return res.status(400).json({ message: "Missing fields" });

  if (!req.file) return res.status(400).json({ message: "Image required" });

  const image = req.file.filename;

  db.query(
    "INSERT INTO products (name, price, image) VALUES (?, ?, ?)",
    [name, price, image],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added successfully" });
    },
  );
});

// Get Products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Delete Product
app.delete("/product/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product deleted" });
  });
});

// Update Product
app.put("/product/:id", verifyToken, upload.single("image"), (req, res) => {
  const { name, price } = req.body;
  const id = req.params.id;

  let query, values;

  if (req.file) {
    query = "UPDATE products SET name=?, price=?, image=? WHERE id=?";
    values = [name, price, req.file.filename, id];
  } else {
    query = "UPDATE products SET name=?, price=? WHERE id=?";
    values = [name, price, id];
  }

  db.query(query, values, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product updated" });
  });
});

// ================= USERS =================

// Protected route
app.get("/users", verifyToken, (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ================= SERVER =================
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
