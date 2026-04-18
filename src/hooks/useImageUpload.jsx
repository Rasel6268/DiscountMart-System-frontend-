import React from 'react';

const useImageUpload = () => {

    const handleImageUpload = async (file) => {};
    const handleImage = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        const uploadedResults = await Promise.all(files.map(uploadImage))


    }
    return {
        handleImageUpload,
        handleImage
    };
};

export default useImageUpload;