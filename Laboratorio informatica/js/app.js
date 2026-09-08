import { NotebookLote } from './NotebookLote.js';
import { Coleccion } from './Coleccion.js';

document.addEventListener('DOMContentLoaded', () => {
	const coleccion = new Coleccion();
	coleccion.cargar();

	const formulario = document.querySelector('#formulario-notebook');
	const listaEquipos = document.querySelector('#lista-equipos');
	const busqueda = document.querySelector('#busqueda');
	const mensajeVacio = document.querySelector('#mensaje-vacio');
	const cantidadEquipos = document.querySelector('#cantidad-equipos');
	const almacenamientoTotal = document.querySelector('#almacenamiento-total');
	const mensajeGeneral = document.querySelector('#mensaje-general');
	const botonGuardar = document.querySelector('#boton-guardar');
	const botonCancelar = document.querySelector('#boton-cancelar');
	const tituloFormulario = document.querySelector('#titulo-formulario');
	const textoFormulario = document.querySelector('#texto-formulario');
	let idEnEdicion = null;

	const campos = ['id', 'marca', 'modelo', 'estado', 'bateriaSalud', 'procesador', 'almacenamiento'];

	function obtenerDatosFormulario() {
		return {
			id: document.querySelector('#id').value,
			marca: document.querySelector('#marca').value,
			modelo: document.querySelector('#modelo').value,
			estado: document.querySelector('#estado').value,
			bateriaSalud: document.querySelector('#bateriaSalud').value,
			procesador: document.querySelector('#procesador').value,
			almacenamiento: document.querySelector('#almacenamiento').value
		};
	}

	function limpiarErrores() {
		campos.forEach((nombre) => {
			document.querySelector(`#${nombre}`).classList.remove('invalido');
			document.querySelector(`[data-error="${nombre}"]`).textContent = '';
		});
		mensajeGeneral.textContent = '';
	}

	function mostrarError(nombre, mensaje) {
		document.querySelector(`#${nombre}`).classList.add('invalido');
		document.querySelector(`[data-error="${nombre}"]`).textContent = mensaje;
	}

	function validarDatos(datos) {
		limpiarErrores();
		let datosValidos = true;
		const camposTexto = ['id', 'marca', 'modelo', 'procesador'];
		camposTexto.forEach((nombre) => {
			if (!datos[nombre].trim()) {
				mostrarError(nombre, 'Este campo es obligatorio.');
				datosValidos = false;
			}
		});
		if (!datos.estado) {
			mostrarError('estado', 'Selecciona un estado.');
			datosValidos = false;
		}
		const bateria = Number(datos.bateriaSalud);
		if (datos.bateriaSalud === '' || !Number.isFinite(bateria) || bateria < 0 || bateria > 100) {
			mostrarError('bateriaSalud', 'Usa un valor entre 0 y 100.');
			datosValidos = false;
		}
		const almacenamiento = Number(datos.almacenamiento);
		if (datos.almacenamiento === '' || !Number.isInteger(almacenamiento) || almacenamiento <= 0) {
			mostrarError('almacenamiento', 'Debe ser un entero mayor que 0.');
			datosValidos = false;
		}
		return datosValidos;
	}

	function mostrarMensaje(mensaje, esError = false) {
		mensajeGeneral.textContent = mensaje;
		mensajeGeneral.style.color = esError ? 'var(--rojo)' : 'var(--verde)';
	}

	function actualizarResumen(equiposVisibles) {
		cantidadEquipos.textContent = equiposVisibles.length;
		almacenamientoTotal.textContent = coleccion.almacenamientoTotal();
	}

	function crearDato(etiqueta, valor) {
		const contenedor = document.createElement('div');
		contenedor.className = 'dato-tarjeta';
		const textoEtiqueta = document.createElement('span');
		textoEtiqueta.textContent = etiqueta;
		const textoValor = document.createElement('strong');
		textoValor.textContent = valor;
		contenedor.append(textoEtiqueta, textoValor);
		return contenedor;
	}

	function renderizar() {
		const equiposVisibles = coleccion.filtrar(busqueda.value);
		listaEquipos.replaceChildren();
		equiposVisibles.forEach((equipo) => {
			const tarjeta = document.createElement('article');
			tarjeta.className = 'tarjeta';

			const cabecera = document.createElement('div');
			cabecera.className = 'tarjeta-cabecera';
			const identificacion = document.createElement('div');
			const titulo = document.createElement('h3');
			titulo.textContent = `${equipo.marca} ${equipo.modelo}`;
			const identificador = document.createElement('span');
			identificador.className = 'identificador';
			identificador.textContent = `ID: ${equipo.id}`;
			identificacion.append(titulo, identificador);
			const estado = document.createElement('span');
			estado.className = `estado estado-${equipo.estado.toLowerCase().replaceAll(' ', '-')}`;
			estado.textContent = equipo.estado;
			cabecera.append(identificacion, estado);

			const datos = document.createElement('div');
			datos.className = 'datos-tarjeta';
			datos.append(
				crearDato('Procesador', equipo.procesador),
				crearDato('Bateria', `${equipo.bateriaSalud}%`),
				crearDato('Almacenamiento', `${equipo.almacenamiento} GB`),
				crearDato('Descripcion', equipo.obtenerDescripcion())
			);

			const acciones = document.createElement('div');
			acciones.className = 'acciones-tarjeta';
			const botonEditar = document.createElement('button');
			botonEditar.className = 'boton-tarjeta';
			botonEditar.type = 'button';
			botonEditar.textContent = 'Modificar';
			botonEditar.addEventListener('click', () => cargarEdicion(equipo));
			const botonEliminar = document.createElement('button');
			botonEliminar.className = 'boton-tarjeta boton-eliminar';
			botonEliminar.type = 'button';
			botonEliminar.textContent = 'Eliminar';
			botonEliminar.addEventListener('click', () => eliminarEquipo(equipo.id));
			acciones.append(botonEditar, botonEliminar);

			tarjeta.append(cabecera, datos, acciones);
			listaEquipos.append(tarjeta);
		});
		mensajeVacio.hidden = equiposVisibles.length > 0;
		if (equiposVisibles.length === 0 && busqueda.value.trim()) {
			mensajeVacio.textContent = 'No se encontraron equipos con esa busqueda.';
		} else {
			mensajeVacio.textContent = 'Todavia no hay notebooks registradas.';
		}
		actualizarResumen(equiposVisibles);
	}

	function cargarEdicion(equipo) {
		idEnEdicion = equipo.id;
		campos.forEach((nombre) => {
			document.querySelector(`#${nombre}`).value = equipo[nombre];
		});
		tituloFormulario.textContent = 'Modificar notebook';
		textoFormulario.textContent = 'Actualiza los datos del equipo seleccionado.';
		botonGuardar.textContent = 'Guardar cambios';
		botonCancelar.classList.remove('oculto');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function cancelarEdicion() {
		idEnEdicion = null;
		formulario.reset();
		limpiarErrores();
		tituloFormulario.textContent = 'Agregar notebook';
		textoFormulario.textContent = 'Completa los datos del equipo.';
		botonGuardar.textContent = 'Guardar notebook';
		botonCancelar.classList.add('oculto');
	}

	function eliminarEquipo(id) {
		if (!window.confirm(`¿Eliminar el equipo ${id}?`)) return;
		coleccion.eliminar(id);
		renderizar();
		mostrarMensaje('El equipo fue eliminado correctamente.');
	}

	formulario.addEventListener('submit', (event) => {
		event.preventDefault();
		const datos = obtenerDatosFormulario();
		if (!validarDatos(datos)) {
			mostrarMensaje('Revisa los campos marcados.', true);
			return;
		}
		try {
			if (idEnEdicion) {
				coleccion.actualizar(idEnEdicion, datos);
				mostrarMensaje('La notebook fue modificada correctamente.');
			} else {
				coleccion.agregar(new NotebookLote(
					datos.id,
					datos.marca,
					datos.modelo,
					datos.estado,
					datos.bateriaSalud,
					datos.procesador,
					datos.almacenamiento
				));
				mostrarMensaje('La notebook fue agregada correctamente.');
			}
			cancelarEdicion();
			renderizar();
		} catch (error) {
			mostrarMensaje(error.message, true);
		}
	});

	botonCancelar.addEventListener('click', cancelarEdicion);
	busqueda.addEventListener('input', renderizar);
	renderizar();
});
