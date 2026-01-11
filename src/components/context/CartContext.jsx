import axios from "axios";
import { validateYupSchema } from "formik";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export let CartContext = createContext();

export default function CartContextProvider({ children }) {
	const [shoppingItems, setShoppingItems] = useState(null);
	const [numShoppingItems, setNumShoppingItems] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [authStatus, setAuthStatus] = useState(false);
	const [totalCost, setTotalCost] = useState(0);
	const [sessionId, setSessionId] = useState(null);
	let authHeaders = {
		token: localStorage.getItem("userToken"),
	};

	async function retrieveCartItems() {
		try {
			setIsProcessing(true);
			let { data } = await axios.get(
				"https://ecommerce.routemisr.com/api/v1/cart",
				{ headers: authHeaders }
			);

			setSessionId(data.data._id);
			setTotalCost(data.data.totalCartPrice);
			setShoppingItems(data.data.products);
			setNumShoppingItems(data.numOfCartItems);
		} catch (err) {
			setShoppingItems(0);
			setNumShoppingItems(0);
			console.log("Cart is empty");
		} finally {
			setIsProcessing(false);
		}
	}

	async function insertProductToCart(productId) {
		try {
			setIsProcessing(true);
			let { data } = await axios.post(
				"https://ecommerce.routemisr.com/api/v1/cart",
				{ productId },
				{ headers: authHeaders }
			);

			setTotalCost(data.data.totalCartPrice);
			setSessionId(data.data._id);
			setShoppingItems(data.data.products);
			setNumShoppingItems(data.numOfCartItems);
			toast.success("Product added successfully");
		} catch (err) {
			console.log(err);
		} finally {
			setIsProcessing(false);
		}
	}

	async function modifyProductQuantity(productId, count) {
		if (count > 0) {
			try {
				setIsProcessing(true);
				let { data } = await axios.put(
					`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
					{ count },
					{
						headers: authHeaders,
					}
				);

				setSessionId(data.data._id);
				setTotalCost(data.data.totalCartPrice);
				setShoppingItems(data.data.products);
				setNumShoppingItems(data.numOfCartItems);
				toast.success("Quantity updated");
			} catch (err) {
				console.log(err);
			} finally {
				setIsProcessing(false);
			}
		}
	}

	async function deleteProduct(productId) {
		try {
			setIsProcessing(true);
			let { data } = await axios.delete(
				`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
				{ headers: authHeaders }
			);
			setSessionId(data.data._id);
			setTotalCost(data.data.totalCartPrice);
			setShoppingItems(data.data.products);
			setNumShoppingItems(data.numOfCartItems);
			toast.success("Product removed from cart");
		} catch (err) {
			console.log(err);
		} finally {
			setIsProcessing(false);
		}
	}

	async function emptyCart() {
		try {
			setIsProcessing(true);
			let { data } = await axios.delete(
				"https://ecommerce.routemisr.com/api/v1/cart",
				{ headers: authHeaders }
			);

			setShoppingItems(null);
			setNumShoppingItems(0);
		} catch (err) {
			console.log(err);
		} finally {
			setIsProcessing(false);
		}
	}

	useEffect(() => {
		if (localStorage.getItem("userToken")) {
			setAuthStatus(true);
		} else {
			setAuthStatus(false);
			setNumShoppingItems(0);
		}

		if (authStatus) {
			retrieveCartItems();
		}
	}, [authStatus]);

	return (
		<CartContext.Provider
			value={{
				cart: shoppingItems,
				cartCount: numShoppingItems,
				setCartCount: setNumShoppingItems,
				getCartItems: retrieveCartItems,
				addProductToCart: insertProductToCart,
				loading: isProcessing,
				tokenStatus: authStatus,
				setTokenStatus: setAuthStatus,
				updateProductCount: modifyProductQuantity,
				removeProduct: deleteProduct,
				clearCart: emptyCart,
				totalPrise: totalCost,
				cartId: sessionId,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
