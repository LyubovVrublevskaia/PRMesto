import { validationSettings } from './index.js'

//Показывает сообщение об ошибке
const showInputError = (popupElement, inputElement, errorMessage) => {
	const errorElement = popupElement.querySelector(`.${inputElement.id}-error`)
	inputElement.classList.add(validationSettings.inputErrorClass)
	errorElement.textContent = errorMessage
	errorElement.classList.add(validationSettings.errorClass)
}

//Скрывает сообщение об ошибке
const hideInputError = (popupElement, inputElement) => {
	const errorElement = popupElement.querySelector(`.${inputElement.id}-error`)
	inputElement.classList.remove(validationSettings.inputErrorClass)
	errorElement.classList.remove(validationSettings.errorClass)
	errorElement.textContent = ''
}

//Проверяет валидность ввода
const isValid = (popupElement, inputElement) => {
	if (!inputElement.validity.valid) {
		showInputError(popupElement, inputElement, inputElement.validationMessage)
	} else {
		hideInputError(popupElement, inputElement)
	}
}

//Невалидный ввод
const hasInvalidInput = inputList => {
	return inputList.some(inputElement => {
		return !inputElement.validity.valid
	})
}

//Переключает состояние кнопки
export const toggleButtonState = (inputList, buttonElement) => {
	
	if (hasInvalidInput(inputList)) {
		buttonElement.classList.add(validationSettings.inactiveButtonClass)
		buttonElement.disabled = true
	} else if (buttonElement.dataset.isLoading != 'true') {
		console.log(buttonElement.dataset.isLoading)
		buttonElement.classList.remove(validationSettings.inactiveButtonClass)
		buttonElement.disabled = false
	}
}

//Устанавливает события на каждый элемент
const setEventListeners = popupElement => {
	const inputList = Array.from(
		popupElement.querySelectorAll(validationSettings.inputSelector)
	)
	const buttonElement = popupElement.querySelector(
		validationSettings.submitButtonSelector
	)
	inputList.forEach(inputElement => {
		inputElement.addEventListener('input', () => {
			isValid(popupElement, inputElement)
			toggleButtonState(inputList, buttonElement)
		})
	})
}

//Сбрасывает процесс валидации
export const resetForm = popupElement => {
	const inputList = Array.from(
		popupElement.querySelectorAll(validationSettings.inputSelector)
	)
	const buttonElement = popupElement.querySelector(
		validationSettings.submitButtonSelector
	)
	inputList.forEach(inputElement => {
		inputElement.value = ''
		hideInputError(popupElement, inputElement)
	})
}

//Запускает процесс валидации
export const enableValidation = () => {
	const popupList = Array.from(
		document.querySelectorAll(validationSettings.formSelector)
	)
	popupList.forEach(popupElement => {
		setEventListeners(popupElement)
	})
}
