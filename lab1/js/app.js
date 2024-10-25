let finalArray = [];
let favoriteTeachers = [];

// Функція для генерації випадкового значення зі списку
function getRandomValue(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}


// Функція для об'єднання об'єктів із позбавленням повторів
function mergeObjects(arr1, arr2) {
    const mergedObjects = [];

    // Об'єдную об'єкти з першого масиву
    for (const obj of arr1) {
        if (obj.full_name) {
            const duplicate = mergedObjects.find((item) => item.full_name === obj.full_name);
            if (!duplicate) {
                mergedObjects.push(obj);
            }
        }
    }

    // Об'єдную об'єкти з другого масиву
    for (const obj of arr2) {
        if (obj.full_name) {
            const duplicate = mergedObjects.find((item) => item.full_name === obj.full_name);
            if (!duplicate) {
                mergedObjects.push(obj);
            }
        }
    }
    return mergedObjects;
}
function createHexCode() {
    let letters = "0123456789ABCDEF";
    let color = '#';

    for (let i = 0; i < 6; i++)
        color += letters[(Math.floor(Math.random() * 16))];

    return color;
}
//Створюємо юзера з правильно переданими параметрами
function formatUser(user) {
    const daysToBirthday = daysUntilNextBirthday(user.dob.date);
    return _.mapValues({
        gender: user.gender,
        title: user.name.title,
        full_name: `${user.name.first} ${user.name.last}`,
        city: user.location.city,
        state: user.location.state,
        country: user.location.country,
        postcode: user.location.postcode,
        coordinates: {
            latitude: parseFloat(user.location.coordinates.latitude),
            longitude: parseFloat(user.location.coordinates.longitude)
        },
        timezone: user.location.timezone,
        email: user.email,
        b_date: user.dob.date,
        age: user.dob.age,
        
        phone: user.phone,
        picture_large: user.picture.large,
        picture_thumbnail: user.picture.thumbnail,
        favorite: false,
        course: getRandomValue([
            "Mathematics", "Physics", "English", "Computer Science",
            "Dancing", "Chess", "Biology", "Chemistry", "Law",
            "Art", "Medicine", "Statistics"
        ]),
        bg_color: createHexCode(),
        note: "",
        daysToBirthday: daysToBirthday 
    }, value => value || '');
}

//чи валідний об'єкт user
function isValid(user) {
    return _.isString(user.full_name) &&
           _.isString(user.city) &&
           _.isString(user.state) &&
           _.isString(user.country) &&
           checkEmail(user.email) &&
           _.isNumber(user.age) && user.age > 0 &&
           validatePhone(user.phone, user.country) &&
           _.isString(user.gender);
}


//перевірка на валідність users
function checkValid(users) {
    return users.filter((user) => isValid(user));
}


//перевірка на валідність String
function validString(str) {
    if (!str || typeof (str) !== 'string') {
        return false;
    }
    if (str.charAt(0) === str.charAt(0).toLowerCase()) {
        return false;
    }
    return true;
}
//перевірка на валідність age
function checkAge(age) {
    if (typeof (age) !== 'number' || age < 0) {
        return false;
    }
    return true;
}
//перевірка на валідність phone

function validatePhone(phone, country) {

    const phoneFormats = {

        Germany: /^\d{4}[-\s]?\d{7}$/,
        Ireland: /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
        Australia: /^\d{2}[-\s]?\d{4}[-\s]?\d{4}$/,
        "United States": /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        Finland: /^0\d{1}[-\s]?\d{3}[-\s]?\d{3}$/,
        Turkey: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        Switzerland: /^0\d{2}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/,
        "New Zealand": /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        Spain: /^\d{3}[-\s]?\d{3}[-\s]?\d{3}$/,
        Norway: /^\d{8}$/,
        Denmark: /^\d{8}$/,
        Iran: /^\d{3}[-\s]?\d{8}$/,
        Canada: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        Netherlands: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
        France: /^\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/,

    };

    return phoneFormats[country] ? phoneFormats[country].test(phone) : false;

}
//перевірка на валідність email
function checkEmail(email) {
    if (!email || typeof (email) !== 'string' || !email.includes("@")) {
        return false;
    }
    return true;
}

