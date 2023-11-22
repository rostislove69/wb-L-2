export default class Card {
  constructor({ foodName, calQuantity, id }, templateSelector, handleCardDelete) {
    this._name = foodName;
    this._cal = calQuantity;
    this._id = id;
    this._templateSelector = templateSelector;
    this._handleCardDelete = handleCardDelete;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".food-item")
      .cloneNode(true);
    return cardElement;
  }

  deleteCard(card) {
    card = this._element;
    card.remove();
    card = null;
  }

  _setEventListener() {
    this._buttonDelete.addEventListener("click", () => {
      this._handleCardDelete(this._id);
    });
  }

  generateCard() {
    this._element = this._getTemplate();
    this._buttonDelete = this._element.querySelector(
      ".food-item__delete-button"
    );
    this._element.querySelector(".food-item__name").textContent = this._name;
    this._element.querySelector(".food-item__cal").textContent = this._cal;
    this._setEventListener();
    return this._element;
  }
}
