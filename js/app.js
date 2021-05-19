// variables
const cursos = document.querySelector("#lista-cursos");
const carrito = document.getElementById("carrito");
const lista_cursos = document.querySelector("#lista-carrito tbody");
const boton_vaciar_carrito = document.getElementById("vaciar-carrito");
// listeners
cargar_event_listeners();


function cargar_event_listeners(){
    // Dispara cuando se preciona agregar carrito
    cursos.addEventListener("click", comprar_curso)

    // Cuando se elimina un crso del carrito
    carrito.addEventListener('click', eliminar_curso);

    // Al vaciar el carrito
    boton_vaciar_carrito.addEventListener('click', vaciar_carrito);

    // Al cargar el documento mostrar el local storage
    document.addEventListener("DOMContentLoaded", leer_local_storage);
}

// funciones

// Funcion que añade el curso al carrito
function comprar_curso(evento){
    evento.preventDefault();
    // Delegation para agregar-carrito
    if (evento.target.classList.contains("agregar-carrito")){
        const curso = evento.target.parentElement.parentElement;
        // Enviamos el curso seleccionadao para tomar sus datos
        leer_datos_curso(curso);
    }
}

// Lee los dats del curso
function leer_datos_curso(curso){

    const info_curso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent, 
        // El getAttribute no sale directamente
        id : curso.querySelector("a").getAttribute("data-id")
    }
    insertar_carrito(info_curso);
}

// Muestra el curso seleccionado en el carrito
function insertar_carrito(curso){
    const row = document.createElement("tr");
    // Siempre haslo mediante template
    row.innerHTML = 
    `
    <td>
        <img src= "${curso.imagen}" width=100>        
    </td>
    <td>${curso.titulo}</td>
    <td>${curso.precio}</td>
    <td>
        <ahref="#" class="borrar-curso" data-id="${curso.id}">X</a>
    </td>
    `;
    lista_cursos.appendChild(row);
    guardar_curso_local_storage(curso);
}

function eliminar_curso(evento) {
    evento.preventDefault();
    let curso_id;
    if (evento.target.classList.contains("borrar-curso")){
        // parentElement no se pone directo
        curso_id = evento.target.getAttribute("data-id");
        const curso_borrar = evento.target.parentElement.parentElement;
        curso_borrar.remove();
    }
    eliminar_curso_local_storage(curso_id);    
}

// Elimina los cursos del carrito en el dom
function vaciar_carrito(event){
    // forma lenta (No recomendad por que pega un salto en el menu lo cierra bruscamete)
    //lista_cursos.innerHTML = '';

    // forma rapida y RECOMENDADA
    while(lista_cursos.firstChild){
        lista_cursos.removeChild(lista_cursos.firstChild);
    }
    // vaciar local storage
    vaciar_local_storage();
}

function guardar_curso_local_storage(curso){
    let cursos;
    // Obtine la lista de cursos o vacio
    cursos = obtener_cursos_local_storage();
    cursos.push(curso);
    // Combierte de arreglo a string y guarda
    localStorage.setItem("cursos", JSON.stringify(cursos));

}

function obtener_cursos_local_storage(){
    let cursos_local_storage;
    if (localStorage.getItem("cursos") === null){
        cursos_local_storage = [];
    }else {
        cursos_local_storage = JSON.parse(localStorage.getItem("cursos"));
    }
    return cursos_local_storage;
}

function leer_local_storage(){
    let cursos_local_storage;
    cursos_local_storage = obtener_cursos_local_storage();

    cursos_local_storage.forEach(curso => {
        const row = document.createElement("tr");
        row.innerHTML = 
        `
        <td>
            <img src= "${curso.imagen}" width=100>        
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <ahref="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
        `;
        lista_cursos.appendChild(row);
    });
}

// Eliminar el curso por el ID de local storage
function eliminar_curso_local_storage(curso_id){
    console.log(curso_id);
    let cursos_local_storage = obtener_cursos_local_storage();
    cursos_local_storage.forEach(function(curso, index){
        if (curso.id === curso_id){
            // funcion para eliminar de arreglo
            cursos_local_storage.splice(index,1);
        }
    });
    // Guardamos el arreglo actual al storage
    localStorage.setItem("cursos", JSON.stringify(cursos_local_storage));
}

// ELimina todos los cursos de local Storge
function vaciar_local_storage(){
    localStorage.clear();
}