// комапаратор
function compareObjectsByField(param, order) {
    return function (a, b) {
        let comparison = 0;

        if (a[param] < b[param]) {
            comparison = -1;
        } else if (a[param] > b[param]) {
            comparison = 1;
        }

        return order === -1 ? comparison * -1 : comparison;
    };
}
//сортування масиву за param, в порядку order==1 зростанням, order==-1 спаданням
function sortObjects(array, param, order) {
    if (param === 0) return array;
    const orderType = order === 1 ? 'asc' : 'desc';
    return _.orderBy(array, [param], [orderType]);
}


// Функція для пошуку об'єкта за параметром
function findObjectByParam(arr, param, value) {
    return arr.filter((obj) => {
        if (typeof obj[param] === 'string' && typeof value === 'string') {
            return obj[param].toLowerCase().includes(value.toLowerCase());
        } else if (typeof obj[param] === 'number' && typeof value === 'number') {
            return String(obj[param]).includes(String(value));
        } else if (typeof obj[param] === 'number' && typeof value === 'string') {

            let numbers = [...value.matchAll("[0-9]+")];
            numbers = numbers.map((value) => Number(value));

            if (value.includes("<")) {
                return obj[param] < numbers[0];
            } else if (value.includes(">")) {
                return obj[param] > numbers[0];
            } else if (value.includes("-")) {
                let max = Math.min(numbers[0], numbers[1]);
                let min = Math.max(numbers[0], numbers[1]);
                return (obj[param]) > max && (obj[param]) < min;
            }
        }

        return false;
    });
}
//вираховуємо % знайдених за віком юзерів до всієї к-сті
function calcPercentOfFound(arr, value) {
    {
        const numOfMatches = findObjectByParam(arr, "age", ">60").length;
        const totalNum = arr.length;
        const percentage = (numOfMatches / totalNum) * 100;
        return percentage + " percents";
    }
}


// Основна функція для форматування та об'єднання об'єктів
function formatAndMergeUsers(randomUserMockThis, additionalUsersThis) {
    const formattedRandomUserMock = randomUserMockThis.map(formatUser);
    const mergedUsers = mergeObjects(formattedRandomUserMock, additionalUsersThis);
    return mergedUsers;
}


const randomUserMockThis = randomUserMock;
const additionalUsersThis = additionalUsers;
let result = formatAndMergeUsers(randomUserMockThis, additionalUsersThis);

function createTeacherCardTemplate(teacher, isForFavorites) {
    const nameParts = teacher.full_name.split(' ');
    const name = nameParts[0];
    const surname = nameParts[1];
    const card = document.createElement('div');
    card.className = 'teacher-card';
    const daysToBirthdayText = document.querySelector('.days-to-birthday');
if (teacher.daysToBirthday !== undefined) {
    daysToBirthdayText.textContent = `Днів до наступного ДН: ${teacher.daysToBirthday}`;
} else {
    daysToBirthdayText.textContent = ''; // Якщо даних немає, очищуємо текст
}

    let photoSrc = teacher.picture_large;
    let subject = teacher.course;
    let country = teacher.country;
    let favorite = teacher.favorite;
    // Створюємо основний div з класом "roundedPhoto"
    const roundedPhotoDiv = document.createElement('div');
    roundedPhotoDiv.className = 'roundedPhoto';


    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo';


    const personPhotoImg = document.createElement('img');
    personPhotoImg.className = 'personPhoto';
    personPhotoImg.alt = 'person';
    personPhotoImg.src = teacher.picture_large;

    personPhotoImg.addEventListener("click", (function(teacherCopy) {
        return function() {
            console.log('Виклик showTeacherInfoPopup з:', teacherCopy);
            showTeacherInfoPopup(teacherCopy);
        }
    })(teacher));


    personPhotoImg.src = photoSrc;
    const starImg = document.createElement('img');
    personPhotoImg.addEventListener("click",
        () => {
            showTeacherInfoPopup(teacher);
        });
    if (!isForFavorites) {
        personPhotoImg.addEventListener("click",
            () => {
                showTeacherInfoPopup(teacher);
            });


        starImg.classList.add('star');
        starImg.alt = 'star';
        starImg.src = 'images\\star.png';

        if (!favorite) {
            starImg.hidden = true;
        } else {
            renderFavoriteTeachersTemplates(favoriteTeachers);
        }
    }

    const articleElement = document.createElement('article');

    const nameText = document.createElement('p');
    nameText.className = 'nameText';
    nameText.textContent = name;
    card.appendChild(nameText);

    const surnameText = document.createElement('p');
    surnameText.className = 'surnameText';
    surnameText.textContent = surname;
    const subjectText = document.createElement('p');
    if (!isForFavorites) {
        subjectText.className = 'subjectText';
        subjectText.textContent = subject;
    }
    subjectText.textContent = teacher.course;
    card.appendChild(subjectText);
    const countryText = document.createElement('p');
    countryText.className = 'countryText';
    countryText.textContent = teacher.country;
    countryText.textContent = country;
    card.appendChild(countryText);

    photoDiv.appendChild(personPhotoImg);
    roundedPhotoDiv.appendChild(photoDiv);
    roundedPhotoDiv.appendChild(starImg);

    articleElement.appendChild(nameText);
    articleElement.appendChild(surnameText);
    articleElement.appendChild(subjectText);
    articleElement.appendChild(countryText);

    roundedPhotoDiv.appendChild(articleElement);

    return roundedPhotoDiv;
    return card;
}
// Функція для обчислення днів до наступного дня народження
function daysUntilNextBirthday(birthday) {
    const today = dayjs();
    const birthDate = dayjs(birthday);
    
    // Створюємо дату наступного дня народження в цьому році
    let nextBirthday = birthDate.year(today.year());

    // Якщо день народження вже пройшов у цьому році, додаємо рік
    if (nextBirthday.isBefore(today, 'day')) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    // Різниця в днях
    return nextBirthday.diff(today, 'day');
}

