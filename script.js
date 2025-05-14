document.addEventListener('DOMContentLoaded', function() {
    // Основной контейнер для вертикальной прокрутки
    const sliderContainer = document.querySelector('.slider-container');
    const allSlides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    // Горизонтальные слайдеры
    const historySlider = document.querySelector('.history-slider');
    const historySlides = historySlider.querySelectorAll('.slide');
    
    const vicinitySlider = document.querySelector('.vicinity-slider');
    const vicinitySlides = vicinitySlider.querySelectorAll('.slide');
    
    let historyIndex = 0;
    let vicinityIndex = 0;
    let isScrolling = false;
    let currentSlideIndex = 0;
    
    // Отображение текущей активной точки в консоли для отладки
    console.log('Инициализация: текущий слайд', currentSlideIndex);
    
    // Массив всех слайдов для последовательной прокрутки
    const allSlidesArray = [
        document.querySelector('#slide1'),
        ...Array.from(historySlides),
        document.querySelector('#slide5'),
        document.querySelector('#slide6'),
        ...Array.from(vicinitySlides)
    ];
    
    // Функция для обновления активной точки пагинации
    function updateActiveDot() {
        // Удаляем класс active со всех точек
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Определяем индекс точки
        let dotIndex = currentSlideIndex;
        
        // Проверяем границы
        if (dotIndex >= 0 && dotIndex < dots.length) {
            dots[dotIndex].classList.add('active');
            console.log('Активная точка:', dotIndex, 'для слайда', currentSlideIndex);
        } else {
            console.log('Ошибка: нет точки для индекса', dotIndex);
        }
    }
    
    // Горизонтальная прокрутка истории города
    function scrollHistoryHorizontal(index) {
        if (index >= 0 && index < historySlides.length) {
            historySlides[index].scrollIntoView({ behavior: 'smooth', inline: 'start' });
            historyIndex = index;
            currentSlideIndex = index + 1; // +1 потому что индексы начинаются с 0, а первый слайд - главная страница
            console.log('Горизонтальная прокрутка истории к слайду', currentSlideIndex);
            updateActiveDot();
        }
    }
    
    // Горизонтальная прокрутка окрестностей
    function scrollVicinityHorizontal(index) {
        if (index >= 0 && index < vicinitySlides.length) {
            vicinitySlides[index].scrollIntoView({ behavior: 'smooth', inline: 'start' });
            vicinityIndex = index;
            currentSlideIndex = index + 6; // +6 потому что до окрестностей 6 слайдов
            console.log('Горизонтальная прокрутка окрестностей к слайду', currentSlideIndex);
            updateActiveDot();
        }
    }
    
    // Обработчики для горизонтальной прокрутки истории
    document.querySelectorAll('.history-next').forEach(next => {
        next.addEventListener('click', function(e) {
            e.preventDefault();
            scrollHistoryHorizontal(historyIndex + 1);
        });
    });
    
    document.querySelectorAll('.history-prev').forEach(prev => {
        prev.addEventListener('click', function(e) {
            e.preventDefault();
            scrollHistoryHorizontal(historyIndex - 1);
        });
    });
    
    // Обработчики для горизонтальной прокрутки окрестностей
    document.querySelectorAll('.vicinity-next').forEach(next => {
        next.addEventListener('click', function(e) {
            e.preventDefault();
            scrollVicinityHorizontal(vicinityIndex + 1);
        });
    });
    
    document.querySelectorAll('.vicinity-prev').forEach(prev => {
        prev.addEventListener('click', function(e) {
            e.preventDefault();
            scrollVicinityHorizontal(vicinityIndex - 1);
        });
    });
    
    // Функция для прокрутки к слайду
    function scrollToSlide(index) {
        if (index < 0 || index >= allSlidesArray.length) return;
        
        isScrolling = true;
        currentSlideIndex = index;
        console.log('Прокрутка к слайду', index);
        
        // Если индекс соответствует слайдам истории города (индексы 1, 2, 3)
        if (index >= 1 && index <= 3) {
            // Сначала скроллим к горизонтальному слайдеру истории
            historySlider.scrollIntoView({ behavior: 'smooth' });
            
            // Затем скроллим внутри горизонтального слайдера к нужному слайду
            setTimeout(() => {
                scrollHistoryHorizontal(index - 1);
                setTimeout(() => {
                    isScrolling = false;
                }, 1);
            }, 50);
        }
        // Если индекс соответствует слайдам окрестностей (индексы 6, 7, 8)
        else if (index >= 6 && index <= 8) {
            // Сначала скроллим к горизонтальному слайдеру окрестностей
            vicinitySlider.scrollIntoView({ behavior: 'smooth' });
            
            // Затем скроллим внутри горизонтального слайдера к нужному слайду
            setTimeout(() => {
                scrollVicinityHorizontal(index - 6);
                setTimeout(() => {
                    isScrolling = false;
                }, 1);
            }, 50);
        }
        // Для обычных вертикальных слайдов
        else {
            // Скроллим к обычному вертикальному слайду
            allSlidesArray[index].scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
        
        updateActiveDot();
    }
    
    // Обработчик колесика мыши для последовательной прокрутки всех слайдов
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            // Прокрутка вниз - следующий слайд
            if (currentSlideIndex < allSlidesArray.length - 1) {
                scrollToSlide(currentSlideIndex + 1);
            }
        } else {
            // Прокрутка вверх - предыдущий слайд
            if (currentSlideIndex > 0) {
                scrollToSlide(currentSlideIndex - 1);
            }
        }
    }, { passive: false });
    
    // Обработчик клика по точкам пагинации
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по точке с индексом', index);
            scrollToSlide(index);
        });
    });
    
    // Функция для плавной прокрутки при клике на ссылки навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Исключаем кнопки навигации внутри слайдеров
            if (!this.classList.contains('history-prev') && 
                !this.classList.contains('history-next') && 
                !this.classList.contains('vicinity-prev') && 
                !this.classList.contains('vicinity-next')) {
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                console.log('Клик по ссылке на', targetId);
                
                // Маппинг идентификаторов слайдов к индексам в массиве allSlidesArray
                const slideMap = {
                    '#slide1': 0,
                    '#slide2': 1,
                    '#slide3': 2,
                    '#slide4': 3,
                    '#slide5': 4,
                    '#slide6': 5,
                    '#slide7': 6,
                    '#slide8': 7,
                    '#slide9': 8
                };
                
                if (slideMap.hasOwnProperty(targetId)) {
                    scrollToSlide(slideMap[targetId]);
                }
            }
        });
    });
    
    // Инициализация
    updateActiveDot();
});