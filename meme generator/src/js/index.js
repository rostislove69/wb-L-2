const canvas = document.querySelector(".canvas");
canvas.style.display = "none";
const context = canvas.getContext("2d");
const textField = document.querySelector(".text-field");
canvas.parentNode.appendChild(textField);
const movesBlock = Array.from(document.querySelectorAll(".moves-block"));
const textarea = document.querySelector(".textarea");
const increaseFontButton = document.querySelector(".button-increase-font");
const decreaseFontButton = document.querySelector(".button-decrease-font");
const resizeHandlerLeft = document.querySelector(".resize-handle-left");
const resizeHandlerRight = document.querySelector(".resize-handle-right");
const userHint = document.querySelector(".user-hint");
const buttonSave = document.querySelector(".save-button");

const img = new Image();

let currentFontSize = 35;
const minFontSize = 10;
const maxFontSize = 50;

let currentLineHeight = 39;
const maxLineHeight = 54;
const minLineHeight = 14;

textarea.style.fontSize = currentFontSize + "px";
textarea.style.lineHeight = currentLineHeight + "px";

let texts = [];
let openText = false;
let isDragging = false;
let initialX, initialY;
let initialLeft;

let isResizingLeft = false;
let isResizingRight = false;

function drawWrappedText({ text, x, y, fontSize, maxWidth, lineHeight }) {
  lineHeight = Number(lineHeight.slice(0, -2));
  maxWidth = maxWidth + 10;
  const letters = text.split("");
  let stroke = "";
  let strokes = [];
  let textCoordinates = {};
  context.font = fontSize + " Arial"; // Размер шрифта и шрифт
  context.fillStyle = "white"; // Цвет текста

  for (let n = 0; n < letters.length; n++) {
    const testStroke = stroke + letters[n] + " ";
    const metrics = context.measureText(testStroke);
    const testWidth = metrics.width;
    if (n == letters.length - 1 && testWidth <= maxWidth) {
      stroke = stroke + letters[n];
      strokes.push(stroke);
    } else if (n == letters.length - 1 && testWidth > maxWidth) {
      strokes.push(stroke);
      strokes.push(letters[n]);
    } else if (testWidth > maxWidth && n > 0) {
      strokes.push(stroke);
      stroke = "" + letters[n];
    } else {
      stroke = stroke + letters[n];
    }
  }
  strokes.forEach((stroke, index) => {
    if (index === 0) {
      textCoordinates.leftX = x;
      textCoordinates.rightX = x + maxWidth;
      textCoordinates.topY = y - 20;
      textCoordinates.width = maxWidth;
      textCoordinates.fontSize = fontSize;
      textCoordinates.lineHeight = lineHeight;
      textCoordinates.x = x;
      textCoordinates.y = y;
    }
    if (index === strokes.length - 1) {
      textCoordinates.bottomY = y + 15 + lineHeight * index;
      textCoordinates.text = text;
      textCoordinates.strokes = strokes;
      texts.push(textCoordinates);
    }
    const shadowOffsets = [
      { offsetX: -1, offsetY: -1 },
      { offsetX: 1, offsetY: -1 },
      { offsetX: -1, offsetY: 1 },
      { offsetX: 1, offsetY: 1 },
    ];
    shadowOffsets.forEach((offset) => {
      context.shadowOffsetX = offset.offsetX;
      context.shadowOffsetY = offset.offsetY;
      context.shadowBlur = 0;
      context.shadowColor = "black";
      context.fillText(stroke, x, y + lineHeight * index);
    });
  });
}

function drawTexts(array) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  array.forEach((item) => {
    context.font = item.fontSize + " Arial"; // Размер шрифта и шрифт
    context.fillStyle = "white"; // Цвет текста
    item.strokes.forEach((stroke, index) => {
      const shadowOffsets = [
        { offsetX: -1, offsetY: -1 },
        { offsetX: 1, offsetY: -1 },
        { offsetX: -1, offsetY: 1 },
        { offsetX: 1, offsetY: 1 },
      ];
      shadowOffsets.forEach((offset) => {
        context.shadowOffsetX = offset.offsetX;
        context.shadowOffsetY = offset.offsetY;
        context.shadowBlur = 0;
        context.shadowColor = "black";
        context.fillText(stroke, item.x, item.y + item.lineHeight * index);
      });
    });
  });
}

