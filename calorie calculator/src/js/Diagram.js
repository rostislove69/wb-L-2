export default class Diagram {
  constructor(canvasId) {
    this._canvas = document.getElementById(canvasId);
    this._ctx = this._canvas.getContext("2d");
    this._colors = [
      "#00bfff",
      "#7fffd4",
      "#e9967a",
      "#008080",
      "#dc143c",
      "#db7093",
      "#ffdab9",
      "#228b22",
      "#800080",
      "#a0522d",
      "#deb887",
      "#bdb76b",
      "#90ee90",
      "#556b2f",
      "#b0c4de",
      "#ff69b4",
      "#bc8f8f",
      "#fa8072",
    ];
  }

  drawDiagram(data, total) {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    if (data.length === 0) {
      this._ctx.fillStyle = "black";
      this._ctx.font = "20px Arial";
      this._ctx.fillText("После добавления продуктов", 10, 55);
      this._ctx.fillText("здесь появится диаграмма", 25, 75);
      this._ctx.fillText("с данными о съеденных", 37, 95);
      this._ctx.fillText("продуктах", 100, 115);
    }
    const centerX = 150 / 2;
    const centerY = 150 / 2;
    const radius = 150 / 2 - 10;
    let startAngle = 0;

    data.forEach((item, index) => {
      const percentage = Number(item.calQuantity) / Number(total);
      const endAngle = startAngle + Math.PI * 2 * percentage;
      if (index < 22) {
        this._ctx.fillStyle = this._colors[index];
      } else {
        this._ctx.fillStyle = this._colors[Math.floor(Math.random() * 22)];
      }

      this._ctx.beginPath();
      this._ctx.moveTo(centerX, centerY);
      this._ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this._ctx.closePath();
      this._ctx.fill();
      this._ctx.fillRect(160, 5 + index * 15, 10, 10);
      this._ctx.fillStyle = "black";
      this._ctx.font = "10px Arial";
      this._ctx.fillText(item.foodName, 175, 13 + index * 15);

      startAngle = endAngle;
    });
  }
}
