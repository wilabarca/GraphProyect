import Graph from "../models/Graph.js";

const graph = new Graph();
let placesRegistered = false;

document.getElementById('placeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = Date.now().toString(); 
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const address = document.getElementById('address').value;
    const openingHours = document.getElementById('openingHours').value;
    const type = document.getElementById('type').value;

    // Verificar que todos los campos estén llenos
    if (!name || !description || !address || !openingHours || !type) {
        showAlert('error', 'Por favor, complete todos los campos del formulario.');
        return;
    }

    graph.addPlace(id, name, description, address, openingHours, type);
    updatePlaceOptions();
    document.getElementById('placeForm').reset();

    if (Object.keys(graph.places).length >= 2) {
        placesRegistered = true;
        showSection('addConnections');
        showAlert('success', 'Todos los campos han sido añadidos correctamente.');
    } else {
        showAlert('info', 'Lugar añadido correctamente.');
    }
});

function updatePlaceOptions() {
    const fromSelects = document.querySelectorAll('select[id="fromPlace"]');
    const toSelects = document.querySelectorAll('select[id="toPlace"]');

    fromSelects.forEach(select => {
        select.innerHTML = '<option value="">Elija una opción</option>';
    });

    toSelects.forEach(select => {
        select.innerHTML = '<option value="">Elija una opción</option>';
    });

    for (let id in graph.places) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = graph.places[id].name;

        fromSelects.forEach(select => {
            select.appendChild(option.cloneNode(true));
        });

        toSelects.forEach(select => {
            select.appendChild(option.cloneNode(true));
        });
    }
}

window.addConnection = function() {
    const fromPlaceId = document.querySelector('#addConnections select[id="fromPlace"]').value;
    const toPlaceId = document.querySelector('#addConnections select[id="toPlace"]').value;
    const distance = parseInt(document.getElementById('distance').value, 10);

    if (!fromPlaceId || !toPlaceId || isNaN(distance)) {
        showAlert('error', 'Por favor, seleccione lugares válidos y una distancia en metros.');
        return;
    }

    graph.addConnection(fromPlaceId, toPlaceId, distance);
    document.getElementById('connectionForm').reset();
    showAlert('success', 'Conexión añadida correctamente.');
};

window.findShortestPath = function() {
    const fromPlace = document.querySelector('#places select[id="fromPlace"]').value;
    const toPlace = document.querySelector('#places select[id="toPlace"]').value;
    const resultDiv = document.getElementById('result');

    if (!fromPlace || !toPlace) {
        resultDiv.textContent = 'Seleccione ambos lugares.';
        showAlert('info', 'Seleccione ambos lugares.');
        return;
    }

    const { path, totalDistance } = graph.dijkstra(fromPlace, toPlace);
    if (path.length) {
        resultDiv.textContent = `Ruta más corta: ${path.map(id => graph.places[id].name).join(' -> ')}\nDistancia Total: ${totalDistance} metros`;
        showAlert('info', 'Ruta calculada correctamente.');
    } else {
        resultDiv.textContent = 'No se encontró una ruta.';
        showAlert('error', 'No se encontró una ruta.');
    }
};

window.showSection = function(sectionId) {
    document.querySelectorAll('.container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    updatePlaceOptions(); 
};

function showAlert(type, message) {
    // Elimina cualquier alerta existente
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.className = 'alert-close';
    closeBtn.onclick = function() {
        alert.style.display = 'none';
    };

    alert.appendChild(closeBtn);
    document.body.appendChild(alert);

    // Mostrar la alerta
    alert.style.display = 'flex';

    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    updatePlaceOptions();
});
