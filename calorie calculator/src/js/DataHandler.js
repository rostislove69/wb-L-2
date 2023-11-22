export default class DataHandler {
  constructor() {
    this.isDescending = false;
  }

  dataSorter(data) {
    if (this.isDescending) {
      data.sort((a, b) => a.calQuantity - b.calQuantity)
    } else {
      data.sort((a, b) => b.calQuantity - a.calQuantity);
    }

    this.isDescending = !this.isDescending;
    return data;
  }

  dataFilter(data, name) {
    return data.filter(item => item.foodName.toLowerCase().includes(name.toLowerCase()));
  }
}