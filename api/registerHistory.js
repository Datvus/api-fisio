import db from "./data-source.js";

export default async function registerHistory(id_license, action) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

    console.log(id_license)

  const { data, error } = await db.from("history").insert({
    cod_dia: `${yyyy}-${mm}-${dd}`,
    ind_action: action,
    id_license,
  })
  .select("*")

  if (error) {
    return error;
  }

  return true;
}
