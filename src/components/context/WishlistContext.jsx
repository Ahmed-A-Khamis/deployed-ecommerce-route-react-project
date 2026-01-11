import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import toast from "react-hot-toast";

export let WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
	let { setTokenStatus, tokenStatus } = useContext(CartContext);
	const [isLoading, setIsLoading] = useState(false);
	const [favoriteItemCount, setFavoriteItemCount] = useState(null);
	const [favoriteItems, setFavoriteItems] = useState(null);
	const [favoriteItemIds, setFavoriteItemIds] = useState([]);
	let authHeaders = {
		token: localStorage.getItem("userToken"),
	};

	async function getFavorites() {
		try {
			setIsLoading(true);
			let { data } = await axios.get(
				"https://ecommerce.routemisr.com/api/v1/wishlist",
				{
					headers: authHeaders,
				}
			);

			setFavoriteItemCount(data.count);
			setFavoriteItems(data.data);
			setFavoriteItemIds(data.data.map((item) => item.id));
		} catch (error) {
			setFavoriteItemCount(0);
			setFavoriteItems(0);
		} finally {
			setIsLoading(false);
		}
	}
	async function addFavoriteItem(productId) {
		try {
			setIsLoading(true);
			let { data } = await axios.post(
				"https://ecommerce.routemisr.com/api/v1/wishlist",
				{ productId },
				{
					headers: authHeaders,
				}
			);

			setFavoriteItemCount(data.data.length);
			setFavoriteItemIds(data.data);
			toast.success(data.message);
		} catch (error) {
			setFavoriteItemCount(0);
			setFavoriteItemIds(0);
		} finally {
			setIsLoading(false);
		}
	}
	async function removeFavoriteItem(productId) {
		try {
			setIsLoading(true);
			let { data } = await axios.delete(
				`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,

				{
					headers: authHeaders,
				}
			);

			setFavoriteItemCount(data.data.length);
			setFavoriteItemIds(data.data);
			toast.error(data.message);
		} catch (error) {
			setFavoriteItemCount(0);
			setFavoriteItemIds(0);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (localStorage.getItem("userToken")) {
			setTokenStatus(true);
		} else {
			setTokenStatus(false);
			setFavoriteItemCount(0);
		}

		if (tokenStatus) {
			getFavorites();
		}
	}, [tokenStatus]);
	return (
		<WishlistContext.Provider
			value={{
				loading: isLoading,
				getWishlist: getFavorites,
				wishlist: favoriteItems,
				wishlistCount: favoriteItemCount,
				addToWishlist: addFavoriteItem,
				wishlistCheck: favoriteItemIds,
				removeFromWishlist: removeFavoriteItem,
			}}
		>
			{children}
		</WishlistContext.Provider>
	);
}
