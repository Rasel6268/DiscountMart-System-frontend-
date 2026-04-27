"use client";

import { useAuth } from "@/AuthProvider/AuthProvider";
import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  // Load user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        }
      });
    }
  }, [user]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex =
          /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
        if (!phoneRegex.test(value)) return "Invalid phone number format";
        return "";

      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) return "You must be at least 18 years old";
        if (age > 100) return "Invalid age";
        return "";

      case "bio":
        if (value.length > 500) return "Bio cannot exceed 500 characters";
        return "";

      case "address.street":
        if (!value.trim()) return "Street address is required";
        return "";

      case "address.city":
        if (!value.trim()) return "City is required";
        return "";

      case "address.state":
        if (!value.trim()) return "State is required";
        return "";

      case "address.zipCode":
        if (!value.trim()) return "ZIP code is required";
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) return "Invalid ZIP code format";
        return "";

      case "address.country":
        if (!value.trim()) return "Country is required";
        return "";

      default:
        return "";
    }
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        Object.keys(formData.address).forEach((addrKey) => {
          const error = validateField(
            `address.${addrKey}`,
            formData.address[addrKey],
          );
          if (error) newErrors[`address.${addrKey}`] = error;
        });
      } else if (key !== "profilePicture" && key !== "newsletter") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));

      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));

      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let value = "";
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      value = formData.address[addressField];
    } else {
      value = formData[name];
    }

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle save
  const handleSave = async () => {
    if (validateAll()) {
      console.log("Saving profile:", formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } else {
      const allFields = {};
      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          Object.keys(formData.address).forEach((addrKey) => {
            allFields[`address.${addrKey}`] = true;
          });
        } else if (key !== "profilePicture" && key !== "newsletter") {
          allFields[key] = true;
        }
      });
      setTouched(allFields);
    }
  };

  // Check if a field has an error
  const hasError = (fieldName) => {
    return touched[fieldName] && !!errors[fieldName];
  };

  // Get input classes based on validation state
  const getInputClasses = (fieldName, isEmptyField) => {
    const baseClasses =
      "w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2";

    if (!isEditing) {
      return `${baseClasses} bg-gray-50 border-gray-200 text-gray-600`;
    }

    if (isEmptyField && !touched[fieldName]) {
      return `${baseClasses} border-amber-300 focus:ring-amber-500 focus:border-amber-500`;
    }

    if (hasError(fieldName)) {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50`;
    }

    if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClasses} border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50`;
    }

    return `${baseClasses} border-gray-300 focus:ring-amber-500 focus:border-amber-500`;
  };

  // Check if field is empty
  const isEmpty = (value) => {
    return !value || (typeof value === "string" && !value.trim());
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Update your personal details and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaEdit className="text-sm" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-300"
              >
                <FaTimes className="text-sm" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaSave className="text-sm" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-xl border border-amber-100 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </span>
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                  <FaCamera className="text-xs" />
                </button>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Profile Picture
              </h4>
              <p className="text-gray-600 text-sm">
                Click the camera icon to change your photo
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-amber-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-amber-500" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.firstName)
                    ? "Please fill this field"
                    : "Enter your first name"
                }
                className={getInputClasses(
                  "firstName",
                  isEmpty(formData.firstName),
                )}
              />
              {hasError("firstName") && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
              {!isEditing &&
                isEmpty(formData.firstName) &&
                !hasError("firstName") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.lastName)
                    ? "Please fill this field"
                    : "Enter your last name"
                }
                className={getInputClasses(
                  "lastName",
                  isEmpty(formData.lastName),
                )}
              />
              {hasError("lastName") && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
              {!isEditing &&
                isEmpty(formData.lastName) &&
                !hasError("lastName") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.email)
                    ? "Please fill this field"
                    : "Enter your email"
                }
                className={getInputClasses("email", isEmpty(formData.email))}
              />
              {hasError("email") && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              {!isEditing && isEmpty(formData.email) && !hasError("email") && (
                <p className="text-amber-500 text-xs mt-1">
                  ⚠️ This field is empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.phone)
                    ? "Please fill this field"
                    : "Enter your phone number"
                }
                className={getInputClasses("phone", isEmpty(formData.phone))}
              />
              {hasError("phone") && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
              {!isEditing && isEmpty(formData.phone) && !hasError("phone") && (
                <p className="text-amber-500 text-xs mt-1">
                  ⚠️ This field is empty
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                className={getInputClasses(
                  "dateOfBirth",
                  isEmpty(formData.dateOfBirth),
                )}
              />
              {hasError("dateOfBirth") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.dateOfBirth) &&
                !hasError("dateOfBirth") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl border border-amber-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-amber-500" />
            Address Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.address.street)
                    ? "Please fill this field"
                    : "Enter your street address"
                }
                className={getInputClasses(
                  "address.street",
                  isEmpty(formData.address.street),
                )}
              />
              {hasError("address.street") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.street"]}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.address.street) &&
                !hasError("address.street") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.address.city)
                    ? "Please fill this field"
                    : "Enter your city"
                }
                className={getInputClasses(
                  "address.city",
                  isEmpty(formData.address.city),
                )}
              />
              {hasError("address.city") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.city"]}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.address.city) &&
                !hasError("address.city") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.address.state)
                    ? "Please fill this field"
                    : "Enter your state"
                }
                className={getInputClasses(
                  "address.state",
                  isEmpty(formData.address.state),
                )}
              />
              {hasError("address.state") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.state"]}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.address.state) &&
                !hasError("address.state") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.address.zipCode)
                    ? "Please fill this field"
                    : "Enter your ZIP code"
                }
                className={getInputClasses(
                  "address.zipCode",
                  isEmpty(formData.address.zipCode),
                )}
              />
              {hasError("address.zipCode") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.zipCode"]}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.address.zipCode) &&
                !hasError("address.zipCode") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditing}
                placeholder={
                  !isEditing && isEmpty(formData.address.country)
                    ? "Please fill this field"
                    : "Enter your country"
                }
                className={getInputClasses(
                  "address.country",
                  isEmpty(formData.address.country),
                )}
              />
              {hasError("address.country") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.country"]}
                </p>
              )}
              {!isEditing &&
                isEmpty(formData.address.country) &&
                !hasError("address.country") && (
                  <p className="text-amber-500 text-xs mt-1">
                    ⚠️ This field is empty
                  </p>
                )}
            </div>
          </div>
        </div>

    

        {/* Validation Summary */}
        {isEditing && Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 font-medium mb-2">
              Please fix the following errors:
            </p>
            <ul className="list-disc list-inside text-sm text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
