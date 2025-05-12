import {openModal, closeModal} from './modal.js';
import {deleteCard, likeCard, deleteLikeCard} from './api.js';
import {currentUserId} from './index.js';
export let placesList = document.querySelector('.places__list');
const popupImageAttr = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
const imagePopup = document.querySelector('.popup_type_image');
const closeButtonImage = imagePopup.querySelector('.popup__close');

//Функция создания карточки
export function createCard(cardName, cardLink, cardLikes, cardID, ownerId, likedBy) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardLikeCounter = cardElement.querySelector('.card__counter');
  cardLikeCounter.textContent = cardLikes;
  cardElement.querySelector('.card__image').src = cardLink;
  cardElement.querySelector('.card__image').alt = cardName;
  cardElement.querySelector('.card__title').textContent = cardName;
  const likedButton = cardElement.querySelector('.card__like-button');
  const deletedButton = cardElement.querySelector('.card__delete-button');
  //Проверка на поставленный лайк
  if (likedBy.includes(currentUserId)) {
    likedButton.classList.add('card__like-button_is-active');
  }

  //Поставить или убрать лайк
  likedButton.addEventListener("click", function() {
    // Добавим флаг, чтобы предотвратить множественные клики во время запроса
    if (likedButton.disabled) {
      return;
    }
    likedButton.disabled = true; // Заблокируем кнопку

    const isLiked = likedButton.classList.contains('card__like-button_is-active');

    const likeOperation = isLiked ? deleteLikeCard(cardID) : likeCard(cardID);

    likeOperation
      .then((result) => {
        likedButton.classList.toggle('card__like-button_is-active');
        cardLikeCounter.textContent = result.likes.length;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        likedButton.disabled = false; // Разблокируем кнопку в любом случае
      });
  });

  //Кнопка удаления карточки
  deletedButton.addEventListener("click", function() {
        // Добавим флаг, чтобы предотвратить множественные клики во время запроса
        if (deletedButton.disabled) {
          return;
        }
        deletedButton.disabled = true; // Заблокируем кнопку

    deleteCard(cardID)
      .then((result) => {
        deletedButton.closest('.places__item').remove();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        deletedButton.disabled = false; // Разблокируем кнопку в любом случае
      });
  });

  //Обработчик нажатия на карточку
  cardImage.addEventListener("click", function() {
    popupImageAttr.src = cardLink;
    popupImageAttr.alt = cardName;
    popupCaption.textContent = cardName;
    openModal(imagePopup);
  });

  //Обработчик нажатия на кнопку закрытия карточки
  closeButtonImage.addEventListener('click', () => closeModal(imagePopup));

  //Закрытие попапа картинки нажатием на оверлэй
  imagePopup.addEventListener("click", (evt) => {
    if (evt.currentTarget === evt.target) {
      closeModal(imagePopup)
    }
  });
  return cardElement;
}
