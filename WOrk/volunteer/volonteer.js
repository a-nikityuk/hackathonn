let map;
let userMarker;
let watchId = null;
let routeLine = null;
let startMarker = null;
let endMarker = null;
let helpMarkers = [];
let currentMarkerData = null;
let savedAddress = localStorage.getItem('savedAddress') || '';
let savedAddressCoords = null;
let allHelpRequests = [];
let filteredHelpRequests = [];

// Города и задачки для теста
allHelpRequests = [
    // Москва
    {
        id: 1,
        coordinates: [37.6175, 55.7558],
        name: "Иванова Мария Петровна",
        age: 72,
        disability: "Опорно-двигательный аппарат",
        description: "Нужна помощь с покупкой продуктов и лекарств в ближайшей аптеке и магазине",
        datetime: "07.10.2025, 14:00",
        urgent: false,
        city: "Москва"
    },
    {
        id: 2,
        coordinates: [37.6100, 55.7520],
        name: "Петров Алексей Сергеевич",
        age: 68,
        disability: "Нарушение зрения",
        description: "Требуется сопровождение в поликлинику №5 для планового осмотра",
        datetime: "08.10.2025, 10:30",
        urgent: true,
        city: "Москва"
    },
    {
        id: 3,
        coordinates: [37.6250, 55.7580],
        name: "Сидорова Анна Ивановна",
        age: 75,
        disability: "Опорно-двигательный аппарат",
        description: "Помощь в уборке квартиры (влажная уборка, вынос мусора)",
        datetime: "09.10.2025, 12:00",
        urgent: false,
        city: "Москва"
    },
    {
        id: 4,
        coordinates: [37.6000, 55.7500],
        name: "Козлов Владимир Николаевич",
        age: 80,
        disability: "Нарушение слуха",
        description: "Помощь с оформлением документов в социальной службе",
        datetime: "10.10.2025, 11:00",
        urgent: false,
        city: "Москва"
    },
    {
        id: 5,
        coordinates: [37.6300, 55.7600],
        name: "Николаева Ольга Васильевна",
        age: 78,
        disability: "Общее заболевание",
        description: "Нужна помощь по дому: приготовление еды, уборка",
        datetime: "11.10.2025, 15:00",
        urgent: false,
        city: "Москва"
    },
    // Санкт-Петербург
    {
        id: 6,
        coordinates: [30.3155, 59.9375],
        name: "Фёдоров Сергей Иванович",
        age: 65,
        disability: "Нарушение зрения",
        description: "Сопровождение в банк для оплаты коммунальных услуг",
        datetime: "12.10.2025, 13:30",
        urgent: true,
        city: "Санкт-Петербург"
    },
    {
        id: 7,
        coordinates: [30.3255, 59.9275],
        name: "Морозова Елена Викторовна",
        age: 82,
        disability: "Опорно-двигательный аппарат",
        description: "Помощь с доставкой тяжелых продуктов из супермаркета",
        datetime: "13.10.2025, 16:00",
        urgent: false,
        city: "Санкт-Петербург"
    },
    // Новосибирск
    {
        id: 8,
        coordinates: [82.9204, 55.0084],
        name: "Громов Павел Александрович",
        age: 70,
        disability: "Общее заболевание",
        description: "Нужна помощь в заполнении анкет для получения льгот",
        datetime: "14.10.2025, 09:00",
        urgent: false,
        city: "Новосибирск"
    },
    // Екатеринбург
    {
        id: 9,
        coordinates: [60.6122, 56.8519],
        name: "Волкова Ирина Сергеевна",
        age: 74,
        disability: "Нарушение слуха",
        description: "Сопровождение на почту для отправки посылки родственникам",
        datetime: "15.10.2025, 14:30",
        urgent: false,
        city: "Екатеринбург"
    },
    // Казань
    {
        id: 10,
        coordinates: [49.1085, 55.7963],
        name: "Тихонов Михаил Петрович",
        age: 79,
        disability: "Опорно-двигательный аппарат",
        description: "Помощь в прогулке на свежем воздухе в парке",
        datetime: "16.10.2025, 11:00",
        urgent: false,
        city: "Казань"
    },

    {
        id: 11,
        coordinates: [37.6057, 55.7479],
        name: "Крючкова Любовь Васильевна",
        age: 56,
        disability: "Общее заболевание",
        description: "Помогите донести пакеты. До метро Октябрьская!!!",
        datetime: "07.10.2025, 7:00",
        urgent: false,
        city: "Москва"
    },
    {
        id: 12,
        coordinates: [37.6080, 55.6900],
        name: "Фезякина Ольга Андреевна",
        age: 45,
        disability: "Общее заболевание",
        description: "Нужна помощь с лекарствами.",
        datetime: "15.10.2025, 23:00",
        urgent: false,
        city: "Москва"
    },
    {
        id: 13,
        coordinates: [37.6085, 55.6940],
        name: "Андреев Сергей Викторович",
        age: 95,
        disability: "Общее заболевание",
        description: "довести. ребята. срочно",
        datetime: "15.10.2025, 23:00",
        urgent: true,
        city: "Москва"
    }
];

