/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';
//const fetch= require('node-fetch');
const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder, cartTotal } = props;
  
  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}
async function displayRazorpay() {
  const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  fetch(`/api/payment/orders/${cartTotal}`,{
             method : "post"
         })
         .then(res=>res.json())
         .then(result=>{
          const { amount, id: order_id, currency } = result;
           console.log("gggggggggggggggggggggggggggggg",result)
          const options = {
              key: "rzp_test_f8WOGXQ0CvJEOR", // Enter the Key ID generated from the Dashboard
              amount: amount,
              currency: currency,
              name: "Buyer's Stop",
              description: "Test Transaction",
              order_id: order_id,
              handler: async function (response) {
                  const data = {
                      orderCreationId: order_id,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpaySignature: response.razorpay_signature,
                  };
        
                  
                  //const result = await fetch.post("http://localhost:5000/payment/success", data);
                  
                  fetch("/api/payment/success",{
                    method : "post",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(res=>res.json())
                .then(resp=>{
                  alert(resp.msg);
                  placeOrder();
                })
        
              },
              prefill: {
                  name: "Buyer's Stop",
                  email: "buyer's-stop@gmail.com",
                  contact: "9999999999",
              },
              notes: {
                  address: "Soumya Dey Corporate Office",
              },
              theme: {
                  color: "#61dafb",
              },
          };
        
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
         })
         .catch(err=>{
           console.log(err)
          alert("Server error. Are you online?");
         })
         
 // const result = await axios.post("http://localhost:5000/payment/orders");


  
}

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        <Button
          variant='primary'
          text='Continue shopping'
          onClick={() => handleShopping()}
        />
        {authenticated ? (
          <Button
            variant='primary'
            text='Place Order'
            onClick={displayRazorpay}
          />
        ) : (
          <Button
            variant='primary'
            text='Proceed To Checkout'
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
