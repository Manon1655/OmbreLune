const request = require("supertest");
const app = require("../server"); 
 
/* ===============================
   MOCKS
================================= */
 
jest.mock("mysql2/promise", () => ({
  createPool: () => ({ query: jest.fn() })
}));
 
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn()
}));
 
const bcrypt = require("bcrypt");
const db = require("mysql2/promise").createPool();
 
/* ===============================
   REGISTER
================================= */
 
describe("POST /auth/register", () => {
 
  test("✅ Inscription réussie — retourne un token", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 42 }]);
 
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "alice@test.com",
        password: "motdepasse",
        firstName: "Alice",
        lastName: "Dupont",
        username: "alice"
      });
 
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
 
  test("❌ Erreur BDD — retourne 500", async () => {
    db.query.mockRejectedValueOnce(new Error("DB error"));
 
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "alice@test.com",
        password: "motdepasse",
        firstName: "Alice",
        lastName: "Dupont",
        username: "alice"
      });
 
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
 
});
 
/* ===============================
   LOGIN
================================= */
 
describe("POST /auth/login", () => {
 
  const fakeUser = {
    id: 1,
    email: "alice@test.com",
    password: "hashed_password",
    role: "USER"
  };
 
  test("✅ Login réussi — retourne un token et le rôle", async () => {
    db.query.mockResolvedValueOnce([[fakeUser]]);
    bcrypt.compare.mockResolvedValueOnce(true);
 
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "alice@test.com", password: "motdepasse" });
 
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.role).toBe("USER");
  });
 
  test("❌ Utilisateur introuvable — retourne 401", async () => {
    db.query.mockResolvedValueOnce([[]]); // aucun résultat
 
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "inconnu@test.com", password: "motdepasse" });
 
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Utilisateur non trouvé");
  });
 
  test("❌ Mauvais mot de passe — retourne 401", async () => {
    db.query.mockResolvedValueOnce([[fakeUser]]);
    bcrypt.compare.mockResolvedValueOnce(false);
 
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "alice@test.com", password: "mauvais" });
 
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Mot de passe incorrect");
  });
 
  test("❌ Erreur BDD — retourne 500", async () => {
    db.query.mockRejectedValueOnce(new Error("DB error"));
 
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "alice@test.com", password: "motdepasse" });
 
    expect(res.statusCode).toBe(500);
  });
 
});