increaseFontButton.addEventListener("click", function () {
  currentFontSize += 2;
  currentLineHeight += 2;
  if (currentFontSize <= maxFontSize) {
    textarea.style.fontSize = currentFontSize + "px";
  } else {
    currentFontSize = maxFontSize;
  }
  if (currentLineHeight <= maxLineHeight) {
    textarea.style.lineHeight = currentLineHeight + "px";
  } else {
    currentLineHeight = maxLineHeight;
  }
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

decreaseFontButton.addEventListener("click", function () {
  currentFontSize -= 2;
  currentLineHeight -= 2;
  if (currentFontSize >= minFontSize) {
    textarea.style.fontSize = currentFontSize + "px";
  } else {
    currentFontSize = minFontSize;
  }
  if (currentLineHeight >= minLineHeight) {
    textarea.style.lineHeight = currentLineHeight + "px";
  } else {
    currentLineHeight = minLineHeight;
  }
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

canvas.addEventListener("mousedown", function (event) {
  setTimeout(() => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, 0);
  if (textarea.value.trim() !== "") {
    const textWidth = textarea.offsetWidth;
    const text = textarea.value;
    const fontSize = textarea.style.fontSize;
    const lineHeight = textarea.style.lineHeight;
    const textFieldWidth = textarea.offsetWidth;
    const textFieldLeft = textField.offsetLeft;
    const textFieldTop = textField.offsetTop + Number(lineHeight.slice(0, -2));
    const newText = {
      text: text,
      x: textFieldLeft,
      y: textFieldTop,
      fontSize: fontSize,
      maxWidth: textWidth,
      lineHeight: lineHeight,
    };
    drawTexts(texts);
    drawWrappedText(newText);
  }
  textField.classList.add("text-field_hide");
  textarea.value = "";
  const canvasBounds = canvas.getBoundingClientRect();
  let x = event.clientX - canvasBounds.left;
  let y = event.clientY - canvasBounds.top;
  if (texts.length === 0 && openText) {
    openText = false;
  }
  texts.forEach((text, index) => {
    if (
      x > text.leftX &&
      x < text.rightX &&
      y > text.topY &&
      y < text.bottomY
    ) {
      textField.classList.remove("text-field_hide");
      textField.style.left = text.x + "px";
      textField.style.top = text.y - text.lineHeight + "px";
      textField.style.width = text.width;
      textarea.value = text.text;
      textarea.style.fontSize = text.fontSize;
      textarea.style.lineHeight = text.lineHeight + "px";
      initialLeft = textField.offsetLeft;
      texts.splice(index, 1);
      drawTexts(texts);
      openText = true;
    } else {
      openText = false;
    }
  });
  if (!openText) {
    textField.classList.remove("text-field_hide");
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const textFieldHeight = textField.offsetHeight;
    const textFieldWidth = textField.offsetWidth;

    let y = event.clientY - canvasBounds.top - textFieldHeight / 2;
    let x = event.clientX - canvasBounds.left - textFieldWidth / 2;

    if (y < 0) {
      y = 0;
    } else if (y + textFieldHeight > canvasHeight) {
      y = canvasHeight - textFieldHeight;
    }

    if (x < 0) {
      x = 0;
    } else if (x + textFieldWidth > canvasWidth) {
      x = canvasWidth - textFieldWidth;
    }

    textField.style.left = x + "px";
    textField.style.top = y + "px";
    initialLeft = textField.offsetLeft;
    textarea.focus();
  }
});

document.querySelector(".image-input").addEventListener("change", (event) => {
  texts = [];
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      if (width > 500) {
        const ratio = 500 / width;
        width = 500;
        height *= ratio;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
      } else {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
      }
      canvas.style.display = "block";
      buttonSave.classList.remove("save-button_hide");
      userHint.classList.remove("user-hint_hide");
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

document.addEventListener("mousedown", function (event) {
  if (
    event.target !== canvas &&
    event.target !== decreaseFontButton &&
    event.target !== increaseFontButton &&
    event.target !== textarea &&
    event.target !== movesBlock[0] &&
    event.target !== movesBlock[1] &&
    event.target !== resizeHandlerLeft &&
    event.target !== resizeHandlerRight
  ) {
    if (textarea.value.trim() !== "") {
      const textWidth = textarea.offsetWidth;
      const text = textarea.value;
      const fontSize = textarea.style.fontSize;
      const lineHeight = textarea.style.lineHeight;
      const textFieldWidth = textarea.offsetWidth;
      const textFieldLeft = textField.offsetLeft;
      const textFieldTop =
        textField.offsetTop + Number(lineHeight.slice(0, -2));
      const newText = {
        text: text,
        x: textFieldLeft,
        y: textFieldTop,
        fontSize: fontSize,
        maxWidth: textWidth,
        lineHeight: lineHeight,
      };
      drawTexts(texts);
      drawWrappedText(newText);
    }
    const rect = canvas.getBoundingClientRect();
    textField.classList.add("text-field_hide");
    textarea.value = "";
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
});

function moveTextField(event) {
  if (isDragging) {
    const boundsCanvas = canvas.getBoundingClientRect();
    const x = event.clientX - boundsCanvas.left;
    const y = event.clientY - boundsCanvas.top;

    const offsetX = x - initialX;
    const offsetY = y - initialY;

    const textFieldWidth = textField.offsetWidth;
    const textFieldHeight = textField.offsetHeight;

    const canvasWidth = boundsCanvas.width;
    const canvasHeight = boundsCanvas.height;

    // Новые координаты для textField
    let newLeft = textField.offsetLeft + offsetX;
    let newTop = textField.offsetTop + offsetY;

    newLeft = Math.min(Math.max(0, newLeft), canvasWidth - textFieldWidth);
    newTop = Math.min(Math.max(0, newTop), canvasHeight - textFieldHeight);

    textField.style.left = newLeft + "px";
    textField.style.top = newTop + "px";

    initialX = x;
    initialY = y;
  }
}

movesBlock.forEach((block) => {
  block.addEventListener("mousedown", (event) => {
    isDragging = true;
    const boundsCanvas = canvas.getBoundingClientRect();
    initialX = event.clientX - boundsCanvas.left;
    initialY = event.clientY - boundsCanvas.top;
    document.addEventListener("mousemove", moveTextField);
    document.addEventListener("mouseup", () => {
      isDragging = false;
      initialLeft = textField.offsetLeft;
      document.removeEventListener("mousemove", moveTextField);
    });
  });
});

textarea.addEventListener("input", function () {
  setTimeout(() => {
    textarea.scrollTop = 0;
  }, 0);
  textarea.style.maxHeight = canvas.height + "px";
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
  const textFieldWidth = textField.offsetWidth;
  const textFieldHeight = textField.offsetHeight;
  const canvasBounds = canvas.getBoundingClientRect();
  const canvasWidth = canvasBounds.width;
  const canvasHeight = canvasBounds.height;

  const textFieldLeft = textField.offsetLeft;
  const textFieldTop = textField.offsetTop;

  if (textFieldHeight + textFieldTop > canvasHeight) {
    textField.style.top =
      canvasHeight - textFieldHeight > 0
        ? canvasHeight - textFieldHeight + "px"
        : "0";
  }
});

resizeHandlerLeft.addEventListener("mousedown", function (event) {
  isResizingLeft = true;
  initialX = event.clientX;
  initialWidth = textField.offsetWidth;
  initialLeft = textField.offsetLeft;
});

resizeHandlerRight.addEventListener("mousedown", function (event) {
  isResizingRight = true;
  initialX = event.clientX;
  initialWidth = textField.offsetWidth;
  initialLeft = textField.offsetLeft;
});

document.addEventListener("mousemove", function (event) {
  if (isResizingLeft) {
    textField.style.userSelect = "none";
    const offset = initialX - event.clientX;
    const newWidth = initialWidth + offset;
    const newLeft = initialLeft - offset;
    if (
      newWidth > 0 &&
      newLeft >= 0 &&
      textField.offsetLeft + newWidth <= canvas.offsetWidth &&
      newWidth >= 150
    ) {
      textField.style.width = newWidth + "px";
      textarea.style.width = newWidth + "px";
      textField.style.left = newLeft + "px";
    }
  } else if (isResizingRight) {
    textField.style.userSelect = "none";
    const offset = event.clientX - initialX;
    const newWidth = initialWidth + offset;
    if (
      newWidth > 0 &&
      textField.offsetLeft + newWidth <= canvas.offsetWidth &&
      textField.offsetWidth + offset >= 150
    ) {
      textField.style.width = newWidth + "px";
      textarea.style.width = newWidth + "px";
    }
  }
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

document.addEventListener("mouseup", function () {
  isResizingLeft = false;
  isResizingRight = false;
  textField.style.userSelect = "auto";
});

buttonSave.addEventListener("click", function () {
  // Получаем ссылку на изображение из canvas
  const image = canvas.toDataURL("image/jpeg");

  // Создаем ссылку для скачивания изображения
  const downloadLink = document.createElement("a");
  downloadLink.href = image;
  downloadLink.download = "my_image.jpeg";

  // Добавляем ссылку на страницу и эмулируем клик для скачивания
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Удаляем ссылку из DOM
  document.body.removeChild(downloadLink);
});