filteredHelpRequests = [...allHelpRequests];

function initMap() {
    map = new mapgl.Map('map', {
        center: [37.6175, 55.7558],
        zoom: 13,
        key: '783e0858-39de-4c83-a72c-bc2858c795be',
    });

    map.on('click', function(event) {
        const coords = event.lngLat;
        updateCoordinates([coords.lng, coords.lat], null);
    });

    // Восстанавливаем сохранённый адрес при загрузке
    if (savedAddress) {
        document.getElementById('userAddress').value = savedAddress;
        document.getElementById('savedAddressText').textContent = savedAddress;
        document.getElementById('savedAddress').style.display = 'block';
        // Получаем координаты сохранённого адреса
        geocodeAddress(savedAddress).then(coords => {
            savedAddressCoords = [coords.lon, coords.lat];
        });
    }

    setTimeout(() => {
        addHelpMarkers();
    }, 1000);
}

function addHelpMarkers() {
    // Чистка прошлых маркеров
    helpMarkers.forEach(marker => marker.destroy());
    helpMarkers = [];

    filteredHelpRequests.forEach(request => {
        const markerColor = request.urgent ? '#dc3545' : '#007bff';
        
        const marker = new mapgl.Marker(map, {
            coordinates: request.coordinates,
            icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
            color: markerColor,
            size: [50, 50],
        });

        marker.on('click', () => {
            showMarkerPopup(request);
        });

        helpMarkers.push(marker);
    });
    
    updateFilterResults();
    updateStatus(`Показано: ${helpMarkers.length} из ${allHelpRequests.length} заявок`);
}

function updateFilterResults() {
    const resultsElement = document.getElementById('filterResults');
    resultsElement.textContent = `Показано: ${filteredHelpRequests.length} из ${allHelpRequests.length} заявок`;
}

function applyFilters() {
    const cityFilter = document.getElementById('cityFilter').value;
    const radiusFilter = parseInt(document.getElementById('radiusFilter').value);
    const disabilityFilter = document.getElementById('disabilityFilter').value;
    const urgencyFilter = document.getElementById('urgencyFilter').value;

    filteredHelpRequests = allHelpRequests.filter(request => {
        // Фильтр по городу
        if (cityFilter !== 'all' && request.city !== cityFilter) {
            return false;
        }

        // Тип инвалидности
        if (disabilityFilter !== 'all' && request.disability !== disabilityFilter) {
            return false;
        }

        // Срочность
        if (urgencyFilter === 'urgent' && !request.urgent) {
            return false;
        }
        if (urgencyFilter === 'normal' && request.urgent) {
            return false;
        }

        // фильтр по радиусу (если есть сохранённый (введённый) адрес) Не работает от местоположения !!
        if (radiusFilter > 0 && savedAddressCoords) {
            const distance = calculateSimpleDistance(savedAddressCoords, request.coordinates);
            if (distance > radiusFilter) {
                return false;
            }
        }

        return true;
    });

    addHelpMarkers();
    updateStatus(`Применены фильтры. Показано: ${filteredHelpRequests.length} заявок`);
}

function resetFilters() {
    document.getElementById('cityFilter').value = 'all';
    document.getElementById('radiusFilter').value = '0';
    document.getElementById('disabilityFilter').value = 'all';
    document.getElementById('urgencyFilter').value = 'all';
    
    filteredHelpRequests = [...allHelpRequests];
    addHelpMarkers();
    updateStatus('Фильтры сброшены');
}

function toggleFilters() {
    const filtersPanel = document.getElementById('filtersPanel');
    const filtersToggle = document.getElementById('filtersToggle');
    
    if (filtersPanel.style.display === 'none') {
        filtersPanel.style.display = 'block';
        filtersToggle.style.display = 'none';
    } else {
        filtersPanel.style.display = 'none';
        filtersToggle.style.display = 'block';
    }
}

function saveAddress() {
    const addressInput = document.getElementById('userAddress');
    const address = addressInput.value.trim();
    
    if (!address) {
        alert('Пожалуйста, введите адрес');
        return;
    }

    updateStatus('Сохранение адреса...');

    geocodeAddress(address).then(coords => {
        savedAddress = address;
        savedAddressCoords = [coords.lon, coords.lat];
        
        // Сохраняем в localStorage наш сохранённый адрес
        localStorage.setItem('savedAddress', address);
        
        // показываем сохранённый адрес
        document.getElementById('savedAddressText').textContent = address;
        document.getElementById('savedAddress').style.display = 'block';
        
        updateStatus('Адрес сохранён!');
        
        // Показываем маркер нашего адреса
        showSavedAddressMarker();
        
    }).catch(error => {
        updateStatus('Ошибка определения адреса');
        alert('Не удалось определить координаты введенного адреса. Проверьте правильность адреса.');
    });
}

