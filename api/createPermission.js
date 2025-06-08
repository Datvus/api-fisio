import db from "./data-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const permission = req.body;

  const requiredFields = ["name", "company", "mac", "days_license", "status_license"];
  const missingFields = requiredFields.filter(field => !permission.hasOwnProperty(field));
  if (missingFields.length > 0) {
    return res.status(400).json({ message: "Campos faltando", missingFields });
  }

  const { data, error } = await db
    .from('permissions')
    .insert([permission]);

  if (error) {
    return res.status(500).json({ message: "Erro ao salvar no banco", error });
  }

  return res.status(201).json({ message: "Permissão salva com sucesso", data });
}