export default class Section {
  constructor({ renderer }, containerSelector, calSelector, sortHandler) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
    this._personalCalCounter = document.querySelector(calSelector);
    this._sortHandler = sortHandler;
  }

  removeItems() {
    while (this._container.firstChild) {
      this._container.removeChild(this._container.firstChild);
    }
    this._personalCalCounter.textContent = 0;
  }

  renderItems(data) {
    this.removeItems()
    Array.from(data).forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(element) {
    this._container.append(element);
  }
}
