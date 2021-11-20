import { buffer } from "micro";
import * as admin from "firebase-admin";
// secure a connection to firebase from the backend
const serviceAccount = require("../../../permissions.json");
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// secure a connection to stripe from the backend

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endPointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(
        `**@ FULLFILL ORDER SUCCESS , order details of session ${session.id} saved in db`
      );
    })
    .catch((err) => {
      console.log(
        `**@ FULLFILL ORDER ERROR , order details of session ${session.id} , error is , `,
        err
      );
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);

    const payload = requestBuffer.toString();
    const signature = req.headers["stripe-signature"];

    let event;
    // verifying tha the event came from stripe endpoint
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endPointSecret
      );
    } catch (err) {
      console.log("**@ WEBHOOK ERROR , ", err);
      return res.status(404).send(`Webhook error: ${err.message}`);
    }

    // handle the checkout.session.completed event
    if (event.type == "checkout.session.completed") {
      const session = event.data.object;

      // fulfill the order request
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResource: true,
  },
};
