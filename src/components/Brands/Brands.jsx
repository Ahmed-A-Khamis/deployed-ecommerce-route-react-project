import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export default function Brands() {
	const [allBrands, setAllBrands] = useState([]);
	const [isLoadingBrands, setIsLoadingBrands] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoadingBrandDetail, setIsLoadingBrandDetail] = useState(false);
	const onOpenModal = () => setIsModalOpen(true);
	const onCloseModal = () => setIsModalOpen(false);

	async function getBrands() {
		try {
			setIsLoadingBrands(true);
			let { data } = await axios.get(
				"https://ecommerce.routemisr.com/api/v1/brands"
			);

			setAllBrands(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingBrands(false);
		}
	}

	async function getSpecificBrand(brandId) {
		try {
			setIsLoadingBrandDetail(true);
			let { data } = await axios.get(
				`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`
			);

			setSelectedBrand(data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoadingBrandDetail(false);
		}
	}

	useEffect(() => {
		getBrands();
	}, []);

	return (
		<>
			<h2 className="text-3xl my-4">All Brands</h2>
			{isLoadingBrands ? (
				<Loading />
			) : allBrands ? (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 ">
					{allBrands.map((brand) => (
						<div
							onClick={() => {
								onOpenModal();
								getSpecificBrand(brand._id);
							}}
							key={brand._id}
							className="w-full bg-white border cursor-pointer border-gray-200 rounded-lg shadow hover:shadow-2xl hover:scale-[1.02] duration-500 "
						>
							<div>
								<img
									loading="lazy"
									className="rounded-t-lg w-full"
									src={brand.image}
									alt="product image"
								/>
							</div>
							<div className="p-5">
								<h5 className="text-xl font-semibold tracking-tight text-black  ">
									{brand.name}
								</h5>
							</div>
						</div>
					))}
				</div>
			) : (
				""
			)}
			{selectedBrand ? (
				<Modal
					open={isModalOpen}
					onClose={onCloseModal}
					showCloseIcon={true}
					blockScroll={false}
					animationDuration={500}
					center
				>
					{isLoadingBrandDetail ? (
						<Loading />
					) : (
						<div className="flex justify-center items-center flex-col md:flex-row">
							<div className="p-5">
								<h2 className="text-3xl text-green-600 font-semibold">
									{selectedBrand.name}
								</h2>
								<p className="text-lg text-gray-500">{selectedBrand.slug}</p>
							</div>
							<img src={selectedBrand.image} className="w-full" alt="" />
						</div>
					)}
				</Modal>
			) : (
				""
			)}
		</>
	);
}
