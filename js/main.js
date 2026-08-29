const urlBase = 'https://apisimpsons.fly.dev/api/personajes';
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view');
  views.forEach(v => v.style.display = 'none');
  document.getElementById('home').style.display = 'block';

  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      let section = this.getAttribute('data-view');
      
      views.forEach(v => v.style.display = 'none');
      document.getElementById(section).style.display = 'block';

      if(section === 'characters') {
        getPersonajes();
      }

      if(section === 'episodes') {
        getEpisodios();
      }
    });
  });

  document.getElementById('character-search-button').addEventListener('click', () => {
    paginaActual = 1;
    getPersonajes();
  });

  document.getElementById('detail-modal-close').addEventListener('click', () => {
    document.getElementById('detail-modal').style.display = 'none';
  });

  document.getElementById('random-character-button').addEventListener('click', randomChar);
});

async function getPersonajes() {

    const loadingMessage = document.getElementById('loading-message');
  loadingMessage.hidden = false;

  let search = document.getElementById('character-search-name').value;
  let url = search ? `${urlBase}/find/${search}` : `${urlBase}?limit=20&page=${paginaActual}`;

  try {
    let res = await fetch(url);
    let data = await res.json();
    console.log("datos de la api:", data);

    let list = data.docs ? data.docs : data.result;
    
    if(!list || list.length === 0) {
      pintarSinResultados();
      return;
    }

    pintarCartas(list);

    if(data.docs) {
      hacerPaginacion(data.page, data.totalPages);
    } else {
      document.getElementById('pagination').innerHTML = '';
    }

  } catch (err) {
    console.log("error cargando api", err);
  } finally {
    loadingMessage.hidden = true;
  }    
}
const pintarSinResultados = () => {
  const container = document.querySelector('.characters');

  container.innerHTML = `
    <div class="no_results">
      <h2>No se encontraron personajes con ese nombre</h2>
      <p>Intenta con otro nombre.</p>
    </div>
  `;

  document.getElementById('pagination').innerHTML = '';
};
const pintarCartas = (personajes) => {
  const container = document.querySelector('.characters');
  container.innerHTML = '';

  personajes.forEach(p => {


    if (p.Nombre === 'Steve Friedman') {
  p.Imagen = './js/img/steve-friedman.png';
}


    let card = document.createElement('div');
    card.classList.add('card-personaje'); 

    card.style.border = '1px solid #ccc';
    card.style.borderRadius = '10px';
    card.style.padding = '15px';
    card.style.textAlign = 'center';
    card.style.cursor = 'pointer';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';

    card.innerHTML = `
      <img src="${p.Imagen}" alt="${p.Nombre}" class="img-char" style="width:100%; height:200px; object-fit:contain; margin-bottom:15px;">
      <h3>${p.Nombre}</h3>
      <p><b>Estado:</b> ${p.Estado}</p>
      <p><b>Ocupación:</b> ${p.Ocupacion}</p>
    `;

    card.onmouseover = function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    }

    card.onmouseout = function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }

    card.addEventListener('click', () => {
      document.getElementById('detail-modal-content').innerHTML = `
        <h2>${p.Nombre}</h2>

         <img src="${p.Imagen}" width="200"> 

        <p><b>Género:</b> ${p.Genero}</p>
        <br>
        <p>${p.Historia}</p>
      `;
      document.getElementById('detail-modal').style.display = 'block';
    });

    container.appendChild(card);
  });
}

function hacerPaginacion(pag, total) {
  let div = document.getElementById('pagination');
  div.innerHTML = '';

  let btnPrev = document.createElement('button');
  btnPrev.innerText = 'Atras';
  if(pag === 1) btnPrev.disabled = true;
  btnPrev.onclick = () => {
    paginaActual--;
    getPersonajes();
  }

  let text = document.createElement('span');
  text.innerText = ` ${pag} de ${total} `;

  let btnNext = document.createElement('button');
  btnNext.innerText = 'Siguiente';
  if(pag === total) btnNext.disabled = true;
  btnNext.onclick = () => {
    paginaActual++;
    getPersonajes();
  }

  div.append(btnPrev, text, btnNext);
}

async function randomChar() {
  let btn = document.getElementById('random-character-button');
  btn.innerText = 'cargando...';
  
  try {
    let num = Math.floor(Math.random() * 30) + 1;
    let res = await fetch(`${urlBase}?limit=20&page=${num}`);
    let data = await res.json();
    
    let random = data.docs[Math.floor(Math.random() * data.docs.length)];

    document.getElementById('random-character').innerHTML = `
      <div class="random-card">
        <h3>${random.Nombre}</h3>
        <img src="${random.Imagen}" width="150">
        <p>${random.Ocupacion}</p>
      </div>
    `;
  } catch(e) {
    console.log(e);
  }
  
  btn.innerText = 'Descubrir personaje aleatorio';
}

async function getEpisodios() {
  const container = document.querySelector('.episodes');
  container.innerHTML = '<p>Cargando episodios...</p>';

  try {
    
    let res = await fetch('https://apisimpsons.fly.dev/api/episodios?limit=20');
    let data = await res.json();

    let episodios = data.docs || data;
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    container.style.gap = '15px';
    container.style.padding = '15px';

    episodios.forEach(ep => {
      let card = document.createElement('div');
  
      card.style.border = '1px solid #ccc';
      card.style.borderRadius = '10px';
      card.style.padding = '15px';
      card.style.textAlign = 'center';
      card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

      card.innerHTML = `
        <img src="${ep.Imagen || 'https://via.placeholder.com/200'}" alt="${ep.Nombre}" style="width:100%; height:140px; object-fit:cover; border-radius:5px; margin-bottom:10px;">
        <h3 style="font-size:16px;">${ep.Nombre}</h3>
        <p><b>Temporada:</b> ${ep.Temporada || 'N/A'}</p>
        <p><b>Episodio:</b> ${ep.Episodio || 'N/A'}</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.log("Error al cargar episodios:", err);
    container.innerHTML = '<p>Error al cargar episodios.</p>';
  }
}