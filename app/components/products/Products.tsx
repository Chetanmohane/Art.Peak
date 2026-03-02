"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, CheckCircle } from "lucide-react";

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
  { id: 1, name: "Custom Wooden Keychain", price: 200, image: "/products/wood.jpg", category: "Wood" },
  { id: 2, name: "Metal Business Card", price: 999, image: "/products/metal.jpg", category: "Metal" },
  { id: 3, name: "Glass Trophy Engraving", price: 2499, image: "/products/glass.jpg", category: "Glass" },
  { id: 4, name: "Acrylic LED Logo", price: 3999, image: "/products/acrylic.jpg", category: "Acrylic" },
];

export default function Products() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [finalTotal, setFinalTotal] = useState(0);

  const upiID = "2729mohane2729@fam";

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
  };

  const increaseQty = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart
        .map((item) =>
          item.product.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  );

  const upiLink = `upi://pay?pa=${upiID}&pn=ArtPeak&am=${totalPrice}&cu=INR`;

  const confirmOrder = () => {
    const newOrderId =
      "ORD" + Math.floor(100000 + Math.random() * 900000);

    setOrderId(newOrderId);
    setOrderDate(new Date().toLocaleString());
    setOrderedItems(cart);
    setFinalTotal(totalPrice);

    setCart([]);
    setShowQR(false);
    setOrderSuccess(true);
  };

  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-white mb-12">
          Our <span className="text-orange-500">Products</span>
        </h2>

        {/* PRODUCT GRID */}
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
                <h3 className="text-white font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-400 mt-2">
                  ₹{product.price}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-2 rounded-lg text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CART */}
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
                    <Minus size={16} />
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.product.id)}>
                    <Plus size={16} />
                  </button>
                  <button onClick={() => removeItem(item.product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between text-orange-500 font-bold mt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="mt-6 space-y-4">
              <a
                href={upiLink}
                className="block w-full text-center bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white"
              >
                Pay via UPI App
              </a>

              <button
                onClick={() => setShowQR(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white"
              >
                Show QR Code
              </button>
            </div>
          </div>
        )}

        {/* QR POPUP */}
        {showQR && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-center max-w-sm w-full">
              <h3 className="text-xl font-bold text-black mb-4">
                Scan & Pay ₹{totalPrice}
              </h3>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`}
                alt="UPI QR"
                className="mx-auto"
              />

              <button
                onClick={confirmOrder}
                className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg"
              >
                I Have Paid
              </button>

              <button
                onClick={() => setShowQR(false)}
                className="mt-3 w-full bg-black text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS POPUP */}
        {orderSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-center max-w-md w-full">

              <CheckCircle size={60} className="text-green-600 mx-auto" />

              <h3 className="text-2xl font-bold mt-4 text-black">
                Order Confirmed!
              </h3>

              <p className="mt-2 text-black">
                Order ID: <strong>{orderId}</strong>
              </p>

              <p className="text-sm text-gray-600 mb-4">
                {orderDate}
              </p>

              {orderedItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm mt-2 text-black"
                >
                  <span>
                    {item.product.name} (x{item.qty})
                  </span>
                  <span>
                    ₹{item.product.price * item.qty}
                  </span>
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