const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const app    = express();
const PORT   = process.env.PORT   || 8080;
const SECRET = process.env.JWT_SECRET || "SECRET_KEY_PROJET_ECOLE";

/* ═══════════════════════════════════════
   MIDDLEWARE
═══════════════════════════════════════ */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
/* ===============================
   MYSQL CONNECTION
================================= */
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "projet_ecole_final"
});
/* ═══════════════════════════════════════
   HEALTH CHECK
═══════════════════════════════════════ */
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected", error: err.message });
  }
});

/* ═══════════════════════════════════════
   REGISTER
   Table: users (email, password, first_name, last_name, username, role)
═══════════════════════════════════════ */
app.post("/auth/register", async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Email, mot de passe et nom d'utilisateur sont requis" });
  }

  try {
    const [existingEmail] = await db.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    const [existingUsername] = await db.query(
      "SELECT id FROM users WHERE username = ?", [username]
    );
    if (existingUsername.length > 0) {
      return res.status(409).json({ error: "Ce nom d'utilisateur est déjà pris" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, username, role, created_at)
       VALUES (?, ?, ?, ?, ?, 'USER', NOW())`,
      [email, hashedPassword, firstName || "", lastName || "", username]
    );

    const token = jwt.sign(
      { id: result.insertId, email, role: "USER" },
      SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   LOGIN
   Table: users — login par email (champ username du formulaire = email)
═══════════════════════════════════════ */
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body; // "username" = email envoyé par le frontend

  if (!username || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?", [username]
    );
    if (results.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const user  = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "USER" },
      SECRET,
      { expiresIn: "2h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   PROFIL UTILISATEUR — GET
   Table: users + jointure subscriptions via users.subscription_id
═══════════════════════════════════════ */
app.get("/auth/user/:id", async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name,
              u.bio, u.phone_number, u.profile_picture, u.role,
              u.subscription_id, u.created_at,
              s.name AS subscription_name, s.price AS subscription_price,
              s.description AS subscription_description
       FROM users u
       LEFT JOIN subscriptions s ON u.subscription_id = s.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json(results[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   PROFIL UTILISATEUR — UPDATE
   Table: users
═══════════════════════════════════════ */
app.put("/auth/user/:id", async (req, res) => {
  const { first_name, last_name, username, phone_number, bio } = req.body;
  try {
    await db.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, username = ?, phone_number = ?, bio = ?, updated_at = NOW()
       WHERE id = ?`,
      [first_name, last_name, username, phone_number, bio, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   BIO — UPDATE
═══════════════════════════════════════ */
app.put("/auth/user/:id/bio", async (req, res) => {
  try {
    await db.query(
      "UPDATE users SET bio = ?, updated_at = NOW() WHERE id = ?",
      [req.body.bio, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   ABONNEMENT — GET
   La table subscriptions est un catalogue de plans.
   L'abonnement actif de l'user est dans users.subscription_id
═══════════════════════════════════════ */
app.get("/auth/user/:id/subscription", async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT s.*
       FROM users u
       JOIN subscriptions s ON u.subscription_id = s.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    res.json(results.length > 0 ? results[0] : null);
  } catch (error) {
    res.json(null);
  }
});

/* ═══════════════════════════════════════
   ABONNEMENT — UPDATE (souscrire / résilier)
   Met à jour users.subscription_id
═══════════════════════════════════════ */
app.put("/auth/user/:id/subscription", async (req, res) => {
  // subscription_id = ID numérique du plan dans la table subscriptions
  const { subscription_id } = req.body;
  try {
    await db.query(
      "UPDATE users SET subscription_id = ?, updated_at = NOW() WHERE id = ?",
      [subscription_id || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   LISTE DES PLANS D'ABONNEMENT
   (catalogue complet de la table subscriptions)
═══════════════════════════════════════ */
app.get("/subscriptions", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM subscriptions ORDER BY price ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   LIVRES — GET ALL
   Table: books (id, title, author, genre, price, rating, cover_image,
                  isbn, resume, content, publication_date)
═══════════════════════════════════════ */
app.get("/books", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, author, genre, price, rating, cover_image, isbn, resume, publication_date FROM books"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   LIVRES — GET ONE
═══════════════════════════════════════ */
app.get("/books/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Livre non trouvé" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   LIVRES — ADD (ADMIN)
   Table: books — utilise "genre" (pas "category")
═══════════════════════════════════════ */
app.post("/api/books", async (req, res) => {
  const { title, author, description, genre, price, rating, coverImage, isbn, resume } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Titre et auteur requis" });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO books (title, author, genre, price, rating, cover_image, isbn, resume, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, genre || "", price || 0, rating || 0, coverImage || null, isbn || "", resume || description || "", ""]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   USER BOOKS (livres en cours de lecture)
   Table: user_books (user_id, book_id, progress)
═══════════════════════════════════════ */
app.get("/auth/user/:id/books", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.id, b.title, b.author, b.cover_image, b.genre, b.price, ub.progress
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   FAVORIS — GET
   Table: user_favorites (user_id, book_id) — PK composite
═══════════════════════════════════════ */
app.get("/auth/user/:id/favorites", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.id, b.title, b.author, b.cover_image, b.genre, b.price, b.rating
       FROM user_favorites uf
       JOIN books b ON uf.book_id = b.id
       WHERE uf.user_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   FAVORIS — ADD
═══════════════════════════════════════ */
app.post("/auth/user/:id/favorites", async (req, res) => {
  try {
    await db.query(
      "INSERT IGNORE INTO user_favorites (user_id, book_id) VALUES (?, ?)",
      [req.params.id, req.body.bookId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   FAVORIS — DELETE
═══════════════════════════════════════ */
app.delete("/auth/user/:id/favorites/:bookId", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM user_favorites WHERE user_id = ? AND book_id = ?",
      [req.params.id, req.params.bookId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   COMMANDES — GET
   Table: orders (id, user_id, total, created_at)
═══════════════════════════════════════ */
app.get("/auth/user/:id/orders", async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   COMMANDES — CREATE
═══════════════════════════════════════ */
app.post("/orders", async (req, res) => {
  const { userId, total } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, NOW())",
      [userId, total]
    );
    res.json({ success: true, orderId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   COMMENTAIRES — GET (par livre)
   Table: comments (id, book_id, user_id, content, rating, created_at, updated_at)
═══════════════════════════════════════ */
app.get("/books/:id/comments", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.content, c.rating, c.created_at,
              u.username, u.first_name, u.last_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.book_id = ?
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   COMMENTAIRES — ADD
═══════════════════════════════════════ */
app.post("/books/:id/comments", async (req, res) => {
  const { userId, content, rating } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: "userId et content requis" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO comments (book_id, user_id, content, rating, created_at) VALUES (?, ?, ?, ?, NOW())",
      [req.params.id, userId, content, rating || 0]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   UPLOAD PHOTO DE PROFIL
═══════════════════════════════════════ */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont acceptées"));
  },
});

app.post("/auth/user/:id/photo", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  try {
    const photoPath = `/uploads/${req.file.filename}`;
    await db.query(
      "UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE id = ?",
      [photoPath, req.params.id]
    );
    res.json({ photo: photoPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ═══════════════════════════════════════
   DÉMARRAGE
═══════════════════════════════════════ */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`🗄️  Base : ${process.env.DB_NAME || "projet_ecole_final"} @ ${process.env.DB_HOST || "localhost"}`);
  });
}

module.exports = app;
