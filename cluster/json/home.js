// ====== Estado del Jugador ======
let jugador = {
  nivel: 1,
  xp: 0,
  xpMax: 100,
  trabajo: 0,
  dinero: 0,
  titulos: 0,
  amigos: 0,
  salud: 100,
  reputacion: 'Neutro',
  inventario: [],
  habilidades: [],
  logros: [],
};

// ====== Función principal para ejecutar acciones ======
function realizarAccion(tipo) {
  let mensaje = '';
  switch (tipo) {
    case 'trabajo':
      jugador.trabajo++;
      jugador.dinero += 20000;
      jugador.xp += 15;
      mensaje = '💼 ¡Fuiste al trabajo y ganaste $20.000!';
      break;
    case 'amigo':
      jugador.amigos++;
      jugador.xp += 10;
      mensaje = '🤝 ¡Hiciste un nuevo amigo!';
      break;
    case 'titulo':
      jugador.titulos++;
      jugador.xp += 30;
      mensaje = '🎓 ¡Obtuviste un nuevo título!';
      break;
    case 'ejercicio':
      jugador.salud = Math.min(jugador.salud + 10, 100);
      jugador.xp += 5;
      mensaje = '🏋️ ¡Hiciste ejercicio y mejoraste tu salud!';
      break;
  }
  mostrarToast(mensaje);
  verificarNivel();
  actualizarUI();
}

// ====== Subir de nivel y XP ======
function verificarNivel() {
  while (jugador.xp >= jugador.xpMax) {
    jugador.xp -= jugador.xpMax;
    jugador.nivel++;
    jugador.xpMax = Math.round(jugador.xpMax * 1.2);
    desbloquearHabilidad();
    desbloquearLogro(`Nivel ${jugador.nivel}`);
    mostrarToast(`🎉 ¡Subiste a nivel ${jugador.nivel}!`);
  }
}

// ====== Actualizar la UI ======
function actualizarUI() {
  document.getElementById('nivel').innerText = jugador.nivel;
  document.getElementById('experiencia').innerText = jugador.xp;
  document.getElementById('barraXP').style.width = `${(jugador.xp / jugador.xpMax) * 100}%`;
  document.getElementById('barraXP').innerText = `${Math.round((jugador.xp / jugador.xpMax) * 100)}%`;

  document.getElementById('trabajo').innerText = jugador.trabajo;
  document.getElementById('dinero').innerText = jugador.dinero;
  document.getElementById('titulos').innerText = jugador.titulos;
  document.getElementById('amigos').innerText = jugador.amigos;
  document.getElementById('salud').innerText = jugador.salud;
  document.getElementById('reputacion').innerText = jugador.reputacion;

  actualizarInventario();
  actualizarMisiones();
  actualizarHabilidades();
  actualizarLogros();
}

// ====== Cambiar avatar ======
function cambiarAvatar(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('avatar').src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

// ====== Misiones aleatorias ======
const posiblesMisiones = [
  'Trabaja 3 veces',
  'Haz 2 amigos',
  'Consigue un nuevo título',
  'Haz ejercicio 2 veces',
];

let misionesDiarias = [];

function generarMisiones() {
  misionesDiarias = [];
  while (misionesDiarias.length < 3) {
    const mision = posiblesMisiones[Math.floor(Math.random() * posiblesMisiones.length)];
    if (!misionesDiarias.includes(mision)) misionesDiarias.push(mision);
  }
}

function actualizarMisiones() {
  const lista = document.getElementById('listaMisiones');
  lista.innerHTML = '';
  misionesDiarias.forEach(m => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white';
    li.textContent = m;
    lista.appendChild(li);
  });
}

// ====== Inventario dinámico ======
function actualizarInventario() {
  const inv = document.getElementById('inventario');
  inv.innerHTML = '';
  jugador.inventario.forEach(obj => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white';
    li.textContent = `🧩 ${obj}`;
    inv.appendChild(li);
  });
}

function agregarObjeto(nombre) {
  jugador.inventario.push(nombre);
  actualizarInventario();
}

// ====== Árbol de habilidades (simple) ======
const habilidadesDisponibles = ['Gestión del tiempo', 'Resolución de problemas', 'Comunicación efectiva', 'Creatividad'];

function desbloquearHabilidad() {
  const random = habilidadesDisponibles.find(h => !jugador.habilidades.includes(h));
  if (random) {
    jugador.habilidades.push(random);
    mostrarToast(`🔓 ¡Desbloqueaste la habilidad: ${random}!`);
  }
}

function actualizarHabilidades() {
  const cont = document.getElementById('habilidades');
  cont.innerHTML = '';
  jugador.habilidades.forEach((hab, i) => {
    const div = document.createElement('div');
    div.className = 'col-6';
    div.innerHTML = `<div class="bg-secondary text-white p-2 rounded text-center">${hab}</div>`;
    cont.appendChild(div);
  });
}

// ====== Logros ======
function desbloquearLogro(nombre) {
  if (!jugador.logros.includes(nombre)) {
    jugador.logros.push(nombre);
    mostrarToast(`🏅 ¡Nuevo logro: ${nombre}!`);
    actualizarLogros();
  }
}

function actualizarLogros() {
  const lista = document.getElementById('listaLogros');
  lista.innerHTML = '';
  jugador.logros.forEach(logro => {
    const li = document.createElement('li');
    li.textContent = logro;
    lista.appendChild(li);
  });
}

// ====== Toast de Bootstrap para notificaciones ======
function mostrarToast(texto) {
  const toastContainer = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-dark border-0 show mb-2';
  toast.role = 'alert';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${texto}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

// ====== Inicialización ======
window.onload = () => {
  generarMisiones();
  actualizarUI();
};
