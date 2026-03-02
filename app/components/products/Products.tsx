"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

const productData: Product[] = [
  {
    id: 1,
    name: "Custom Wooden Keychain",
    price: 200,
    image: "/products/wood.jpg",
    category: "Wood",
  },
  {
    id: 2,
    name: "Metal Business Card",
    price: 999,
    image: "/products/metal.jpg",
    category: "Metal",
  },
  {
    id: 3,
    name: "Glass Trophy Engraving",
    price: 2499,
    image: "/products/glass.jpg",
    category: "Glass",
  },
  {
    id: 4,
    name: "Acrylic LED Logo",
    price: 3999,
    image: "/products/acrylic.jpg",
    category: "Acrylic",
  },
];

export default function Products() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
  };

  const increaseQty = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === id ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.qty,
    0,
  );

  const handlePayment = () => {
    const options = {
      key: "rzp_test_xxxxxxxxx", // 🔥 apna TEST key yaha daalo
      amount: totalPrice * 100,
      currency: "INR",
      name: "ArtPeak",
      description: "Test Transaction",
      handler: function (response: any) {
        alert("Payment Successful: " + response.razorpay_payment_id);
      },
      theme: {
        color: "#f97316",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12">
          Our <span className="text-orange-500">Products</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productData.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-xl shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={400}
                className="w-full h-56 object-cover rounded-t-xl"
              />
              <div className="p-5">
                <h3 className="text-white">{product.name}</h3>
                <p className="text-gray-400 mt-2">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-orange-600 py-2 rounded-lg text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-16 bg-gray-900 p-8 rounded-xl">
            <h3 className="text-white text-2xl mb-6">Your Cart</h3>

            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center text-white mb-4"
              >
                <div>
                  {item.product.name}
                  <div className="text-sm text-gray-400">
                    ₹{item.product.price}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => decreaseQty(item.product.id)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.product.id)}>
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeItem(item.product.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between text-orange-500 font-bold mt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 w-full bg-green-600 py-3 rounded-lg text-white"
            >
              Pay Now
            </button>
          </div>
        )}

        {orderSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl text-center max-w-md w-full">
              <CheckCircle size={60} className="text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold mt-4 text-black">
                Payment Successful!
              </h3>
              <p className="mt-2 text-black">
                Payment ID: <strong>{orderId}</strong>
              </p>

              {orderedItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-black text-sm mt-2"
                >
                  <span>
                    {item.product.name} (x{item.qty})
                  </span>
                  <span>₹{item.product.price * item.qty}</span>
                </div>
              ))}

              <div className="flex justify-between font-bold mt-4 text-black">
                <span>Total:</span>
                <span>₹{finalTotal}</span>
              </div>

              <button
                onClick={() => setOrderSuccess(false)}
                className="mt-6 w-full bg-black text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
