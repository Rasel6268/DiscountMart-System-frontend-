// app/product/[id]/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaEnvelope,
  FaBoxOpen,
  FaTag,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { MdVerified, MdDiscount } from "react-icons/md";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";
import api from "@/config/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  const products = product?.data
  console.log(products);
  
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      // Handle the response structure - your API returns data directly
      const productData = response.data;
      setProduct(productData);
    
      
      // Fetch related products from same category
      if (productData.category?._id || productData.category) {
        fetchRelatedProducts(productData.category._id || productData.category);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product");
      router.push("/shop");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await api.get(`/products?category=${categoryId}&limit=4`);
      const products = response.data.data || response.data;
      if (products && Array.isArray(products)) {
        const filtered = products.filter(p => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleQuantityChange = (type) => {
    const stock = products?.quantity || products?.stock || 10;
    if (type === "increase" && quantity < stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const stock = products?.quantity || products?.stock || 0;
    if (stock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    
    const cartItem = {
      productId: products._id,
      name: products.name,
      price: products.discountPrice || products.regularPrice || products.price,
      quantity: quantity,
      image: products.images?.[0]?.url || products.images?.[0],
      sku: products.sku,
    };
    
    addToCart(cartItem);
    toast.success(`${quantity} × ${products.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(products._id)) {
      removeFromWishlist(products._id);
      toast.success(`${products.name} removed from wishlist`);
    } else {
      addToWishlist({
        productId: products._id,
        name: products.name,
        price: products.discountPrice || products.regularPrice || products.price,
        image: products.images?.[0]?.url || products.images?.[0],
      });
      toast.success(`${products.name} added to wishlist!`);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    try {
      const response = await api.post(`/products/${products._id}/reviews`, {
        rating,
        comment: reviewText,
      });
      
      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setReviewText("");
        setRating(0);
        fetchProductDetails();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const title = product?.name;
    const text = `Check out this amazing product: ${product?.name}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
    setShowShareModal(false);
  };

  const renderStars = (ratingValue, showNumber = true) => {
    const numRating = ratingValue || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-amber-400 text-sm" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-amber-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-amber-400 text-sm" />
        ))}
        {showNumber && (
          <span className="text-sm text-gray-500 ml-2">({numRating})</span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GiHandBag className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop" className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Get price values from your data structure
  const originalPrice = products?.regularPrice || products?.price || 0;
  const discountPrice = products?.discountPrice || products?.price || originalPrice;
  const discountPercentage = products?.discountPercentage || 
    (originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0);
  const stock = products?.quantity || products?.stock || 0;
  const isInStock = stock > 0 && products?.isActive !== false;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-amber-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-amber-600">Shop</Link>
          <span className="text-gray-400">/</span>
          {products?.category && (
            <>
              <Link href={`/shop?category=${products.category._id}`} className="text-gray-500 hover:text-amber-600">
                {products.category.name}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-800 truncate">{products?.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl overflow-hidden">
                {products?.images && products.images.length > 0 && products.images[selectedImage] ? (
                  <img
                    src={typeof products.images[selectedImage] === 'string' 
                      ? products.images[selectedImage] 
                      : products.images[selectedImage].url}
                    alt={products.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GiHandBag className="text-8xl text-amber-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      -{discountPercentage}%
                    </span>
                  )}
                  {products.isFeatured && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Featured
                    </span>
                  )}
                  {products.isFreeShipping && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Free Shipping
                    </span>
                  )}
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 right-4">
                  {isInStock ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      In Stock ({stock})
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {products?.images && products.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {products.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                        selectedImage === index ? "border-amber-500 shadow-md" : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <img 
                        src={typeof image === 'string' ? image : image.url} 
                        alt={`${products.name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              {/* Brand & SKU */}
              <div className="flex flex-wrap items-center gap-2">
                {products?.brand && (
                  <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {products.brand.name}
                  </span>
                )}
                {products?.sku && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    SKU: {products.sku}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{products?.name}</h1>

              {/* Ratings */}
              <div className="flex items-center flex-wrap gap-3">
                {renderStars(products?.averageRating || 0)}
                <span className="text-sm text-gray-500">
                  ({products?.totalReviews || 0} reviews)
                </span>
                {products?.totalSold > 0 && (
                  <span className="text-sm text-gray-500">
                    • {products.totalSold}+ sold
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline flex-wrap gap-3">
                <span className="text-3xl font-bold text-amber-600">
                  ৳{discountPrice.toFixed(2)}
                </span>
                {discountPrice !== originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                      Save ৳{(originalPrice - discountPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {products?.shortDescription && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {products?.shortDescription}
                  </p>
                </div>
              )}

              {/* Full Description Preview */}
              {products?.description && (
                <div className="text-gray-600">
                  <p className="line-clamp-3">{products.description.replace(/<[^>]*>/g, '')}</p>
                  <button 
                    onClick={() => setActiveTab("description")}
                    className="text-amber-600 text-sm font-medium mt-1 hover:underline"
                  >
                    Read more →
                  </button>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 transition rounded-l-lg"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= stock}
                      className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 transition rounded-r-lg"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {stock} items available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlist}
                  className="py-3 px-5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  {isInWishlist(product._id) ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-lg" />
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareModal(!showShareModal)}
                    className="py-3 px-5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <FaShareAlt />
                  </button>

                  {/* Share Modal */}
                  {showShareModal && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowShareModal(false)} />
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border p-3 z-50 min-w-[200px]">
                        <div className="space-y-2">
                          <button onClick={() => shareProduct("facebook")} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                            <FaFacebook className="text-blue-600" /> Facebook
                          </button>
                          <button onClick={() => shareProduct("twitter")} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                            <FaTwitter className="text-blue-400" /> Twitter
                          </button>
                          <button onClick={() => shareProduct("whatsapp")} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                            <FaWhatsapp className="text-green-500" /> WhatsApp
                          </button>
                          <button onClick={() => shareProduct("linkedin")} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                            <FaLinkedin className="text-blue-700" /> LinkedIn
                          </button>
                          <button onClick={() => shareProduct("email")} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2">
                            <FaEnvelope /> Email
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Delivery & Returns Info */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {product.isFreeShipping && (
                  <div className="flex items-start gap-3 text-sm">
                    <FaTruck className="text-amber-500 text-lg mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Free Delivery</p>
                      <p className="text-gray-500">Free shipping on this item</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 text-sm">
                  <FaUndo className="text-amber-500 text-lg mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Easy Returns</p>
                    <p className="text-gray-500">30 days easy return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <FaShieldAlt className="text-amber-500 text-lg mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Secure Payment</p>
                    <p className="text-gray-500">100% secure payment gateway</p>
                  </div>
                </div>
                {product.discountStartDate && product.discountEndDate && discountPercentage > 0 && (
                  <div className="flex items-start gap-3 text-sm bg-red-50 p-3 rounded-lg">
                    <MdDiscount className="text-red-500 text-lg mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Limited Time Offer</p>
                      <p className="text-red-600 text-xs">
                        Valid from {formatDate(product.discountStartDate)} to {formatDate(product.discountEndDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-6 px-6 min-w-max">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-medium transition relative ${
                    activeTab === tab
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose max-w-none">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p className="text-gray-500">No description available.</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 font-medium text-gray-600">SKU</span>
                    <span className="w-2/3 text-gray-800">{product.sku || "N/A"}</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 font-medium text-gray-600">Category</span>
                    <span className="w-2/3 text-gray-800">{product.category?.name || "N/A"}</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 font-medium text-gray-600">Brand</span>
                    <span className="w-2/3 text-gray-800">{product.brand?.name || "N/A"}</span>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <span className="w-1/3 font-medium text-gray-600">Stock Status</span>
                    <span className="w-2/3 text-gray-800">
                      {isInStock ? `In Stock (${stock} available)` : "Out of Stock"}
                    </span>
                  </div>
                  {product.subcategory && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-1/3 font-medium text-gray-600">Subcategory</span>
                      <span className="w-2/3 text-gray-800">{product.subcategory}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </div>
                    <div className="flex justify-center mt-1">
                      {renderStars(product.averageRating || 0, false)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on {product.totalReviews || 0} reviews
                    </div>
                  </div>
                </div>

                {/* Write Review */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Write a Review</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            {star <= rating ? (
                              <FaStar className="text-amber-400 text-2xl" />
                            ) : (
                              <FaRegStar className="text-gray-300 text-2xl hover:text-amber-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        placeholder="Share your experience with this product..."
                      />
                    </div>
                    <button
                      onClick={handleReviewSubmit}
                      className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="font-medium text-gray-800">
                                  {review.user?.name || "Anonymous"}
                                </span>
                                {review.verifiedPurchase && (
                                  <span className="flex items-center gap-1 text-xs text-green-600">
                                    <MdVerified /> Verified Purchase
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No reviews yet. Be the first to review!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 group cursor-pointer"
                  onClick={() => router.push(`/product/${relatedProduct._id}`)}
                >
                  <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-amber-100">
                    {relatedProduct.images && relatedProduct.images[0] ? (
                      <img
                        src={typeof relatedProduct.images[0] === 'string' 
                          ? relatedProduct.images[0] 
                          : relatedProduct.images[0].url}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GiHandBag className="text-5xl text-amber-300" />
                      </div>
                    )}
                    {relatedProduct.discountPercentage > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{Math.round(relatedProduct.discountPercentage)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-base font-bold text-amber-600">
                          ৳{(relatedProduct.discountPrice || relatedProduct.regularPrice || relatedProduct.price).toFixed(2)}
                        </span>
                        {relatedProduct.discountPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ৳{(relatedProduct.regularPrice || relatedProduct.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;