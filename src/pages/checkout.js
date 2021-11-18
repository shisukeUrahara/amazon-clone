import Image from "next/image";
import React from "react";
import Header from "../components/Header/Header";
import {
  selectItems,
  selectBasketItemsCount,
  selectTotalCheckoutAmount,
} from "../slices/basketSlice";
import { useSelector } from "react-redux";
import ShoppingCheckoutProduct from "../components/ShoppingCheckoutProduct/ShoppingCheckoutProduct";
import { useSession } from "next-auth/client";
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "../components/Toast/Toast";
const stripePromise = loadStripe(process.env.stripe_public_key);

function checkout() {
  const items = useSelector(selectItems);
  const totalItems = useSelector(selectBasketItemsCount);
  const totalCheckoutAmount = useSelector(selectTotalCheckoutAmount);
  const [session] = useSession();

  const createCheckoutSession = async () => {
    // initialize stripe
    const stripe = await stripePromise;

    // connect to backend to create a session
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items,
      email: session.user.email,
    });

    // redirect the user back to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) {
      toast.error(result.error.message);
    }
  };

  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* left section */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length <= 0 ? "Your Basket is empty" : `Your Basket`}
            </h1>

            {items.map((item, i) => (
              <ShoppingCheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                category={item.category}
                image={item.image}
                rating={item.rating}
                hasPrime={item.hasPrime}
                count={item.count}
                totalItems={totalItems}
              />
            ))}
          </div>
        </div>

        {/* right section */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 ? (
            <div>
              <h2 className="whitespace-nowrap">
                SubTotal ({totalItems} items):{" "}
                <span>
                  <Currency quantity={totalCheckoutAmount} currency="usd" />
                </span>
                <span className="font-bold"></span>
              </h2>
              <button
                role="link"
                disabled={!session}
                onClick={createCheckoutSession}
                className={`${session && "button  mt-2"} ${
                  !session && "button-disabled"
                }`}
              >
                {!session ? "Sign In to checkout" : "Proceed to checkout"}
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default checkout;
