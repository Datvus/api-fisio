import db from "./data-source.js";
import registerHistory from "./registerHistory.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { mac, id_file } = req.body;

    if (!mac) {
      return res
        .status(400)
        .json({ error: "Parâmetro 'mac' é obrigatório." });
    }

    const { data, error: queryError } = await db
      .from("fisio_permission")
      .select("*")
      .eq("mac", mac);

    if (queryError) {
      return res.status(500).json({ error: queryError.message });
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    if (!data || data.length === 0) {
      const { data: dataNew, error: insertError } = await db
        .from("permissions")
        .insert([
          {
            name: "",
            company: "",
            mac,
            days_license: 0,
            status_license: false,
            ind_new: true,
            id_file,
            created_at: `${yyyy}-${mm}-${dd}`,
          },
        ])
        .select("*");

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      if (!dataNew || dataNew.length === 0) {
        return res
          .status(500)
          .json({ error: "Falha ao criar a licença." });
      }

      const license = dataNew[0];

      await registerHistory(license.id, "Criação da licença");

      return res.status(200).json(license);
    }

    const license = data[0];

    await registerHistory(license.id, "Acesso pelo usuário");

    return res.status(200).json(license);
  } catch (err) {
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: err.message,
    });
  }
}
