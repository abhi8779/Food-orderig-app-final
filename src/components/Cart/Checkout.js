import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isNotSixChars = (value) => value.trim().length !== 6;

const Checkout = (props) => {
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    street: true,
    postal: true,
    city: true,
  });

  const nameRef = useRef("");
  const streetRef = useRef("");
  const postalRef = useRef("");
  const cityRef = useRef("");

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredPostal = postalRef.current.value;
    const enteredCity = cityRef.current.value;
    const enteredStreet = streetRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredPostalIsValid = !isNotSixChars(enteredPostal);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredStreetIsValid = !isEmpty(enteredStreet);

    setFormInputValidity({
      name: enteredNameIsValid,
      street: enteredPostalIsValid,
      postal: enteredCityIsValid,
      city: enteredStreetIsValid,
    });

    const overAllFormIsValid =
      enteredNameIsValid &&
      enteredPostalIsValid &&
      enteredCityIsValid &&
      enteredStreetIsValid;

    if (!overAllFormIsValid) {
      return;
    }

    const CheckoutData = {
      name: enteredName,
      street: enteredPostal,
      postal: enteredCity,
      city: enteredStreet,
    };

    props.onConfirmCheckout(CheckoutData);
  };

  const invalidNameClassesControl = `${classes.control} ${
    !formInputValidity.name ? classes.invalid : ""
  }`;
  const invalidPostalClassesControl = `${classes.control} ${
    !formInputValidity.postal ? classes.invalid : ""
  }`;
  const invalidCityClassesControl = `${classes.control} ${
    !formInputValidity.city ? classes.invalid : ""
  }`;
  const invalidStreetClassesControl = `${classes.control} ${
    !formInputValidity.street ? classes.invalid : ""
  }`;

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={invalidNameClassesControl}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameRef} />
        {!formInputValidity.name && <p>Enter Valid Name</p>}
      </div>
      <div className={invalidPostalClassesControl}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetRef} />
        {!formInputValidity.street && <p>Enter Valid Street</p>}
      </div>
      <div className={invalidCityClassesControl}>
        <label htmlFor="postal">Postal Code</label>
        <input type="text" id="postal" ref={postalRef} />
        {!formInputValidity.postal && <p>Enter Valid Postal Code</p>}
      </div>
      <div className={invalidStreetClassesControl}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityRef} />
        {!formInputValidity.city && <p>Enter Valid Name</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCheckoutCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