function createTeacherCardsFromArray(arrOfTeachers, teachersCardsContainer, isForFavorites) {
    arrOfTeachers.forEach((teacher) => {
        console.log('Створюємо картку для:', teacher);
        const teacherTemplate = createTeacherCardTemplate(teacher, isForFavorites);
        teachersCardsContainer.appendChild(teacherTemplate);
    });

}
let map; // Змінна для збереження карти

function showTeacherInfoPopup(teacher) {
    const teacherInfoPopupBack = document.getElementById('teacherInfoPopup');
    const teacherPhoto = document.querySelector('.teacherPhotoInfoPopup');
    const teacherName = document.querySelector('.teacherDataPopup h1');
    const subject = document.querySelector('.teacherDataPopup p:nth-child(1)');
    const location = document.querySelector('.teacherDataPopup p:nth-child(2)');
    const ageGender = document.querySelector('.teacherDataPopup p:nth-child(3)');
    const email = document.querySelector('.teacherDataPopup .email');
    const phoneNumber = document.querySelector('.teacherDataPopup p:nth-child(5)');
    const toggleMapButton = document.getElementById('toggleMapButton');
    const mapContainer = document.getElementById('mapContainer');
    const closePopupButton = document.getElementById('closePopupInfoTeacher');

    const existingDaysText = document.querySelector('.teacherDataPopup .days-to-birthday');
    if (existingDaysText) {
        existingDaysText.remove();
    }

    // Заповнення даних викладача в попапі
    teacherPhoto.src = teacher.picture_large;
    teacherName.textContent = teacher.full_name;
    subject.textContent = teacher.course;
    location.textContent = teacher.city + ", " + teacher.country;
    ageGender.textContent = `${teacher.age} years old, ${teacher.gender}`;
    email.textContent = teacher.email;
    phoneNumber.textContent = teacher.phone;

    // Показати попап
    teacherInfoPopupBack.style.display = "block";
    const { latitude, longitude } = teacher.coordinates;

    const daysToBirthdayText = document.createElement('p');
    daysToBirthdayText.className = 'days-to-birthday';
    daysToBirthdayText.textContent = `Днів до наступного ДН: ${teacher.daysToBirthday}`;
    const popupContent = document.querySelector('.teacherDataPopup');
    popupContent.appendChild(daysToBirthdayText);


    // Обробка кліку на кнопку "Toggle Map"
    toggleMapButton.onclick = () => {
        if (mapContainer.style.display === 'none') {
            mapContainer.style.display = 'block';
            initializeLeafletMap(latitude, longitude); // Використання координат конкретного викладача
        } else {
            mapContainer.style.display = 'none';
        }
    };
    closePopupButton.onclick = () => {
        teacherInfoPopupBack.style.display = "none";
        mapContainer.style.display = 'none'; // Сховати карту при закритті попапу
    };
}

