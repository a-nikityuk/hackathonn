document.addEventListener('DOMContentLoaded', function() {
            const loginOption = document.getElementById('login-option');
            const registerOption = document.getElementById('register-option');
            const registrationModal = document.getElementById('registration-modal');
            const closeModal = document.getElementById('close-modal');
            const ovzType = document.getElementById('ovz-type');
            const volunteerType = document.getElementById('volunteer-type');
            const healthCategoryGroup = document.getElementById('health-category-group');
            const registrationForm = document.getElementById('registration-form');
            const loginBtn = document.getElementById('login-btn');

            // Переключение между входом и регистрацией
            registerOption.addEventListener('click', function() {
                registrationModal.style.display = 'flex';
            });
            
            //. закрытие модального  окна на крест
            closeModal.addEventListener('click', function() {
                registrationModal.style.display = 'none';
            });

            // Закрытие модального окна при клике вне его
            window.addEventListener('click', function(event) {
                if (event.target === registrationModal) {
                    registrationModal.style.display = 'none';
                }
            });

            // Переключение между типами пользователей(переключение овз/волонтер)
            ovzType.addEventListener('click', function() {
                ovzType.classList.add('active');
                volunteerType.classList.remove('active');
                healthCategoryGroup.classList.remove('hidden');
            });

            volunteerType.addEventListener('click', function() {
                volunteerType.classList.add('active');
                ovzType.classList.remove('active');
                healthCategoryGroup.classList.add('hidden');
            });

            // Обработка формы регистрации
            registrationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Сохранение данных пользователя
                const userType = ovzType.classList.contains('active') ? 'ovz' : 'volunteer';
                const userData = {
                    firstName: document.getElementById('first-name').value,
                    lastName: document.getElementById('last-name').value,
                    email: document.getElementById('email').value,
                    district: document.getElementById('district').value,
                    password: document.getElementById('reg-password').value,
                    type: userType
                };
                
                if (userType === 'ovz') {
                    const healthCategories = [];
                    document.querySelectorAll('input[name="health-category"]:checked').forEach(checkbox => {
                        healthCategories.push(checkbox.value);
                    });
                    userData.healthCategories = healthCategories;
                }
                
                // Сохраняем данные в localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Закрываем модальное окно
                registrationModal.style.display = 'none';
                
                // Показываем сообщение об успешной регистрации
                alert('Регистрация прошла успешно! Теперь вы можете войти в систему.');
            });

            // Обработка входа
            loginBtn.addEventListener('click', function() {
                const login = document.getElementById('login').value;
                const password = document.getElementById('password').value;
                
                // Проверяем, есть ли сохраненные данные пользователя
                const savedUserData = localStorage.getItem('userData');
                
                if (savedUserData) {
                    const userData = JSON.parse(savedUserData);
                    
                    // проверка логина и пароля
                    if ((login === userData.email || login === userData.firstName) && password === userData.password) {
                        // Сохраняем информацию о текущем пользователе
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        
                        // Перенаправляем в зависимости от типа пользователя
                        if (userData.type === 'ovz') {
                            window.location.href = 'OVZ/OVZ.html';
                        } else {
                            window.location.href = 'volunteer/volunteer.html';
                        }
                    } else {
                        alert('Неверный логин или пароль!');
                    }
                } else {
                    alert('Сначала зарегистрируйтесь!');
                }
            });
        });

// Прописать для очистки задач с сервера: localStorage.removeItem('userTasks');
// 