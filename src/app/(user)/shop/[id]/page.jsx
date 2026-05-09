// app/product/[id]/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaMinus,
  FaPlus,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { MdVerified } from "react-icons/md";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/config/api";
import ProductDetails from "@/components/ProductDetails";

const page = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    useEffect(() => {
    fetchProductDetails(id);
    }, [id]);
    const fetchProductDetails = async (id) => {
        try {
            const response = await api.get(`/products/${id}`);    
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };
    
    return <ProductDetails product={product} />;
};

export default page;

