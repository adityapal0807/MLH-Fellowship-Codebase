"use client";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
const ImageData = {
  zara: "/zara.webp",
  roadster: "/roadster.jpg",
  xyxxcrew:"/xyxx.png",
  mango:"/mango.png"
};
const Navbar = () => {
  const params = useParams();
  const companyName = params.companyName as string;
  console.log(companyName, "aas");

  return (
    <nav className="flex justify-between items-center fixed w-full p-4 bg-white shadow-md mb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Decalist-AI Clothing Price Predictor
      </h1>
      <Image
        src={ImageData[companyName]}
        alt="Profile"
        width={100}
        height={100}
        className="rounded-full"
      />
    </nav>
  );
};

export default Navbar;
