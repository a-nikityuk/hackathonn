        
        let map; // val for API
        let userMarker; 
        let watchId = null;
        let routeLine = null;
        let startMarker = null;
        let endMarker = null;
        let taskMarkers = [];

        function initMap() {
            map = new mapgl.Map('map', {
                center: [37.6175, 55.7558],
                zoom: 13,
                key: '783e0858-39de-4c83-a72c-bc2858c795be',
            });

            loadTasks(); // Загружаем задачи при старте
        }

        // Функция для сворачивания/разворачивания панели задач
        function toggleTasksPanel() {
            const panel = document.getElementById('tasksPanel');
            panel.classList.toggle('collapsed');
        }

        // Функции для панели задач
        function loadTasks() {
            const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = '';

            if (tasks.length === 0) {
                tasksList.innerHTML = '<div class="no-tasks">Задач пока нет</div>';
                return;
            }

            tasks.forEach((task, index) => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.innerHTML = `
                    <h4>Задача ${index + 1}</h4>
                    <p><strong>Возраст:</strong> ${task.age} лет</p>
                    <p><strong>Инвалидность:</strong> ${task.disabilityType}</p>
                    <p><strong>Описание:</strong> ${task.helpDescription}</p>
                    <p><strong>Когда:</strong> ${new Date(task.helpDateTime).toLocaleString('ru-RU')}</p>
                    <p><strong>Маршрут:</strong> ${task.pointA} → ${task.pointB}</p>
                    <div class="task-responses">Откликов: ${task.responses || 0}</div>
                `;
                tasksList.appendChild(taskElement);
            });
        }

        // Функции для модального окна
        function showAddTaskModal() {
            document.getElementById('addTaskModal').style.display = 'flex';
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('taskForm').reset();
        }

        function closeAddTaskModal() {
            document.getElementById('addTaskModal').style.display = 'none';
        }

        // Обработка формы добавления задачи
        document.getElementById('taskForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskData = {
                age: document.getElementById('userAge').value,
                disabilityType: document.getElementById('disabilityType').value,
                helpDescription: document.getElementById('helpDescription').value,
                helpDateTime: document.getElementById('helpDateTime').value,
                pointA: document.getElementById('pointA').value,
                pointB: document.getElementById('pointB').value,
                timestamp: new Date().toISOString(),
                responses: 0
            };
            
            // Сохраняем задачу в localStorage
            saveTask(taskData);
            
            // Показываем сообщение об успехе
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('taskForm').reset();
            
            // Обновляем список задач
            loadTasks();
            
            console.log('Задача добавлена:', taskData);
            
            // Закрываем модальное окно через 2 секунды
            setTimeout(() => {
                closeAddTaskModal();
            }, 2000);
        });

        function saveTask(taskData) {
            let tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
            tasks.push(taskData);
            localStorage.setItem('userTasks', JSON.stringify(tasks));
        }

        // Существующие функции карты (оставлены без изменений)
        function showMoscow() {
            if (map) {
                map.setCenter([37.6175, 55.7558]);
                map.setZoom(13);
            }
        }

        function getUserLocation() {
            if (!navigator.geolocation) {
                alert('Геолокация не поддерживается вашим браузером');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [position.coords.longitude, position.coords.latitude];
                    showUserLocation(coords, position.coords.accuracy);
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
                size: [35, 35]
            });

            map.setCenter(coords);
            map.setZoom(16);
            updateCoordinates(coords, accuracy);
        }

        function updateCoordinates(coords, accuracy) {
            const coordsElement = document.getElementById('coordinates');
            if (coordsElement) {
                coordsElement.innerHTML = `
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
            alert('Ошибка: ' + message);
        }

        function stopTracking() {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                watchId = null;
            }
        }

        function clearRoute() {
            if (routeLine) {
                routeLine.destroy();
                routeLine = null;
            }
            if (startMarker) {
                startMarker.destroy();
                startMarker = null;
            }
            if (endMarker) {
                endMarker.destroy();
                endMarker = null;
            }
        }

        // Закрытие модального окна при клике вне его
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('addTaskModal');
            if (event.target === modal) {
                closeAddTaskModal();
            }
        });

        window.addEventListener('load', initMap);
        window.addEventListener('beforeunload', () => {
            stopTracking();
        });