"use strict";

// создаём окошко с сообщением
var form = document.querySelector(".form");
var divError = document.createElement("div");
divError.id = "pop-up-window";
const ERROR_TIMER = 5000;	// время через которое удалиться сообщение error

function messageError(message) {
	if(message) {
		divError.innerHTML = message;
	}
	messageOpen();
	setTimeout( () => {
		divError.style.display = "none";
	}, ERROR_TIMER);
}

function messageOpen() {
	divError.setAttribute("data-info", "info");
	divError.style.display = "block";
	form.appendChild(divError);
}
// Если введено значение, label не возвращаеться обратно
function noValueLabelStop(link, value) {
	var selectLink = document.querySelectorAll(link);
	selectLink.forEach((elem) => {
		if(!(value == "") && !(value == NaN)) {
			elem.classList.add("out-of-focus");
		}else {
			elem.classList.remove("out-of-focus");
		}
	})
}
// проверяем что введено число
function inputValue(value) {
	if(isNaN(value)) {
		messageError("Введите число!"); 
	}
	return value;
}
// проверяем что введённое значение не более заданного числа
function notMoreValue(value, number, message) {
	if(value > number) {
		messageError(message);
	}
	return value;
}

// Когда теряем фокус
var input = document.querySelectorAll("input[type=text]");
input.forEach((item) => {
	var allInput = item;
	allInput.addEventListener("blur", notFocus);
});

var passengersValue;	// пассажиры
var linenValue;			// Постельное бельё
var teaValue;			// чай
var dinnerValue;		// обед
var distanceValue;		// расстояние
const NUMBER_TEA = 14;		// количество чая

function notFocus() {
	passengersValue = +passengers.value;
	linenValue = +linen.value;
	teaValue = +tea.value;
	dinnerValue = +dinner.value;
	distanceValue = +distance.value;

	passengersValue = inputValue(passengersValue);
	distanceValue = inputValue(distanceValue);

	linenValue = notMoreValue(inputValue(linenValue), passengersValue, "Постельного белья не должно быть больше количества пассажиров!");
	teaValue = notMoreValue(inputValue(teaValue), NUMBER_TEA, "Чая не больше " + NUMBER_TEA + " шт!");
	dinnerValue = notMoreValue(inputValue(dinnerValue), passengersValue, "Обедов не должно быть больше количества пассажиров!");

	noValueLabelStop("#passengers + .label-text", passengersValue);
	noValueLabelStop("#linen + .label-text", linenValue);
	noValueLabelStop("#tea + .label-text", teaValue);
	noValueLabelStop("#dinner + .label-text", dinnerValue);
	noValueLabelStop("#distance + .label-text", distanceValue);
}
// Отправляем форму
var submit = document.querySelector(".submit");
function submitValueForm(event) {
	var radioName = document.getElementsByName("wagon");
	// узнаём выбранный radio button
	radioName.forEach((elem)  => {
		if (elem.checked) {
			radioName = elem.value;
 		}
	});
	var objRadio = {
	  SV: 44,
	  Cupe: 32,
	  Plac: 18,
	  Sit: 16
	};
	if(radioName in objRadio) {
		var selectedRadioValue = objRadio[radioName];
	}
	const SUM_LINENS = 4; // Сумма белья
	const SUM_TEA = 2; // Сумма чая
	const SUM_DINNER = 5; // Сумма обеда
	const SUM_MILEAGE = 0.10;  // Сумма километража
	const NUMBER_DISCOUNT = 0.2; // Скидка 20%
	// сумма
	var total = (passengersValue * selectedRadioValue) + (linenValue * SUM_LINENS) + (teaValue * SUM_TEA) + (dinnerValue * SUM_DINNER) + (distanceValue * SUM_MILEAGE);
	// создаёт сообщение с "подтверждением заказа"
	function ConfirmOrder() {
		var listTemplateConfirm = document.getElementById("list-template-confirm").innerHTML;
		var template = Handlebars.compile(listTemplateConfirm);
		var listContent = template({
			name: "Подтвердите заказ!",
			list: [
				{item: `Количество пассажиров: ${passengersValue} чел`},
				{item: `Количество комплектов постельного белья: ${linenValue} шт`},
				{item: `Тип вагона: ${radioName}`},
				{item: `Количество чая: ${teaValue} шт`},
				{item: `Количество обедов: ${dinnerValue} шт`},
				{item: `Расстояние между городами: ${distanceValue} км`},
				{item: `Всего к оплате -  ${total}  грн`}
			]
		});
		divError.innerHTML = listContent;
		messageOpen();
	}
	ConfirmOrder();
	// клик по кнопке ok
	var ok = document.querySelector(".ok");
	function paymentOk(event) {
		messageError(`Оплата подтверждена -  ${total}  грн`);
	}
	ok.addEventListener("click", paymentOk);
	// клик по кнопке no
	var no = document.querySelector(".no");
	function paymenNo(event) {

		function discountMessage() {
			var listTemplateConfirm = document.getElementById("list-template-confirm").innerHTML;
			var template = Handlebars.compile(listTemplateConfirm);
			var listContent = template({
				name: "Вы можете приобрести данные услуги со скидкой 20%!"
			});
			divError.innerHTML = listContent;
			messageOpen();
		}
		discountMessage();
		// если согласен на скидку
		var ok = document.querySelector(".ok");
		function discountOk() {
			var discount = Math.round(total * NUMBER_DISCOUNT);
			var totalDiscount = Math.round(total - discount);
			// создаёт сообщение с "подтверждением заказа со скидкой"
			function discountMessageTotal() {
				var listTemplateAlert = document.getElementById("list-template-alert").innerHTML;
				var templateAlert = Handlebars.compile(listTemplateAlert);
				var listContent = templateAlert({
					name: "Оплата подтверждена!",
					list: [
						{item: `Скидка составила - ${discount} грн`},
						{item: `К оплате услуг со скидкой состовляет - ${totalDiscount}  грн`}
					]
				});
				divError.innerHTML = listContent;
				messageError();
			}
			discountMessageTotal();
		}
		ok.addEventListener("click", discountOk);
		// если не согласен на скидку
		var no = document.querySelector(".no");
		function discountNo() {

			function MessageClosePayment() {
				var listTemplateAlert = document.getElementById("list-template-alert").innerHTML;
				var templateAlert = Handlebars.compile(listTemplateAlert);
				var listContent = templateAlert({
					name: "Ваш заказ удален!",
					list: [
						{item: `Досвидания!`}
					]
				});
				divError.innerHTML = listContent;
				messageError();
			}
			MessageClosePayment();
			
		}
		no.addEventListener("click", discountNo);
		event.preventDefault();
	}
	no.addEventListener("click", paymenNo);
	event.preventDefault();
}
submit.addEventListener("click", submitValueForm);