function initializeLeafletMap(latitude, longitude) {
    const mapElement = document.getElementById('map');

    // Перевірка наявності вже ініціалізованої карти
    if (map) {
        map.remove(); // Видаляємо попередню карту, якщо вона існує
    }

    // Створення нової карти
    map = L.map(mapElement).setView([latitude, longitude], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Додавання маркера
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Teacher Location')
        .openPopup();
}


function removeObjectByName(array, nameToRemove) {
    // Використовуємо метод filter() для створення нового масиву, у якому об'єкти зберігаються тільки якщо ім'я не збігається з ім'ям, яке потрібно видалити
    const filteredArray = array.filter(item => item.full_name !== nameToRemove);
    return filteredArray;
}
function favoriteStarButtonClicked(teacher, favoriteStarButton) {

    if (teacher.favorite) {
        teacher.favorite = false;
        favoriteStarButton.innerHTML = '<img src="images\\star-outline.svg" alt="Star Button Not Filled">';
        favoriteTeachers = removeObjectByName(favoriteTeachers, teacher.full_name);
        renderFavoriteTeachersTemplates(favoriteTeachers);
        renderTeachersTemplates(finalArray);
    } else {
        teacher.favorite = true;
        favoriteStarButton.innerHTML = '<img src="images\\star-filled.svg" alt="Star Button Filled">';
        favoriteTeachers.push(teacher);
        renderTeachersTemplates(finalArray);
    }
}
const leftArrow = document.querySelector('.arrowButtonLeft');
const rightArrow = document.querySelector('.arrowButtonRight');
const carousel = document.querySelector('#carouselOfTeacherCards .overflow');

rightArrow.addEventListener('click', () => {
    carousel.scrollBy({ left: 200, behavior: 'smooth' });
});

leftArrow.addEventListener('click', () => {
    carousel.scrollBy({ left: -200, behavior: 'smooth' });
});


function renderTeachersTemplates(arrOfTeachers) {
    const teachersCardsContainer = document.getElementById('teachersCardsContainer');
    teachersCardsContainer.innerHTML = "";
    createTeacherCardsFromArray(arrOfTeachers, teachersCardsContainer, false);
}

function renderFavoriteTeachersTemplates(arrOfTeachers) {
    const favoriteTeachersCardsContainer = document.querySelector('#carouselOfTeacherCards .overflow');
    favoriteTeachersCardsContainer.innerHTML = "";
    if (arrOfTeachers.length !== 0) {
        createTeacherCardsFromArray(arrOfTeachers, favoriteTeachersCardsContainer, true);
    }
}


function filterObjects(array, filters) {
    return _.filter(array, item => {
        return (filters.country === 'all' || item.country === filters.country) &&
               (filters.gender === 'all' || item.gender === filters.gender) &&
               (!filters.favorite || item.favorite) &&
               (filters.age === 'all' || checkAgeFilter(item.age, filters.age));
    });
}

// Окрема функція для перевірки вікових фільтрів
function checkAgeFilter(age, ageFilter) {
    if (_.isString(ageFilter)) {
        const numbers = _.map(ageFilter.match(/\d+/g), Number);
        if (ageFilter.includes("<")) return age < numbers[0];
        if (ageFilter.includes(">")) return age > numbers[0];
        if (ageFilter.includes("-")) return age > numbers[0] && age < numbers[1];
    }
    return age === ageFilter;
}


function handleFilters(array) {
    // Отримуємо посилання на елементи фільтрації
    const ageSelect = document.getElementById('ageSelect');
    const regionSelect = document.getElementById('regionSelect');
    const sexSelect = document.getElementById('sexSelect');
    const onlyWithPhotoCheckbox = document.getElementById('onlyWithPhoto');
    const onlyFavoritesCheckbox = document.getElementById('onlyFavorites');

    // Додаємо івент-слухач для фільтрів
    ageSelect.addEventListener('change', () => applyFilters(array));
    regionSelect.addEventListener('change', () => applyFilters(array));
    sexSelect.addEventListener('change', () => applyFilters(array));
    onlyWithPhotoCheckbox.addEventListener('change', () => applyFilters(array));
    onlyFavoritesCheckbox.addEventListener('change', () => applyFilters(array));
}
function applyFilters(array) {
    const ageSelect = document.getElementById('ageSelect');
    const regionSelect = document.getElementById('regionSelect');
    const sexSelect = document.getElementById('sexSelect');
    const onlyWithPhotoCheckbox = document.getElementById('onlyWithPhoto');
    const onlyFavoritesCheckbox = document.getElementById('onlyFavorites');

    // Отримуємо значення фільтрів з елементів вводу
    const ageFilter = ageSelect.value;
    const regionFilter = regionSelect.value;
    const sexFilter = sexSelect.value;
    const onlyWithPhoto = onlyWithPhotoCheckbox.checked;
    const onlyFavorites = onlyFavoritesCheckbox.checked;

    // Створюємо об'єкт для фільтрів
    const filters = {
        age: ageFilter,
        country: regionFilter,
        gender: sexFilter,
        favorite: onlyFavorites,
        isPhoto: onlyWithPhoto,
    };

    // Фільтруємо викладачів на основі обраних фільтрів
    const filteredTeachers = filterObjects(array, filters);

    // Відображаємо відфільтрованих викладачів на сторінці
    renderTeachersTemplates(filteredTeachers);
    renderStatisticsTable(filteredTeachers);
}


function renderStatisticsTable(arr) {
    const table = document.getElementById("statisticsTable");
    const headers = table.querySelectorAll("thead th");

    // Отримайте tbody для таблиці
    const tbody = table.querySelector("tbody");

    // Функція для оновлення таблиці
    function updateTable(sortOrder, order) {

        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        // Початковий порядок сортування (за ім'ям, спеціальністю, країною та віком)

        let sortedTeacher = arr;
        sortedTeacher = sortObjects(arr, sortOrder, order);

        // Додайте відсортовані дані до таблиці
        sortedTeacher.forEach((item) => {
            const row = document.createElement("tr");
            const keys = ["full_name", "course", "age", "gender", "country"];
            keys.forEach((key) => {
                const cell = document.createElement("td");
                cell.textContent = item[key];
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    }
    let order = 1;
    // Функція для зміни sortOrder при кліку на заголовок стовпця
    function handleHeaderClick(event) {
        let clickedHeader = event.target.closest("th");
        if (!clickedHeader) return;

        // Отримайте текс з заголовка
        let headerText = clickedHeader.textContent.trim();
        let sortOrder = "";

        // Визначте sortOrder на основі тексту заголовка
        if (headerText === "Name ↓") {
            sortOrder = "full_name";
        }
        else if (headerText === "Speciality ↓") {
            sortOrder = "course";
        }
        else if (headerText === "Gender ↓") {
            sortOrder = "gender";
        }
        else if (headerText === "Age ↓") {
            sortOrder = "age";
        }
        else if (headerText === "Nationality ↓") {
            sortOrder = "country";
        }
        let arrows = document.querySelectorAll('.tableArrow');
        arrows.forEach((arrow) => {
            arrow.style.transform = `rotate(${order === 1 ? 0 : 180}deg)`;
        });
        // Оновіть таблицю
        updateTable(sortOrder, order *= -1);
    }

    // Додайте обробник подій для заголовків стовпців
    headers.forEach((header) => {
        header.addEventListener("click", handleHeaderClick);
    });

    // Початкове заповнення та сортування таблиці
    updateTable(0);
}

function handleAddTeacherButtons() {
    const addTeacherButtons = document.querySelectorAll('.addTeacherButton');
    addTeacherButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showAddTeacherPopup();
        });
    });
    const closePopupAddTeacher = document.getElementById('closePopupAddTeacher');
    closePopupAddTeacher.addEventListener("click", () => {
        const teacherPopup = document.getElementById('addTeacherPopupBack');
        teacherPopup.style.display = "none";
    });
}
function showAddTeacherPopup() {
    const teacherPopup = document.getElementById('addTeacherPopupBack');
    teacherPopup.style.display = "block";
}
function hideAddTeacherPopup() {
    const teacherPopup = document.getElementById('addTeacherPopupBack');
    teacherPopup.style.display = "none";
}

function searchTeacherByValue(arr, value) {
    return _.filter(arr, obj => {
        const lowerValue = _.toLower(value);
        return _.includes(_.toLower(obj.full_name), lowerValue) ||
               _.includes(_.toLower(obj.note), lowerValue) ||
               checkAgeFilter(obj.age, value);
    });
}

function handleSearchFieldAndButton() {
    document.querySelector('#addSpeciality').value;
    const searchButton = document.querySelector('#searchButtonClick');
    if (searchButton) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            searchTeacherButtonClicked();
        });
    }

    const clearButton = document.getElementById('clearSearchButton');

