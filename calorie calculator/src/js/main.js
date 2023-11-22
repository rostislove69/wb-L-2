import Card from "./Card.js";
import Section from "./Section.js";
import PopupWithForm from "./PopupWithForm.js";
import Diagram from "./Diagram.js";
import DataHandler from "./DataHandler.js";
import LocalStorageControler from "./LocalSrorageControler.js";

const changeCalButton = document.querySelector(
  ".main-header__change-cal-button"
);
const addFoodButton = document.querySelector(".main-header__add-food-button");
const limitCal = document.querySelector(".main-header__cal-limit");
const calAlert = document.querySelector(".main-header__alert");
const personalCal = document.querySelector(".main-header__personal-cal");
const deleteDataButton = document.getElementById("deleteDataButton");
const sortButton = document.getElementById("sortButton");
const filterInput = document.getElementById("filterInput");

const changeCalCounter = () => {
  let counter = 0;
  if(localSrorageControler.getFoodList()){
    const foodList = localSrorageControler.getFoodList();
    foodList.forEach(item => {
      counter += Number(item.calQuantity);
    })
  }
  personalCal.textContent = counter;
  if(counter > Number(limitCal.textContent)){
    calAlert.style.display = "block";
  } else {
    calAlert.style.display = "none";
  }
}

const localSrorageControler = new LocalStorageControler(
  "totalCals",
  "foodList",
  "sortedData",
  "filteredData"
);
limitCal.textContent = localSrorageControler.getTotalCals();

const drawCircleDiagram = new Diagram("canvas");
drawCircleDiagram.drawDiagram(
  localSrorageControler.getFoodList(),
  localSrorageControler.getTotalCals()
);

const dataHandler = new DataHandler();

const createNewCard = (data) => {
  const card = new Card(
    {
      foodName: data.foodName,
      calQuantity: data.calQuantity,
      id: data.id,
    },
    "template",
    (id) => {
      localSrorageControler.removeFromFoodList(id);
      localSrorageControler.removeFilteredData();
      card.deleteCard();
      drawCircleDiagram.drawDiagram(
        localSrorageControler.getFoodList(),
        localSrorageControler.getTotalCals()
      );
      changeCalCounter();
    }
  );
  return card.generateCard();
};

const cardList = new Section(
  {
    renderer: (item) => {
      const cardElement = createNewCard(item);
      cardList.addItem(cardElement);
      changeCalCounter();
    },
  },
  ".food-list",
  ".main-header__personal-cal"
);

cardList.renderItems(localSrorageControler.getFoodList());

const addFoodPopup = new PopupWithForm(".popup__add-food", (data) => {
  data.id = Date.now();
  const newCard = createNewCard(data);
  localSrorageControler.removeFilteredData();
  cardList.addItem(newCard);
  localSrorageControler.setToFoodlist(data);
  drawCircleDiagram.drawDiagram(
    localSrorageControler.getFoodList(),
    localSrorageControler.getTotalCals()
  );
  changeCalCounter();
});

const changeMaxCalPopup = new PopupWithForm(".popup__change-cal", (data) => {
  localSrorageControler.setTotalCals(data.maxCal);
  limitCal.textContent = localSrorageControler.getTotalCals();
  drawCircleDiagram.drawDiagram(
    localSrorageControler.getFoodList(),
    localSrorageControler.getTotalCals()
  );
});

addFoodPopup.setEventListeners();
changeMaxCalPopup.setEventListeners();

changeCalButton.addEventListener("click", () => {
  changeMaxCalPopup.open();
});

addFoodButton.addEventListener("click", () => {
  addFoodPopup.open();
});

deleteDataButton.addEventListener("click", () => {
  localSrorageControler.clearFoodData();
  cardList.removeItems();
  drawCircleDiagram.drawDiagram(
    localSrorageControler.getFoodList(),
    localSrorageControler.getTotalCals()
  );
  localSrorageControler.removeFilteredData();
  changeCalCounter();
});

filterInput.addEventListener("input", () => {
  if (filterInput.value.trim() === "") {
    localSrorageControler.removeFilteredData();
    cardList.renderItems(localSrorageControler.getFoodList());
  } else {
    localSrorageControler.setFilteredData(
      dataHandler.dataFilter(
        localSrorageControler.getFilteredData(),
        filterInput.value
      )
    );
    cardList.renderItems(localSrorageControler.getFilteredData());
  }
  changeCalCounter();
});

sortButton.addEventListener("click", () => {
  localSrorageControler.setSortedData(
    dataHandler.dataSorter(localSrorageControler.getSortedData())
  );
  cardList.renderItems(localSrorageControler.getSortedData());
  changeCalCounter();
});

window.addEventListener("beforeunload", function (event) {
  localSrorageControler.removeFilteredData();
  event.returnValue = "";
});