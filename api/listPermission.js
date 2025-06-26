import db from "./data-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

 if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { mac, id_file } = req.body

  if (!mac) {
    return res
      .status(400)
      .json({ error: "Parâmetro 'id_guest' é obrigatório." });
  }

try {
    const { data, error } = await db
      .from("permissions")
      .select("*")
      .eq("mac", mac)

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if(data.length === 0) {
      const {data, error} = await db
      .from('permissions')
      .insert([{
        name: "",
        company: "",
        mac: mac,
        days_license: 0,
        status_license: false,
        ind_new: true,
        id_file: id_file
      }])

      if (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(200).json(data[0]);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: err.message });
  }
}