if (clearButton) {
        clearButton.addEventListener('click', () => clearSearch());
    }
}
function searchTeacherButtonClicked() {
    const searchField = document.getElementById('searchField');
    let value = searchField.value;
    let searchArray;
    if (value) {
        searchArray = searchTeacherByValue(finalArray, value);
        document.getElementById('ageSelect').value = "all";
        document.getElementById('regionSelect').value = "all";
        document.getElementById('sexSelect').value = "all";
        document.getElementById('onlyWithPhoto').checked = false;
        document.getElementById('onlyFavorites').checked = false;
        handleFilters(searchArray);
        renderTeachersTemplates(searchArray);
        renderStatisticsTable(searchArray);
    }



}
// Збираємо дані з форми та додаємо викладача до списку
function createUserObject() {
    // Отримуємо значення з полів форми
    const name = document.querySelector('.addName').value;
    const speciality = document.querySelector('#addSpeciality').value;
    const country = document.querySelector('.addCountry').value;
    const city = document.querySelector('.addCity').value;
    const email = document.querySelector('.addEmail').value;
    const phone = document.querySelector('.addPhone').value;
    const dateOfBirth = document.querySelector('.addDate').value;
    const gender = document.querySelector('input[name="sex"]:checked').value;
    const notes = document.querySelector('.addNotes').value;
    const daysToBirthday = daysUntilNextBirthday(dateOfBirth);

    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();


    const newTeacher = {
        full_name: name,
        course: speciality,
        country: country,
        city: city,
        email: email,
        phone: phone,
        age: age,
        gender: gender,
        note: notes,
        daysToBirthday: daysToBirthday,
        picture_large: gender === "male" ? "images/male-default.svg" : "images/female-default.svg",
        favorite: false
    };

    // Додаємо викладача до масиву
    finalArray.push(newTeacher);

    // Оновлюємо відображення викладачів
    renderTeachersTemplates(finalArray);
    renderStatisticsTable(finalArray);


    hideAddTeacherPopup();
}

