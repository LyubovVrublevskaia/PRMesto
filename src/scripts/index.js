import '../images/add-icon.svg'
import '../images/card_1.jpg'
import '../images/card_2.jpg'
import '../images/card_3.jpg'
import '../images/close.svg'
import '../images/delete-icon.svg'
import '../images/edit-icon.svg'
import '../images/like-active.svg'
import '../images/like-inactive.svg'
import '../images/logo.svg'
import '../images/avatar.jpg'
import '../vendor/fonts/Inter-Black.woff2'
import '../vendor/fonts/Inter-Medium.woff2'
import '../vendor/fonts/Inter-Regular.woff2'
import '../pages/index.css'
import './validate.js'
import './cards.js'
import './modal.js'
import './api.js'

import { enableValidation, toggleButtonState } from './validate.js'
import { openModal, closeModal, closeByEsc } from './modal.js'
import { placesList, createCard } from './cards.js'
import {
	getProfileInfo,
	getInitialCards,
	editProfile,
	addNewCard,
	updateAvatar,
} from './api.js'

const profilePopup = document.querySelector('.popup_type_edit')
const cardPopup = document.querySelector('.popup_type_new-card')
const avatarPopup = document.querySelector('.popup_type_avatar')
const avatarButton = document.querySelector('.profile__image-edit')
const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const closeButtonEdit = profilePopup.querySelector('.popup__close')
const closeButtonCard = cardPopup.querySelector('.popup__close')
const closeButtonAvatar = avatarPopup.querySelector('.popup__close')
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')

export let currentUserId = null
export let popup = document.querySelectorAll('.popup')

//Добавление анимации каждой карточке
popup.forEach(item => {
	item.classList.add('popup_is-animated')
})

const promises = [getProfileInfo(), getInitialCards()]

//Одновременный вызов двух промисов
Promise.all(promises)
	.then(results => {
		const [profileInfo, initialCards] = results

		currentUserId = profileInfo._id
		document.querySelector('.profile__title').textContent = profileInfo.name
		document.querySelector('.profile__description').textContent =
			profileInfo.about
		const profileAvatar = document.querySelector('.profile__image')
		profileAvatar.style.backgroundImage = `url(${profileInfo.avatar})`

		initialCards.forEach(function (item) {
			const cardElement = createCard(
				item.name,
				item.link,
				item.likes.length,
				item._id,
				item.owner._id,
				item.likes.map(like => like._id)
			)
			const deleteButton = cardElement.querySelector('.card__delete-button')
			if (item.owner._id !== currentUserId) {
				deleteButton.hidden = true
			}
			placesList.append(cardElement)
		})
	})
	.catch(err => {
		console.log(err)
	})

//Улучшенная система сохранения
function handleLoading(button, isLoading, initialText = 'Сохранить') {
	const cardName = document.querySelector('.popup__input_type_card-name')
	const cardURL = document.querySelector('.popup__input_type_first-url')
	if (isLoading) {
		button.textContent = 'Сохранение...'
		button.disabled = true
		button.dataset.isLoading = true
		cardName.disabled = true
		cardURL.disabled = true
	} else {
		button.textContent = initialText
		button.disabled = false
		button.dataset.isLoading = false
		cardName.disabled = false
		cardURL.disabled = false
	}
}

// Обработчик нажатия на кнопку редактирования профиля
editButton.addEventListener('click', function () {
	nameInput.value = document.querySelector('.profile__title').textContent
	jobInput.value = document.querySelector('.profile__description').textContent
	const submitButton = profilePopup.querySelector(
		validationSettings.submitButtonSelector
	)
	if (submitButton.classList.contains(validationSettings.inactiveButtonClass)) {
		submitButton.classList.remove(validationSettings.inactiveButtonClass)
		submitButton.disabled = false
	}
	openModal(profilePopup)
})

// Обработчик нажатия на кнопку закрытия редактирования профиля
closeButtonEdit.addEventListener('click', () => closeModal(profilePopup))

// Закрытие попапа редактирования нажатием на оверлей
profilePopup.addEventListener('click', evt => {
	if (evt.currentTarget === evt.target) {
		closeModal(profilePopup)
	}
})

const profileFormElement = profilePopup.querySelector('.popup__form')

// Сохранение данных, введенных в окно редактирования профиля
function handleProfileFormSubmit(evt) {
	evt.preventDefault()
	const submitButton = profilePopup.querySelector(
		validationSettings.submitButtonSelector
	)
	handleLoading(submitButton, true)
	editProfile(nameInput.value, jobInput.value)
		.then(result => {
			document.querySelector('.profile__title').textContent = result.name
			document.querySelector('.profile__description').textContent = result.about
			closeModal(profilePopup)
		})
		.catch(err => {
			console.error(err)
			alert(
				'Не удалось сохранить изменения. Проверьте подключение к интернету или повторите попытку позже.'
			)
		})
		.finally(() => {
			handleLoading(submitButton, false)
		})
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit)

