import { StarIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React from "react";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../../slices/basketSlice";

function ShoppingCheckoutProduct({
  id,
  title,
  description,
  price,
  rating,
  category,
  image,
  hasPrime,
  count,
  totalItems,
}) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      description,
      price,
      rating,
      category,
      image,
      hasPrime,
    };

    dispatch(addToBasket(product));
  };

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} width={200} height={200} objectFit="contain" />

      {/* middle section */}
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>

        <div className="mb-5">
          <Currency quantity={price} currency="usd" />
        </div>

        {hasPrime && (
          <div className="flex items-center space-x-2 -mt-5 ">
            <img
              className="w-12"
              src="https://links.papareact.com/fdw"
              alt=""
            />
            <p className="text-xs text-gray-500">Free next-day delievery</p>
          </div>
        )}
      </div>

      {/* right section */}
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button disabled={true} className="button-disabled">
          Quantity :- {count}
        </button>

        <button onClick={addItemToBasket} className="button">
          Add To Basket
        </button>
        <button onClick={removeItemFromBasket} className="button">
          Remove From Basket
        </button>
      </div>
    </div>
  );
}

export default ShoppingCheckoutProduct;