document.querySelector('.addTeacherButton').addEventListener('click', showAddTeacherPopup);
document.querySelector('#closePopupAddTeacher').addEventListener('click', hideAddTeacherPopup);


document.querySelector('#addTeacherForm').addEventListener('submit', (event) => {
    event.preventDefault();  // Зупиняємо стандартну відправку форми
    createUserObject();
});


function sortTableByColumn(array, columnKey, ascending) {
    return array.sort((a, b) => {
        let valueA = a[columnKey];
        let valueB = b[columnKey];


        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
        }
        if (typeof valueB === 'string') {
            valueB = valueB.toLowerCase();
        }


        if (valueA < valueB) return ascending ? -1 : 1;
        if (valueA > valueB) return ascending ? 1 : -1;
        return 0;
    });
}


function updateStatisticsTable(sortedArray) {
    const tbody = document.querySelector('#statisticsTable tbody');
    tbody.innerHTML = '';  // Очищаємо старі рядки

    sortedArray.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.full_name}</td>
            <td>${item.course}</td>
            <td>${item.age}</td>
            <td>${item.gender}</td>
            <td>${item.country}</td>
        `;
        tbody.appendChild(row);
    });
}


function handleTableSort() {
    const nameHeader = document.querySelector('#nameHeader');
    let currentSortDirection = true;  // true для зростання, false для спадання

    nameHeader.addEventListener('click', () => {
        console.log('Сортування по колонці "Name"');

        // Зміна напряму сортування
        currentSortDirection = !currentSortDirection;

        // Оновлення стрілки
        const arrow = nameHeader.querySelector('.tableArrow');
        arrow.textContent = currentSortDirection ? '↓' : '↑';

        // Сортуємо масив та оновлюємо таблицю
        const sortedArray = sortTableByColumn(finalArray, 'full_name', currentSortDirection);
        updateStatisticsTable(sortedArray);
    });
    const ageHeader = document.querySelector('#ageHeader');
    ageHeader.addEventListener('click', () => {
        console.log('Сортування по колонці "Age"');
        currentSortDirection = !currentSortDirection;
        const arrow = ageHeader.querySelector('.tableArrow');
        arrow.textContent = currentSortDirection ? '↓' : '↑';
        const sortedArray = sortTableByColumn(finalArray, 'age', currentSortDirection);
        updateStatisticsTable(sortedArray);
    });
    const genderHeader = document.querySelector('#genderHeader');
    genderHeader.addEventListener('click', () => {
        console.log('Сортування по колонці "Gender"');
        currentSortDirection = !currentSortDirection;
        const arrow = genderHeader.querySelector('.tableArrow');
        arrow.textContent = currentSortDirection ? '↓' : '↑';
        const sortedArray = sortTableByColumn(finalArray, 'gender', currentSortDirection);
        updateStatisticsTable(sortedArray);
    });
    const nationalityHeader = document.querySelector('#nationalityHeader');
    nationalityHeader.addEventListener('click', () => {
        console.log('Сортування по колонці "Nationality"');
        currentSortDirection = !currentSortDirection;
        const arrow = nationalityHeader.querySelector('.tableArrow');
        arrow.textContent = currentSortDirection ? '↓' : '↑';
        const sortedArray = sortTableByColumn(finalArray, 'country', currentSortDirection);
        updateStatisticsTable(sortedArray);
    });
    const specialityHeader = document.querySelector('#specialityHeader');
    specialityHeader.addEventListener('click', () => {
        console.log('Сортування по колонці "Speciality"');
        currentSortDirection = !currentSortDirection;
        const arrow = specialityHeader.querySelector('.tableArrow');
        arrow.textContent = currentSortDirection ? '↓' : '↑';
        const sortedArray = sortTableByColumn(finalArray, 'course', currentSortDirection);
        updateStatisticsTable(sortedArray);
    });

}


function handleAddButtonForm() {
    const addForm = document.getElementById('addTeacherForm');
    addForm.addEventListener("submit", (event) => {
        event.preventDefault();
        createUserObject();
    });
}
//повертає true, якщо дублікату не знайдено
function checkForDublicate(arr, user) {
    for (const obj of arr) {
        if (obj.full_name === user.full_name) {
            return false;
        }
    }
    return true;
}

async function fetchRandomTeachers(numOfTeachers) {
    const url = `https://randomuser.me/api/?results=${numOfTeachers}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Помилка при виконанні запиту');
        }

        const data = await response.json();
        const users = data.results;

        // Форматуємо отриманих користувачів і додаємо їх до масиву
        for (let user of users) {
            const formattedUser = formatUser(user);
            if (checkForDublicate(finalArray, formattedUser)) {
                finalArray.push(formattedUser);
            }
        }

        // Відображаємо користувачів
        renderTeachersTemplates(finalArray);
        renderStatisticsTable(finalArray);

    } catch (error) {
        console.error('Помилка при отриманні даних:', error);
    }
}