function showSavedAddressMarker() {
    if (savedAddressCoords) {
        if (window.savedAddressMarker) {
            window.savedAddressMarker.destroy();
        }
        
        window.savedAddressMarker = new mapgl.Marker(map, {
            coordinates: savedAddressCoords,
            icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
            color: '#ffc107',
            size: [40, 40]
        });
    }
}


// Возможно остался мусор от методов построения маршрута....

function showMarkerPopup(data) {
    currentMarkerData = data;
    
    document.getElementById('popupName').innerHTML = data.name + 
        (data.urgent ? '<span class="urgent-badge">СРОЧНО</span>' : '');
    document.getElementById('popupAge').textContent = data.age + ' лет';
    document.getElementById('popupDisability').textContent = data.disability;
    document.getElementById('popupDescription').textContent = data.description;
    document.getElementById('popupDateTime').textContent = data.datetime;
    
    const popup = document.getElementById('markerPopup');
    popup.style.display = 'block';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
}

function closePopup() {
    document.getElementById('markerPopup').style.display = 'none';
    currentMarkerData = null;
}

function showRouteChoice() {
    closePopup();
    document.getElementById('routeChoicePopup').style.display = 'block';
}

function closeRouteChoicePopup() {
    document.getElementById('routeChoicePopup').style.display = 'none';
}

function buildRouteFromLocation() {
    closeRouteChoicePopup();
    
    if (!currentMarkerData) return;
    
    clearRoute();
    
    if (userMarker) {
        const userCoords = userMarker.getCoordinates();
        buildRoute(userCoords, currentMarkerData.coordinates, 'location');
    } else {
        getUserLocationForRoute(currentMarkerData.coordinates);
    }
}





async function geocodeAddress(address) {
    try {
        const response = await fetch(`https://catalog.api.2gis.com/3.0/items/geocode?q=${encodeURIComponent(address)}&fields=items.point&key=40074715-85b5-400f-a2a8-a41b550be1e8`);
        
        if (!response.ok) {
            throw new Error(`Ошибка геокодинга: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result && data.result.items && data.result.items.length > 0) {
            const point = data.result.items[0].point;
            return {
                lon: point.lon,
                lat: point.lat
            };
        } else {
            throw new Error('Адрес не найден');
        }
    } catch (error) {
        console.error('Ошибка геокодинга:', error);
        throw error;
    }
}

function calculateRouteDistance(coordinates) {
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
        totalDistance += calculateSimpleDistance(coordinates[i-1], coordinates[i]);
    }
    return (totalDistance).toFixed(1);
}

function calculateSimpleDistance(coord1, coord2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
}

function showMoscow() {
    if (map) {
        map.setCenter([37.6175, 55.7558]);
        map.setZoom(13);
        updateStatus('Карта центрирована на Москве');
    }
}

function getUserLocation() {
    if (!navigator.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
        return;
    }

    updateStatus('Определение местоположения...');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const coords = [position.coords.longitude, position.coords.latitude];
            showUserLocation(coords, position.coords.accuracy);
            updateStatus('Местоположение определено!');
        },
        (error) => {
            handleLocationError(error);
        }
    );
}



function showUserLocation(coords, accuracy) {
    if (!map) return;

    if (userMarker) {
        userMarker.destroy();
    }

    userMarker = new mapgl.Marker(map, {
        coordinates: coords,
        icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
        color: '#28a745',
        size: [45, 45]
    });

    map.setCenter(coords);
    map.setZoom(16);
    updateCoordinates(coords, accuracy);
}

function updateCoordinates(coords, accuracy) {
    const coordsElement = document.getElementById('coordinates');
    if (coordsElement) {
        coordsElement.innerHTML = `
            <strong>Координаты:</strong><br>
            Широта: ${coords[1].toFixed(6)}<br>
            Долгота: ${coords[0].toFixed(6)}<br>
            Точность: ${accuracy ? accuracy.toFixed(0) + ' м' : 'неизвестно'}
        `;
    }
}

function handleLocationError(error) {
    let message = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = 'Доступ к геолокации запрещен';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Информация о местоположении недоступна';
            break;
        case error.TIMEOUT:
            message = 'Время запроса истекло';
            break;
        default:
            message = 'Произошла неизвестная ошибка';
            break;
    }
    
    updateStatus('Ошибка: ' + message);
}

function updateStatus(text) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = text;
    }
}


function toggleTaskList() {
    alert('Функция списка задач - чтобы не искать по карте. Будет реализована в будущем..');
}

window.addEventListener('load', initMap);

window.addEventListener('beforeunload', () => {
    stopTracking();
});