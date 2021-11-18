import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  itemsIndex: [],
  totalItems: 0,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      if (!state.itemsIndex.includes(action.payload.id)) {
        action.payload.count = 1;
        state.itemsIndex = [...state.itemsIndex, action.payload.id];
        state.items = [...state.items, action.payload];
      } else {
        let index = state.items.findIndex(
          (basketItem, i) => basketItem.id == action.payload.id
        );

        state.items[index].count++;
      }

      state.totalItems++;
    },
    removeFromBasket: (state, action) => {
      let index = state.items.findIndex(
        (basketItem, i) => basketItem.id == action.payload.id
      );

      if (index >= 0) {
        if (state.items[index].count > 1) {
          state.items[index].count--;
        } else {
          let newBasket = [...state.items];
          newBasket.splice(index, 1);
          state.items = newBasket;

          let newBasketIndex = [...state.itemsIndex];
          let currentBasketIndex = state.itemsIndex.findIndex(
            (existingIndex, i) => existingIndex == action.payload.id
          );

          console.log;

          if (currentBasketIndex >= 0) {
            newBasketIndex.splice(currentBasketIndex, 1);
            state.itemsIndex = newBasketIndex;
          }
        }
      } else {
        console.warn(
          `Cannot remove item with id ${action.payload.id} as its not in the basket`
        );
      }

      state.totalItems--;
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;
export const selectBasketItemsCount = (state) => state.basket.totalItems;
export const selectTotalCheckoutAmount = (state) =>
  state.basket.items.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

export default basketSlice.reducer;
