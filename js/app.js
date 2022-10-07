// variables y selectores
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI (User Interface)
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando = false;

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agrega la clase de Bootstrap en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agrega al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quita la alerta después de 5 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}) {
        // const {citas} = citas;
        this.limpiarHTML();

        citas.forEach(cita => { 
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            // botón para eliminar una cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            // agregando icono de cruz
            // btnEliminar.innerHTML = 'Eliminar &times';
            // agregando icono de cruz de heroicons
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ` ;
            btnEliminar.onclick = () => eliminarCita(id)

            // botón para editar una cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`;
            btnEditar.onclick = () => cargarEdicion(cita);


            // agregando los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // agrega las citas al html
            contenedorCitas.appendChild(divCita);

        })
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

// Instancias
const ui = new UI();
const administrarCitas = new Citas();

// Registra eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCita(e) {
    // accediendo a las propiedades del objeto
    // name es el nombre del input, que debe coincidir 
    //con el nombre de la propiedad del objeto 
    // No se puede usar citaObj.e.target.name, 
    // porque en ese caso estaría tratando de acceder al evento
    citaObj[e.target.name] = e.target.value; // con esto se va a ir llenando el objeto citaObj

}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    // Extrayendo la información del objeto de cita con destructuring
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validando los campos
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (editando) {
        // Pasa el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});

        // Mensaje de actualizado correctamente
        ui.imprimirAlerta('Se editó correctamente');

        // Regresa el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quita modo edición
        editando = false;

    } else {
        // Genera un id único
        citaObj.id = Date.now();

        // Crea una nueva cita
        administrarCitas.agregarCita({...citaObj}); // se pasa el objeto por valor, no por referencia

        // Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente');

    }

    // Genera un ID único
    citaObj.id = Date.now();

    // Creando una nueva cita, usando el spread operator
    // administrarCitas.agregarCita({ ...citaObj }); // se pasa el objeto citaObj, pero se crea una copia de él

    // Reinicia el objeto para la validación
    reiniciarObjeto();

    // Reinicia el formulario
    formulario.reset();

    // Muestra el HTML de las citas
    ui.imprimirCitas(administrarCitas);

}

// Reinicia el objeto para la validación
function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// Elimina una cita
function eliminarCita(id) {
    // Elimina la cita
    administrarCitas.eliminarCita(id);

    // Muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refresca las citas
    ui.imprimirCitas(administrarCitas);
}

// Carga los datos y el modo edición
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llena los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llena el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambia el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}