export default class LocalStorageControler {
  constructor(totalCalsKey, foodListKey, soretedDataKey, filteredDataKey) {
    this._totalCals = totalCalsKey;
    this._foodList = foodListKey;
    this._sortedData = soretedDataKey;
    this._filteredData = filteredDataKey;
  }

  getTotalCals() {
    if (localStorage.getItem(this._totalCals)) {
      return JSON.parse(localStorage.getItem(this._totalCals));
    } else {
      return 2000;
    }
  }

  setTotalCals(cals) {
    localStorage.setItem(this._totalCals, JSON.stringify(cals));
  }

  getFoodList() {
    if (localStorage.getItem(this._foodList)) {
      return JSON.parse(localStorage.getItem(this._foodList));
    } else {
      return [];
    }
  }

  setToFoodlist(newData) {
    let existingData = this.getFoodList();
    if (existingData) {
      existingData.push(newData);
    } else {
      existingData = [newData];
    }
    localStorage.setItem(this._foodList, JSON.stringify(existingData));
  }

  removeFromFoodList(id) {
    let existingData = this.getFoodList();
    if (existingData) {
      existingData = existingData.filter((item) => item.id !== id);
      localStorage.setItem(this._foodList, JSON.stringify(existingData));
    }
  }

  clearFoodData() {
    localStorage.removeItem(this._foodList);
  }

  getFilteredData() {
    if(localStorage.getItem(this._filteredData)){
      return JSON.parse(localStorage.getItem(this._filteredData));
    } else {
      return this.getFoodList();
    }
  }

  setFilteredData(newData) {
    localStorage.setItem(this._filteredData, JSON.stringify(newData));
  }

  removeFilteredData() {
    localStorage.removeItem(this._filteredData);
  }

  getSortedData() {
    return this.getFilteredData();
  }

  setSortedData(newData) {
    this.setFilteredData(newData);
  }
}
