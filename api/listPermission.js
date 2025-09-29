import db from "./data-source.js";
import registerHistory from "./registerHistory.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { mac, id_file } = req.body;

  if (!mac) {
    return res
      .status(400)
      .json({ error: "Parâmetro 'id_guest' é obrigatório." });
  }

  try {
    const { data, error } = await db
      .from("fisio_permission")
      .select("*")
      .eq("mac", mac);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    if (data.length === 0) {
      const { dataNew, error } = await db
        .from("permissions")
        .insert([
          {
            name: "",
            company: "",
            mac: mac,
            days_license: 0,
            status_license: false,
            ind_new: true,
            id_file: id_file,
            created_at: `${yyyy}-${mm}-${dd}`,
          },
        ])
        .select("*");

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await registerHistory(dataNew.id, "Criação da licença");

      return res.status(200).json(dataNew[0]);
    }

    await registerHistory(data[0].id, "Acesso pelo usuário");

    return res.status(200).json(data[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: err.message });
  }
}
