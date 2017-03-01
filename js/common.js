"use strict";

// создаём окошко с ошибкой
var form = document.querySelector(".form");
var divError = document.createElement("div");
var errorTimer = 5000;

function messageError(message) {
	divError.setAttribute("data-error", "error");
	divError.innerHTML = message;
	divError.style.display = "block";
	form.appendChild(divError);
	setTimeout( () => {
		divError.style.display = "none";
	}, errorTimer);
}

// окошко для введённых значений в инпуты
var buttonOk = document.createElement("button");
var buttonNo = document.createElement("button");

function messageInfo(message) {
	divError.setAttribute("data-error", "error");
	divError.innerHTML = message;
	divError.style.display = "block";

	buttonOk.innerHTML = "ок";
	buttonOk.classList.add("submit", "ok");
	divError.appendChild(buttonOk);

	buttonNo.innerHTML = "отмена";
	buttonNo.classList.add("submit", "no");
	divError.appendChild(buttonNo);

	form.appendChild(divError);
}

// проверяем что введено число
function inputValue(inputID) {
	if(isNaN(inputID)) {
		messageError("Ведите число!"); 
	}
	return inputID;
}

// проверяем что введённое значение не более number
function notMoreValue(inputID, number, message) {
	if(inputID > number) {
		messageError(message);
	}
	return inputID;
}
// узнаём выбранный radio button
var selectedValue;

function radioValue(inputRadioName) {
	for (var i = 0; i < inputRadioName.length; i++) {
		if (inputRadioName[i].checked) {
			return selectedValue = inputRadioName[i].value;
		}
	}	
}

// если переключаем фокус выводит сообщение об ошибке
var input = document.querySelectorAll("input[type=text]");
for(var i = 0; i < input.length; i++) {
	var allInput = input[i];
	allInput.addEventListener("blur", notFocus);
}

var passengersValue;	// пассажиры
var linenValue;			// Постельное бельё
var teaValue;			// чай
var dinnerValue;		// обед
var distanceValue;		// расстояние

function notFocus() {
	passengersValue = +passengers.value;
	linenValue = +linen.value;
	teaValue = +tea.value;
	dinnerValue = +dinner.value;
	distanceValue = +distance.value;

	passengersValue = inputValue(passengersValue);
	distanceValue = inputValue(distanceValue);

	linenValue = notMoreValue(inputValue(linenValue), passengersValue, "Постельного белья не должно быть больше количества пассажиров!");
	teaValue = notMoreValue(inputValue(teaValue), 20, "Чая не больше 20 шт!");
	dinnerValue = notMoreValue(inputValue(dinnerValue), passengersValue, "Обедов не должно быть больше количества пассажиров!");
}

// при клике на button
var submit = document.querySelector(".submit");

function submitValueForm(event) {
	// находим свойство и значение - типа вагона
	var radioName = document.getElementsByName("wagon");
	var radioName = radioValue(radioName);
	var objRadio = {
	  SV: 44,
	  Cupe: 32,
	  Plac: 18,
	  Sit: 16
	};
	if(radioName in objRadio) {
		var selectedRadioValue = objRadio[radioName];
	}

	var sumLinens = 4; // Сумма белья
	var sumTea = 2; // Сумма чая
	var sumDinner = 5; // Сумма обеда
	var sumMileage = 0.10;  // Сумма километража
	var numberDiscount = 0.2; // Скидка 20%

	// сумма
	var total = (passengersValue * selectedRadioValue) + (linenValue * sumLinens) + (teaValue * sumTea) + (dinnerValue * sumDinner) + (distanceValue * sumMileage);
	// сообщение "итого"
	messageInfo(`<h2>Подтвердите заказ!</h2> <p>Количество пассажиров: ${passengersValue} чел</p> <p>Количество комплектов постельного белья: ${linenValue} шт</p> <p>Тип вагона: ${radioName} </p> <p>Количество чая: ${teaValue} шт</p> <p>Количество обедов: ${dinnerValue} шт</p> <p>Расстояние между городами: ${distanceValue} км</p> <p>Всего к оплате -  ${total}  грн</p>`);

	// клик по кнопке ok
	var ok = document.querySelector(".ok");
	function clickOn(event) {
		messageError(`Оплата подтверждена -  ${total}  грн`);
	}
	ok.addEventListener("click", clickOn);

	// клик по кнопке no
	var no = document.querySelector(".no");
	function clickNo(event) {
		messageInfo("Вы можете приобрести данные услуги со скидкой 20%");

		// второй клик по кнопке ok
		function clickOk() {
			var discount = Math.round(total * numberDiscount);
			var totalDiscount = Math.round(total - discount);
			messageError(`<p>Скидка составила - ${discount} грн</p> <p>К оплате услуг со скидкой состовляет - ${totalDiscount}  грн</p>`);
		}
		ok.addEventListener("click", clickOk);

		// второй клик по кнопке no
		function clickNo() {
			messageError("<p>Ваш заказ удален!</p> <p>Досвидания!</p>");
		}
		no.addEventListener("click", clickNo);

		event.preventDefault();
	}
	no.addEventListener("click", clickNo);

	event.preventDefault();
}
submit.addEventListener("click", submitValueForm);