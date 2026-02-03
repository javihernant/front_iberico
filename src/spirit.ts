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

  interface Respuesta {
    orig: string;
    con: number;
    fa: number;
    im: number;
    ac: number;
    com: number;
    tot: number;
  }
  
  interface RespuestasEquipos {
    equipos: Respuesta[];
    sotg: number;
  }
  
const API_URL = import.meta.env.VITE_API_URL

export async function setupResultados(container: HTMLDivElement) {
  const equipos: string[] = await fetch(`${API_URL}/api/equipos`).then(res => res.json())
  const resultados: Ranking = await fetch(`${API_URL}/api/resultados`)
  .then(res => res.json())
  c_ranking(container, resultados)

  const recibidos: Recibidos = await fetch(`${API_URL}/api/recibidos`)
  .then(res => res.json())
  c_recibidos(container,recibidos, equipos);

  const dado: Dado = await fetch(`${API_URL}/api/dados`)
  .then(res => res.json())
  c_dado(container,dado, equipos);

  c_res_equipos(container, equipos)
  
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

function c_res_equipos(container: HTMLDivElement, equipos: string[]) {

  const heading = document.createElement("h2");
  heading.textContent = "Respuestas recibidas de cada equipo";
  container.appendChild(heading);
  heading.style.marginBottom = "16px";


  const select = document.createElement("select");
  select.innerHTML = '<option value="">Selecciona equipo</option>';
  equipos.forEach(e => {
    const option = document.createElement("option");
    option.value = e;
    option.textContent = e;
    select.appendChild(option);
  })
  select.style.marginBottom = "16px";


  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";
  table.style.marginBottom = "16px";
  const header_row = ["Equipo","REG", "FAL", "IMP", "ACT", "COM", "SUM"];
  add_row(table, header_row)

  container.appendChild(select)
  select.addEventListener("change", () => {
    if (!select.value) return;
  
    fetch(`${API_URL}/api/respuestas/${encodeURIComponent(select.value)}`)
      .then(res => res.json() as Promise<RespuestasEquipos>)
      .then(data => {
        data.equipos.forEach(equipo => {
          add_row(table, [equipo.orig, equipo.con.toString(), equipo.fa.toString(), equipo.im.toString(), equipo.ac.toString(), equipo.com.toString(), equipo.tot.toString()])
        })
        const puntuacion = document.createElement("div");
        puntuacion.textContent = `SOTFG: ${data.sotg}`
        puntuacion.style.fontWeight = "bold";
        puntuacion.style.marginBottom = "16px";
        container.appendChild(puntuacion)
        container.appendChild(table);
      })
  });
}

function c_recibidos(container: HTMLDivElement, data: Recibidos, equipos:string[]) {
  const heading = document.createElement("h2");
  heading.textContent = "SPIRIT Recibido";
  container.appendChild(heading);

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.border = "1px solid #999";
  table.style.marginBottom = "16px";

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
  table.style.marginBottom = "16px";

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
