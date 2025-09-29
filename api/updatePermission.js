import db from "./data-source.js";
import registerHistory from "./registerHistory.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id, ind_motivo, ...fieldsToUpdate } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID da permissão é obrigatório" });
  }

  if ("id" in fieldsToUpdate) {
    delete fieldsToUpdate.id;
  }

  const { data, error } = await db
    .from("permissions")
    .update(fieldsToUpdate)
    .eq("id", id);

  if (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a permissão", error });
  }

  await registerHistory(id, ind_motivo);

  return res
    .status(200)
    .json({ message: "Permissão atualizada com sucesso", data });
}
