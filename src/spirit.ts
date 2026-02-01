interface RecibidosDados {
  table: string[][],
  glb: {puntualidad:string,comentarios:string}
}

interface Faltan {
  recibidos:string, total:string, num_faltan:string, porc_faltan:string,
}

interface Recibidos {
  table:string[][], glb:String
}

interface Dado {
  table:string[][], glb:String
}

type Ranking = [{equipo: string,
  puntuacion: number,
  ranking: string}]
const API_URL = import.meta.env.VITE_API_URL

export async function setupResultados(container: HTMLDivElement) {
  const resultados: Ranking = await fetch(`${API_URL}/api/resultados`)
  .then(res => res.json())
  c_ranking(container, resultados)
  
  const faltan: Faltan = await fetch(`${API_URL}/api/respuestas_faltan`)
  .then(res => res.json())
  c_faltan(container,faltan);

  const recibidos_dados: RecibidosDados = await fetch(`${API_URL}/api/recibidos_dados`)
  .then(res => res.json())
  c_recibidos_dados(container,recibidos_dados);

  const equipos: string[] = await fetch(`${API_URL}/api/equipos`).then(res => res.json())
  const recibidos: Recibidos = await fetch(`${API_URL}/api/recibidos`)
  .then(res => res.json())
  c_recibidos(container,recibidos, equipos);

  const dado: Dado = await fetch(`${API_URL}/api/dados`)
  .then(res => res.json())
  c_dado(container,dado, equipos);
  
}

function add_row(table:HTMLTableElement, elements: string[]) {
  const tr = document.createElement("tr");

  elements.forEach(el=>{
    const td = document.createElement("td");
    td.textContent = el;
    td.style.border = "1px solid #999";
    td.style.padding = "6px 10px";
    tr.appendChild(td);
  })
  table.appendChild(tr);
}

function c_faltan(container: HTMLDivElement, data: Faltan) {
  const heading = document.createElement("h2");
  heading.textContent = "Respuestas que faltan";
  container.appendChild(heading);

  const respuestas = document.createElement("div");
  respuestas.textContent = `Tenemos ${data.recibidos} / ${data.total} respuestas`
  container.appendChild(respuestas);

  const porcentaje = document.createElement("div");
  porcentaje.textContent = `Falta un ${data.porc_faltan} (${data.num_faltan} respuestas)`
  container.appendChild(porcentaje);
}

function c_recibidos_dados(container: HTMLDivElement, data: RecibidosDados) {
  const heading = document.createElement("h2");
  heading.textContent = "Respuestas Recibidas/Dadas por equipos";
  container.appendChild(heading);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";

  const header_row = ["Equipo","Recibidas", "Dadas", "Jugados", "Puntualidad", "Comentarios"]
  add_row(table, header_row)
  
  data.table.forEach((row)=>{
    add_row(table, row)
  })
  container.appendChild(table);

  const glb_info = document.createElement("div");
  glb_info.textContent = `Puntualidad: ${data.glb.puntualidad}\nComentarios:${data.glb.comentarios}`
  container.appendChild(glb_info)
}

function c_recibidos(container: HTMLDivElement, data: Recibidos, equipos:string[]) {
  const heading = document.createElement("h2");
  heading.textContent = "SPIRIT Recibido";
  container.appendChild(heading);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";
  const header_row = ["Equipo","REG", "FAL", "IMP", "ACT", "COM", "GLB"];
  add_row(table, header_row)
  data.table.forEach((row,i)=>{
    add_row(table, [equipos[i],...row])
  })
  container.appendChild(table);

  const glb_info = document.createElement("div");
  glb_info.textContent = `GLB medio: ${data.glb}`
  container.appendChild(glb_info)
}

function c_dado(container: HTMLDivElement, data: Dado, equipos:string[]) {
  const heading = document.createElement("h2");
  heading.textContent = "SPIRIT Dado";
  container.appendChild(heading);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";
  const header_row = ["Equipo","REG", "FAL", "IMP", "ACT", "COM", "GLB"];
  add_row(table, header_row)
  data.table.forEach((row,i)=>{
    add_row(table, [equipos[i],...row])
  })
  container.appendChild(table);

  const glb_info = document.createElement("div");
  glb_info.textContent = `GLB medio: ${data.glb}`
  container.appendChild(glb_info)
}

function c_ranking(container: HTMLDivElement, data: Ranking) {
  const heading = document.createElement("h2");
  heading.textContent = "Ranking";
  container.appendChild(heading);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";
  
  data.forEach((el)=>{
    add_row(table, [el.equipo,String(el.puntuacion), el.ranking])
  })
  container.appendChild(table);
}
