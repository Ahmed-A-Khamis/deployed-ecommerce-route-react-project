import React, { useContext, useEffect } from "react";
import { WishlistContext } from "../context/WishlistContext";
import Loading from "../Loading/Loading";
import { CartContext } from "../context/CartContext";

export default function Wishlist() {
  let { wishlist, loading, removeFromWishlist, getWishlist, wishlistCount } =
    useContext(WishlistContext);

  let { addProductToCart } = useContext(CartContext);
  useEffect(() => {
    getWishlist();
  }, [wishlistCount]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : wishlist.length !== 0 ? (
        <div className="container mx-auto bg-gray-50 p-14" >
          <h2 className="text-3xl  mb-6">My wish List</h2>
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white p-4 mb-4 shadow-md rounded-lg hover:bg-gray-50"
            >
              <div className="w-1/3 md:w-1/6">
                <img
                  src={product.imageCover}
                  className="w-full h-auto max-w-full max-h-full"
                  alt={product.title}
                />
              </div>
              <div className="flex-1 text-center md:text-left md:ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.title}
                </h3>
                <p className="text-gray-700">{product.price} EGP</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline mb-2"
                >
                  <i className="fa fa-trash me-2"></i>
                  Remove
                </button>
                <button
                  onClick={() => addProductToCart(product.id)}
                  className="font-medium text-green-600 dark:text-green-500 hover:underline"
                >
                  <i className="fa-solid fa-cart-shopping text-green-600 me-2"></i>
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h3 className="text-3xl text-center my-36">Your Wishlist Is Empty</h3>
      )}
    </>
  );
}
