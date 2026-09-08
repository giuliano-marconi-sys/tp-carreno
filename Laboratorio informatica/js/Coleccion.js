import { NotebookLote } from './NotebookLote.js';

export class Coleccion {
	#equipos;
	#claveStorage;

	constructor(claveStorage = 'notebooksLaboratorio') {
		this.#equipos = [];
		this.#claveStorage = claveStorage;
	}

	get equipos() {
		return [...this.#equipos];
	}

	agregar(equipo) {
		if (!(equipo instanceof NotebookLote)) {
			throw new Error('Solo se pueden agregar objetos NotebookLote.');
		}
		if (this.find(equipo.id)) {
			throw new Error('Ya existe un equipo con ese ID.');
		}
		this.#equipos.push(equipo);
		this.guardar();
	}

	find(id) {
		return this.#equipos.find((equipo) => equipo.id === id);
	}

	filtrar(texto = '') {
		const busqueda = texto.trim().toLowerCase();
		return this.#equipos.filter((equipo) => {
			const datos = `${equipo.id} ${equipo.marca} ${equipo.modelo} ${equipo.procesador}`.toLowerCase();
			return datos.includes(busqueda);
		});
	}

	actualizar(idOriginal, datos) {
		const equipo = this.find(idOriginal);
		if (!equipo) {
			throw new Error('No se encontro el equipo que se quiere modificar.');
		}
		if (datos.id !== idOriginal && this.find(datos.id)) {
			throw new Error('Ya existe otro equipo con ese ID.');
		}
		equipo.id = datos.id;
		equipo.marca = datos.marca;
		equipo.modelo = datos.modelo;
		equipo.estado = datos.estado;
		equipo.bateriaSalud = datos.bateriaSalud;
		equipo.procesador = datos.procesador;
		equipo.almacenamiento = datos.almacenamiento;
		this.guardar();
	}

	eliminar(id) {
		this.#equipos = this.#equipos.filter((equipo) => equipo.id !== id);
		this.guardar();
	}

	obtenerDatos() {
		return this.#equipos.map((equipo) => ({
			id: equipo.id,
			marca: equipo.marca,
			modelo: equipo.modelo,
			estado: equipo.estado,
			bateriaSalud: equipo.bateriaSalud,
			procesador: equipo.procesador,
			almacenamiento: equipo.almacenamiento
		}));
	}

	almacenamientoTotal() {
		return this.#equipos.reduce((total, equipo) => total + equipo.almacenamiento, 0);
	}

	guardar() {
		localStorage.setItem(this.#claveStorage, JSON.stringify(this.obtenerDatos()));
	}

	cargar() {
		const datosGuardados = localStorage.getItem(this.#claveStorage);
		if (!datosGuardados) return;

		try {
			const datos = JSON.parse(datosGuardados);
			if (!Array.isArray(datos)) return;
			this.#equipos = datos.map((datosEquipo) => new NotebookLote(
				datosEquipo.id,
				datosEquipo.marca,
				datosEquipo.modelo,
				datosEquipo.estado,
				datosEquipo.bateriaSalud,
				datosEquipo.procesador,
				datosEquipo.almacenamiento
			));
		} catch (error) {
			this.#equipos = [];
			console.error('No se pudieron cargar los equipos guardados.', error);
		}
	}
}