function renderStatisticsChart(arr) {
    const ctx = document.getElementById('statisticsChart').getContext('2d');

    // Підрахунок кількості викладачів за предметами
    const subjectCounts = {};
    arr.forEach(item => {
        subjectCounts[item.course] = (subjectCounts[item.course] || 0) + 1;
    });

    // Підготовка даних для кругової діаграми
    const labels = Object.keys(subjectCounts);
    const data = Object.values(subjectCounts);

    // Додамо більше унікальних кольорів
    const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#66FF66', '#FF6666', '#66CCFF', '#FFB266',
        '#FF33CC', '#33FF99', '#FF6633', '#33CCFF', '#996600'
    ];

    // Створення кругової діаграми
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Subjects Distribution',
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length), // Унікальні кольори для кожного сектора
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribution of Subjects'
                }
            }
        }
    });
}

function updateStatistics() {
    renderStatisticsTable(finalArray);
    renderStatisticsChart(finalArray);
}
function fetchUser(formatedUser) {
    try {

        // Виконання запиту за допомогою fetch
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: 'Alice Johnson',
                age: 22,
                course: 'Computer Science'
            }),
        })
            .then(response => response.json())
            .then(data => console.log('User added:', data))
            .catch(error => console.error('Error:', error));

    } catch (error) {
        console.error("Все погано, Помилка при відправленні даних:", error);
    }
}
function handleTenMoreButton() {
    const tenMoreButt = document.getElementById("tenMoreButton");
    tenMoreButt.addEventListener("click", () => {
        fetchRandomTeachers(10);
    })

}
window.onload = () => {
    fetchRandomTeachers(50).then(() => {
        handleTableSort();
        updateStatistics();
        handleFilters(finalArray);
        handleSearchFieldAndButton();
        handleAddButtonForm();
        handleAddTeacherButtons();
    });
    handleTenMoreButton();
};


