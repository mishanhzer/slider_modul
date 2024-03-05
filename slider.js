
// Деструктуризируем - меняем селекторы на аргументы функции slider с помощью обьекта
function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

    // Slider 
	const slides = document.querySelectorAll(slide), // Подставляем аргумент slide (при вызове в script.js будет вызваться значение ключа slide - '.offer__slide'
		prev = document.querySelector(prevArrow), 
		next = document.querySelector(nextArrow), 

		total = document.querySelector(totalCounter), 
		current = document.querySelector(currentCounter), 
		slidesWrapper = document.querySelector(wrapper), 
		slidesField = document.querySelector(field), 
		width = window.getComputedStyle(slidesWrapper).width; 

	const slider = document.querySelector(container); // Подставляем аргумент container (при вызове в script.js будет вызваться значение ключа container - '.offer__slider'
	slider.style.position = 'relative'; 
	const dots = []; 

	let slideIndex = 1; 
	let offset = 0; 

	if (slides.length < 10) { 
		total.textContent = `0${slides.length}`; 
		current.textContent = `0${slideIndex}`; 
	} else {
		total.textContent = slides.length; 
		current.textContent = slideIndex; 
	}


	slidesField.style.width = 100 * slides.length + '%'; // меняем ширину карусели (100 * количество слайдов) - 400%
	slidesField.style.display = 'flex'; // Карусель делаем в флексбокс (чтобы слайды стали горизонтально)
	slidesField.style.transition = '0.5s all'; // добавляем карусели плавный переход 

	slidesWrapper.style.overflow = 'hidden'; // Все выходит за пределы обертки делаем невидимым


	slides.forEach(slide => { // слайдам делаем фиксированную ширину в 650px (если этого не делать и без флексбокса и хиддена, ширина будет занимать все ширинку карусели - 2600px)
		slide.style.width = width;
	});


	// Выводим повторяющийся функционал в отдельные функции
		// Функция добавления класса активности точкам (работа с массивом)
		function dotActive() {
			dots.forEach(dot => dot.style.opacity = '.5'); // перебираем массив и меняем прозрачность всем точкам на 0.5
			dots[slideIndex - 1].style.opacity = 1; // Первой точке и последующим при клике (будет менять прозрачность на 1 - на активную точку)
		}

		// Функция добавления текущего слайда на страницу
		function currentOnPage() {
			if (slides.length < 10) { // если количество слайдов меньше 10
				current.textContent = `0${slideIndex}`; // То вставляем на страницу с 0
			} else { // если меньше 10 
				current.textContent = slideIndex; // То вставялем на сраницу без 0
			}
		}

	// Создаем обертку для наших точек
	const dotsWrapper = document.createElement('ol'); // создаем обертку - элемент ordered-list
	dotsWrapper.classList.add('carousel-indicators'); // добавляем ему класс
	slider.append(dotsWrapper); // помещаем его внутрь слайдера

	// Создаем новые элементы (точки) с помощью цикла
	for (let i = 0; i < slides.length; i++) { // цикл (i меньше количества слайдов)
		const dot = document.createElement('li'); // создаем точки (list-item)
		dot.setAttribute('data-slide-to', i + 1); // устанавливаем data атрибут точкам со значением i + 1 (0 + 1) - чтобы потом его сопоставить с текущим слайдом на странице
		dot.classList.add('dot'); // устанавливаем класс для точек
		if (i == 0) { // условие (если i == 0 - первая точка)
			dot.style.opacity = 1; // меняем класс прозрачности (делаем первый элемент активным)
		}
		dotsWrapper.append(dot); // устанавливаем точки внутрь нашего списка
		dots.push(dot); // пушим в массив наши точки
	}

	function deleteNotDigits(str) { // добавляем функцию (удаляем не числа с помощью регулярки)
		return +str.replace(/\D/g, '');
	}


	next.addEventListener('click', (e) => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)) { // Условие (если ширина (переводим в number и отрезаем пиксели) умноженная на количество слайдов - 1 (это последний слайд в массиве слайдов, именно его номер - получается, что первый слайд идет в ширину 650px и когда смещаемся на 1950px, при следующем клике сработает наше условие) - "мы долистали до конца слайдера и пора вернуть его к первому слайду"
			offset = 0; // тогда возвращаем карусель заново
		} else { // Если не поледний слайд
			offset += deleteNotDigits(width); // Добавляем offset (смещение) ширину без пикселей
		}
		slides.forEach(item => {
			item.classList.remove('hide');
		});

		slidesField.style.transform = `translateX(-${offset}px)`; // перемещаем карусель (вправо это будет -X (-650px)) - ориентируемся по оси Х (влево минус, вправо плюс)

		if (slideIndex == slides.length) { // если текущий слайд будет равен последнему слайду
			slideIndex = 1; // то переместимся на первый слайд
		} else { // если не дошел до конца слайдера (не последий слайд)
			slideIndex++; // то прибавляем slideIndex на 1
		}

		// Добавляем текущий слайд на страницу
		currentOnPage();

		// Добавление активности точкам в зависимости от кнопки на которую нажали
		dotActive();
	});


	prev.addEventListener('click', () => {
		if (offset == 0) { // Условие (если offset будет равен 0, то при клике на кнопку предыдущего слайдера будет срабатывать условие)
			offset = deleteNotDigits(width) * (slides.length - 1); // тогда возвращаем слайдер в последний слайд (offset 1950px - cмещение на 1950px - на последний слайд)
		} else { // Если не первый слайд
			offset -= deleteNotDigits(width); // у offset (смещения) отнимаем ширину (- на - будет давать +)
		}
		slides.forEach(item => {
			item.classList.remove('hide');
		});

		slidesField.style.transform = `translateX(-${offset}px)`; // Перемещаем карусель (Влево это будет - (-650px) - минус на минус плюс = +650px) 

		if (slideIndex == 1) { // если у нас первый слайд
			slideIndex = slides.length; // То меняем slideIndex на количетсво всех слайдов (то есть перемещаемся в конец слайдера)
		} else { // Если не первый слайд
			slideIndex--; // То мы уменьшаем наш slideIndex на 1
		}

		// Добавляем текущий слайд на страницу
		currentOnPage();

		// Добавление активности точкам в зависимости от кнопки на которую нажали
		dotActive();

	});

	dots.forEach(dot => { // перебираем массив
		dot.addEventListener('click', (e) => { // вешаем обработчик событий на отдельную точку
			const slideTo = e.target.getAttribute('data-slide-to'); // помещаем в переменную (наше значение data-slide-to)
	
			slideIndex = slideTo; // меняем наш slideIndex на значение в data атрибуте (кликнули на 4 точку и в slideIndex пойдет значение 4)
			offset = deleteNotDigits(width) * (slideTo - 1); // получение offset (ширину умножаем на slideTo - 1) - смещение на определенную ширину (нажали на 3 кнопку - ширину 650 * 2 = 1300px, на 4 кнопку - 650 * 3 = 1950px) 
	
			slidesField.style.transform = `translateX(-${offset}px)`; // добавляем смещение слайдера 
	
			// Добавляем текущий слайд на страницу
			currentOnPage();
	
			// Добавление активности точкам в зависимости от кнопки на которую нажали
			dotActive();
		});
	});
}

export default slider;