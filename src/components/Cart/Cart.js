import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);

  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const ShowCheckoutHandler = () => {
    setShowCheckout(true);
    setHideButtons(true);
  };

  const checkoutCancelHandler = () => {
    setShowCheckout(false);
    setHideButtons(false);
  };

  const checkoutConfirmHandler = async (checkoutData) => {
    setIsSubmitting(true);
    const response = await fetch(
      `https://food-items-350f2-default-rtdb.firebaseio.com/userCheckout.json`,
      {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDetails: checkoutData,
          CheckooutedItems: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {showCheckout && (
        <Checkout
          onConfirmCheckout={checkoutConfirmHandler}
          onCheckoutCancel={checkoutCancelHandler}
        />
      )}
      <div className={classes.actions}>
        {!hideButtons && (
          <button className={classes["button--alt"]} onClick={props.onClose}>
            Close
          </button>
        )}
        {hasItems && !hideButtons && (
          <button className={classes.button} onClick={ShowCheckoutHandler}>
            Order
          </button>
        )}
      </div>
    </React.Fragment>
  );
  const isSubmittingModalContent = <p>Submitting...</p>;
  const didSubmitModalContent = (
    <React.Fragment>
      <p>Order Placed Sucessfully, we will notify you once it's dispached. </p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
