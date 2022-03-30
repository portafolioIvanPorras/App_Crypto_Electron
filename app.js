const formulario = document.querySelector('#formulario');
const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');

const busqueda = {
  moneda: '',
  criptomoneda: '',
};

//Promise
const obtenerCriptos = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener('DOMContentLoaded', () => {
  consultarCryptos();

  formulario.addEventListener('submit', submitFormulario);
  criptoSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);
});

//**Función que consulta las 10 criptomonedas más utilizadas */

function consultarCryptos() {
  const url =
    'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD';

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptos(resultado.Data))
    .then((criptomonedas) => selectCriptos(criptomonedas));
}

function selectCriptos(criptomonedas) {
  criptomonedas.forEach((criptos) => {
    const { FullName, Name } = criptos.CoinInfo;
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptoSelect.appendChild(option);
  });
}

function leerValor(e) {
  busqueda[e.target.name] = e.target.value;
  console.log(busqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = busqueda;
  if (moneda === '' || criptomoneda === '') {
    mostrarAlerta('Todos los campos son obligatorios*');
    return;
  }
  /**Consultar API */

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const existeError = document.querySelector('.error');
  if (!existeError) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = busqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHAGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `Precio Actual: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `Precio Más Alto: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `Precio Más Bajo: <span>${LOWDAY}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');

  spinner.innerHTML = `

  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>

  `;
  resultado.appendChild(spinner);
}
