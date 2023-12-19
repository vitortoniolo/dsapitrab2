document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function(event){
    if (event.target.className === "delete-row-btn") { 
        deleteRowByID(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');

function deleteRowByID(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data=> {
        if (data){
            location.reload();
        }
    });

}

function handleEditRow(id){
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-titulo-btn').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateTituloInput = document.querySelector('#update-titulo-input');

    console.log(updateTituloInput);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(updateTituloInput.dataset.id, 10),
            titulo: updateTituloInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const addBtn = document.querySelector('#add-livro-btn');


addBtn.onclick = function(){
    const tituloInput = document.querySelector('#titulo-input');
    const autorInput = document.querySelector('#autor-input');
    const titulo = tituloInput.value;
    const autor = autorInput.value;
    tituloInput.value = "";
    autorInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ titulo: titulo, autor: autor})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data){
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)){
            if (key === 'dateAdded') {
                data[key] = new Date(data[key].toLocaleString());
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }
    tableHtml += `<td><button class ="delete-row-btn" data-id=${data.id}>Deletar</td>`
    tableHtml += `<td><button class ="edit-row-btn" data-id=${data.id}>Editar</td>`
    tableHtml += "</tr>";

    if (isTableData){
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }

}

function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    if (data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No data</td></tr>";
        return;
    }
    let tableHtml = "";

    data.forEach(function({id, titulo, autor}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${titulo}</td>`;
        tableHtml += `<td>${autor}</td>`;
        tableHtml += `<td><button class ="delete-row-btn" data-id=${id}>Deletar</td>`;
        tableHtml += `<td><button class ="edit-row-btn" data-id=${id}>Editar</td>`;
        tableHtml += "<tr>";
    });

    table.innerHTML = tableHtml;
}