import {resetForm} from './validate.js';

// Функция открытия модального окна
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
}

// Функция закрытия модального окна
export function closeModal(popup) {
  if (popup.classList.contains('popup_type_edit') || popup.classList.contains('popup_type_new-card') || popup.classList.contains('popup_type_avatar')) {
    resetForm(popup);
  }
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
}

// Функция закрытия окна нажатием на Escape
export function closeByEsc(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

