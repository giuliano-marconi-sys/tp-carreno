import { EquipoComputo } from './EquipoComputo.js';

export class NotebookLote extends EquipoComputo {
	#bateriaSalud;
	#procesador;
	#almacenamiento;

	constructor(id, marca, modelo, estado, bateriaSalud, procesador, almacenamiento) {
		super(id, marca, modelo, estado);
		this.bateriaSalud = bateriaSalud;
		this.procesador = procesador;
		this.almacenamiento = almacenamiento;
	}

	get bateriaSalud() { return this.#bateriaSalud; }
	set bateriaSalud(valor) {
		const numero = Number(valor);
		if (!Number.isFinite(numero) || numero < 0 || numero > 100) {
			throw new Error('La salud de bateria debe estar entre 0 y 100.');
		}
		this.#bateriaSalud = numero;
	}

	get procesador() { return this.#procesador; }
	set procesador(valor) {
		if (typeof valor !== 'string' || valor.trim() === '') {
			throw new Error('El procesador es obligatorio.');
		}
		this.#procesador = valor.trim();
	}

	get almacenamiento() { return this.#almacenamiento; }
	set almacenamiento(valor) {
		const numero = Number(valor);
		if (!Number.isInteger(numero) || numero <= 0) {
			throw new Error('El almacenamiento debe ser un numero entero mayor que 0.');
		}
		this.#almacenamiento = numero;
	}

	obtenerDescripcion() {
		return `${super.obtenerDescripcion()} - ${this.#procesador}, ${this.#almacenamiento} GB`;
	}
}
