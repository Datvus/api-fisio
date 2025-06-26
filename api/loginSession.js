import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { username, password } = req.body;

  console.log(username)
  console.log(password)

  if (process.env.USERNAME === username && process.env.PASSWORD === password) {
    return res.status(200).json({ message: "Liberado" });
  }

  return res.status(400).json({ message: "Acesso negado" });
}