// Обработчик нажатия на кнопку добавления новой карточки
addButton.addEventListener('click', function () {
	const cardName = cardPopup.querySelector('.popup__input_type_card-name')
	const cardURL = cardPopup.querySelector('.popup__input_type_first-url')
	cardName.value = ''
	cardURL.value = ''
	const inputList = Array.from(
		cardPopup.querySelectorAll(validationSettings.inputSelector)
	)
	const buttonElement = cardPopup.querySelector(
		validationSettings.submitButtonSelector
	)
	toggleButtonState(inputList, buttonElement)
	openModal(cardPopup)
})

// Обработчик нажатия на кнопку закрытия добавления новой карточки
closeButtonCard.addEventListener('click', () => closeModal(cardPopup))

// Закрытие попапа добавления карточки нажатием на оверлей
cardPopup.addEventListener('click', evt => {
	if (evt.currentTarget === evt.target) {
		closeModal(cardPopup)
	}
})

const cardFormElement = cardPopup.querySelector('.popup__form')

// Добавление новой карточки
function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const cardName = document.querySelector('.popup__input_type_card-name').value;
    const cardURL = document.querySelector('.popup__input_type_first-url').value;
    const submitButton = cardPopup.querySelector(validationSettings.submitButtonSelector);

    if (!navigator.onLine) {
        alert('Нет подключения к интернету. Проверьте соединение и повторите попытку.');
        return;
    }

    handleLoading(submitButton, true);

    addNewCard(cardName, cardURL)
        .then(result => {
            placesList.prepend(
                createCard(
                    cardName,
                    cardURL,
                    result.likes.length,
                    result._id,
                    result.owner._id,
                    result.likes.map(like => like._id)
                )
            );
            closeModal(cardPopup);
            cardFormElement.reset();
        })
        .catch(err => {
            console.log(err);
            alert('Не удалось добавить картинку. Проверьте подключение к интернету или повторите попытку позже.');
        })
        .finally(() => {
            handleLoading(submitButton, false);
        });
}

cardFormElement.addEventListener('submit', handleCardFormSubmit)

// Обработчик нажатия на кнопку изменения аватара
avatarButton.addEventListener('click', function () {
	const avatarURL = avatarPopup.querySelector('.popup__input_type_second-url')
	avatarURL.value = ''
	const inputList = Array.from(
		avatarPopup.querySelectorAll(validationSettings.inputSelector)
	)
	const buttonElement = avatarPopup.querySelector(
		validationSettings.submitButtonSelector
	)
	toggleButtonState(inputList, buttonElement)
	openModal(avatarPopup)
})

// Обработчик нажатия на кнопку закрытия изменения аватара
closeButtonAvatar.addEventListener('click', () => closeModal(avatarPopup))

// Закрытие попапа изменения аватара нажатием на оверлей
avatarPopup.addEventListener('click', evt => {
	if (evt.currentTarget === evt.target) {
		closeModal(avatarPopup)
	}
})

const avatarFormElement = avatarPopup.querySelector('.popup__form')

// Изменение аватара
function handleAvatarFormSubmit(evt) {
	evt.preventDefault()
	const avatarURL = avatarPopup.querySelector(
		'.popup__input_type_second-url'
	).value
	const avatarImage = document.querySelector('.profile__image')
	const submitButton = avatarPopup.querySelector(
		validationSettings.submitButtonSelector
	)

	if (!navigator.onLine) {
		alert(
			'Нет подключения к интернету. Проверьте соединение и повторите попытку.'
		)
		return
	}
	handleLoading(submitButton, true)

	const image = new Image()

	image.onload = () => {
		updateAvatar(avatarURL)
			.then(result => {
				avatarImage.style.backgroundImage = `url(${avatarURL})`
				closeModal(avatarPopup)
				avatarFormElement.reset()
			})
			.catch(err => {
				console.log(err)
				alert(
					'Не удалось изменить аватар. Проверьте подключение к интернету или повторите попытку позже.'
				)
			})
			.finally(() => {
				handleLoading(submitButton, false)
			})
	}

	image.onerror = () => {
		alert('Ошибка загрузки аватара. Проверьте URL и повторите попытку.')
		handleLoading(submitButton, false)
	}

	image.src = avatarURL
}

avatarFormElement.addEventListener('submit', handleAvatarFormSubmit)

export const validationSettings = {
	formSelector: '.popup__form',
	inputSelector: '.popup__input',
	submitButtonSelector: '.popup__button',
	inactiveButtonClass: 'popup__button_inactive',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__input-error_active',
}

enableValidation(validationSettings)
