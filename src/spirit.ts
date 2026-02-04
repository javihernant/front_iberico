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
    comment: string;
  }
  
  interface RespuestasEquipos {
    equipos: Respuesta[];
    sotg: number;
  }
  
const API_URL = import.meta.env.VITE_API_URL

export async function setupResultados(container: HTMLDivElement) {
  const equipos: string[] = await fetch(`${API_URL}/api/equipos`).then(res => res.json())

  c_res_equipos(container, equipos)

  const resultados: Ranking = await fetch(`${API_URL}/api/resultados`)
  .then(res => res.json())
  c_ranking(container, resultados)

  const recibidos: Recibidos = await fetch(`${API_URL}/api/recibidos`)
  .then(res => res.json())
  c_recibidos(container,recibidos, equipos);

  const dado: Dado = await fetch(`${API_URL}/api/dados`)
  .then(res => res.json())
  c_dado(container,dado, equipos);  
  
}

function c_res_equipos(container: HTMLDivElement, equipos: string[]) {

  const heading = document.createElement("h2");
  heading.textContent = "Puntuacion de equipos";

  const select = document.createElement("select");
  select.innerHTML = '<option value="">Selecciona equipo</option>';
  equipos.forEach(e => {
    const option = new Option(e,e)
    select.add(option)
  })

  const hint = document.createElement("p");
  hint.className = "helper-text hidden";
  hint.innerHTML = `<span>ℹ️</span> Selecciona una fila de la tabla para ver los comentarios del equipo.`;

  const sotgContainer = document.createElement("div");
  sotgContainer.className = "sotg-container";

  const sotgDisplay = document.createElement("div");
  sotgDisplay.className = "puntuacion-sotg hidden"

  const table = document.createElement("table");
  table.className = "results-table hidden"

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  
  // Static headers stay forever
  thead.innerHTML = `<tr>${["Equipo","REG", "FAL", "IMP", "ACT", "COM"].map(h => `<th>${h}</th>`).join('')}</tr>`;
  table.append(thead, tbody);
  sotgContainer.append(heading, select, sotgDisplay, hint, table)
  container.append(sotgContainer)

  select.addEventListener("change", () => {
    if (!select.value) {
      sotgDisplay.classList.add("hidden")
      table.classList.add("hidden")
      hint.classList.add("hidden")
      return;
    }
  
    fetch(`${API_URL}/api/respuestas/${encodeURIComponent(select.value)}`)
      .then(res => res.json() as Promise<RespuestasEquipos>)
      .then(data => {
        tbody.innerHTML = "";
        sotgDisplay.textContent = `SOTG: ${data.sotg}`;
        data.equipos.forEach((equipo)=> {
          const row = tbody.insertRow()
          row.innerHTML = `
          <td>▾ ${equipo.orig}</td>
          <td>${equipo.con}</td>
          <td>${equipo.fa}</td>
          <td>${equipo.im}</td>
          <td>${equipo.ac}</td>
          <td>${equipo.com}</td>
        `;
          const commentRow = tbody.insertRow()
          commentRow.className = "comment-row hidden";
          commentRow.innerHTML = `
            <td colspan="6">
              <div class="comment-content">
                <strong>Comentario:</strong> ${equipo.comment || "Sin comentarios."}
              </div>
            </td>
          `;
          row.addEventListener("click", () => {
            commentRow.classList.toggle("hidden");
          });
        })
        sotgDisplay.classList.remove("hidden");
        hint.classList.remove("hidden");
        table.classList.remove("hidden");
      })
  });
}

function c_recibidos(container: HTMLDivElement, data: Recibidos, equipos:string[]) {
  const dataContainer = document.createElement("div");
  dataContainer.className = "data-container"
  
  const heading = document.createElement("h2");
  heading.textContent = "SPIRIT Recibido";
  dataContainer.appendChild(heading);

  const table = document.createElement("table");
  table.className = "results-table"

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  
  // Static headers stay forever
  thead.innerHTML = `<tr>${["Equipo","REG", "FAL", "IMP", "ACT", "COM", "GLB"].map(h => `<th>${h}</th>`).join('')}</tr>`;
  table.append(thead, tbody);

  dataContainer.appendChild(table)

  data.table.forEach((pts,i)=>{
    const row = tbody.insertRow()
    row.innerHTML = `
    <td>${equipos[i]}</td>
    <td>${pts[0]}</td>
    <td>${pts[1]}</td>
    <td>${pts[2]}</td>
    <td>${pts[3]}</td>
    <td>${pts[4]}</td>
    <td>${pts[5]}</td>
  `;
  })
  const glb_info = document.createElement("div");
  glb_info.textContent = `GLB medio: ${data.glb}`
  dataContainer.appendChild(glb_info)

  container.appendChild(dataContainer);
}

function c_dado(container: HTMLDivElement, data: Dado, equipos:string[]) {
  const dataContainer = document.createElement("div");
  dataContainer.className = "data-container"
  
  const heading = document.createElement("h2");
  heading.textContent = "SPIRIT Dado";
  dataContainer.appendChild(heading);

  const table = document.createElement("table");
  table.className = "results-table"

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  
  // Static headers stay forever
  thead.innerHTML = `<tr>${["Equipo","REG", "FAL", "IMP", "ACT", "COM", "GLB"].map(h => `<th>${h}</th>`).join('')}</tr>`;
  table.append(thead, tbody);

  dataContainer.appendChild(table)

  data.table.forEach((pts,i)=>{
    const row = tbody.insertRow()
    row.innerHTML = `
    <td>${equipos[i]}</td>
    <td>${pts[0]}</td>
    <td>${pts[1]}</td>
    <td>${pts[2]}</td>
    <td>${pts[3]}</td>
    <td>${pts[4]}</td>
    <td>${pts[5]}</td>
  `;
  })
  const glb_info = document.createElement("div");
  glb_info.textContent = `GLB medio: ${data.glb}`
  dataContainer.appendChild(glb_info)

  container.appendChild(dataContainer);
}

function c_ranking(container: HTMLDivElement, data: Ranking) {
  const dataContainer = document.createElement("div");
  dataContainer.className = "data-container"
  const heading = document.createElement("h2");
  heading.textContent = "Ranking";
  dataContainer.appendChild(heading);

  const table = document.createElement("table");
  table.className = "ranking-table"

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  thead.innerHTML = `<tr>${["Equipo","Puntuación", "Posicion"].map(h => `<th>${h}</th>`).join('')}</tr>`;
  table.append(thead, tbody);
  
  data.forEach((el)=>{
    const row = tbody.insertRow()
    row.innerHTML = `
    <td>${el.equipo}</td>
    <td>${el.puntuacion}</td>
    <td>${el.ranking}</td>
  `;
  })
  dataContainer.appendChild(table);
  container.appendChild(dataContainer)
}
