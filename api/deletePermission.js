import db from "./data-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Campo 'id' é obrigatório" });
  }

  const { data, error } = await db.from("permissions").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ message: "Erro ao deletar no banco", error });
  }

  return res
    .status(200)
    .json({ message: "Permissão deletada com sucesso", data });
}
