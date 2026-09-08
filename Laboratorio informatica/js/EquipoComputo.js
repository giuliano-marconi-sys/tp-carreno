export class EquipoComputo {
	#id;
	#marca;
	#modelo;
	#estado;

	constructor(id, marca, modelo, estado) {
		this.id = id;
		this.marca = marca;
		this.modelo = modelo;
		this.estado = estado;
	}

	get id() { return this.#id; }
	set id(valor) {
		if (typeof valor !== 'string' || valor.trim() === '') {
			throw new Error('El ID es obligatorio.');
		}
		this.#id = valor.trim();
	}

	get marca() { return this.#marca; }
	set marca(valor) {
		if (typeof valor !== 'string' || valor.trim() === '') {
			throw new Error('La marca es obligatoria.');
		}
		this.#marca = valor.trim();
	}

	get modelo() { return this.#modelo; }
	set modelo(valor) {
		if (typeof valor !== 'string' || valor.trim() === '') {
			throw new Error('El modelo es obligatorio.');
		}
		this.#modelo = valor.trim();
	}

	get estado() { return this.#estado; }
	set estado(valor) {
		const estadosValidos = ['Disponible', 'En uso', 'En reparacion'];
		if (!estadosValidos.includes(valor)) {
			throw new Error('El estado seleccionado no es valido.');
		}
		this.#estado = valor;
	}

	obtenerDescripcion() {
		return `${this.#marca} ${this.#modelo} - ${this.#estado}`;
	}
}
