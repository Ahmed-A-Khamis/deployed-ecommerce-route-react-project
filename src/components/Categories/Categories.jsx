import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";

export default function Categories() {
	const [allCategories, setAllCategories] = useState([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [selectedSubCategories, setSelectedSubCategories] = useState(null);
	const [selectedCategoryName, setSelectedCategoryName] = useState(null);
	const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
	async function getCategories() {
		try {
			setIsLoadingCategories(true);
			const { data } = await axios.get(
				"https://ecommerce.routemisr.com/api/v1/categories"
			);

			setAllCategories(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingCategories(false);
		}
	}

	async function getSubCategories(categoryId) {
		try {
			setIsLoadingSubCategories(true);
			let { data } = await axios.get(
				`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`
			);
			setSelectedSubCategories(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingSubCategories(false);
		}
	}
	useEffect(() => {
		getCategories();
	}, []);

	return (
		<>
			<h2 className="text-3xl my-4">All Categories</h2>
			{isLoadingCategories ? (
				<Loading />
			) : allCategories ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 ">
					{allCategories.map((category) => (
						<div
							onClick={() => {
								getSubCategories(category._id);
								setSelectedCategoryName(category.name);
							}}
							key={category._id}
							className="w-full bg-white border cursor-pointer border-gray-200 rounded-lg shadow hover:shadow-2xl hover:scale-[1.02] duration-500 "
						>
							<div>
								<img
									loading="lazy"
									className="rounded-t-lg w-full h-[400px]"
									src={category.image}
									alt="product image"
								/>
							</div>
							<div className="p-5">
								<h5 className="text-xl font-semibold tracking-tight text-green-600">
									{category.name}
								</h5>
							</div>
						</div>
					))}
				</div>
			) : (
				""
			)}

			{selectedSubCategories ? (
				<h2 className="text-3xl py-4 my-8 text-center text-green-600 border-t">
					{selectedCategoryName}
				</h2>
			) : (
				""
			)}
			{isLoadingSubCategories ? (
				<Loading />
			) : selectedSubCategories ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
					{selectedSubCategories.map((category) => (
						<p
							key={category._id}
							className=" flex justify-center items-center shadow p-4 rounded-lg text-lg hover:shadow-2xl hover:scale-[1.01] duration-500"
						>
							{category.name}
						</p>
					))}
				</div>
			) : (
				""
			)}
		</>
	);
}
