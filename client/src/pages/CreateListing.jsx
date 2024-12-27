import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(formData);

  // Function to handle image uploads
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      // Loop through selected files and upload them to Cloudinary
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: [...formData.imageUrls, ...urls],
        });
        setImageUploadError(false);
      } catch (err) {
        setImageUploadError("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 6 images.");
    }
  };

  // Function to upload a single image to Cloudinary
  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Mern-estate"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dpnjbcvr1/image/upload",
        formData
      );
      return response.data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({ ...formData, type: id });
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({ ...formData, [id]: checked });
    } else {
      setFormData({ ...formData, [id]: type === "number" ? +value : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) return setError("At least one image is required.");
    if (formData.regularPrice < formData.discountPrice) {
      return setError("Discount price cannot exceed regular price.");
    }

    setLoading(true);
    setError(false);

    try {
      const response = await axios.post("/api/listing/create", {
        ...formData,
        userRef: currentUser._id,
      });

      if (!response.data.success) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      navigate(`/listing/${response.data._id}`);
    } catch (err) {
      setError("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <label htmlFor="name">Enter the name of the listing:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border p-2"
          />
          <label htmlFor="description">Provide a description of the listing:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border p-2"
          />
          <label htmlFor="address">Enter the address of the property:</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="border p-2"
          />
          <label>Choose the type of listing:</label>
          <div className="flex gap-4">
            <input
              type="radio"
              id="sale"
              name="type"
              checked={formData.type === "sale"}
              onChange={handleChange}
            />
            <label htmlFor="sale">Sale</label>
            <input
              type="radio"
              id="rent"
              name="type"
              checked={formData.type === "rent"}
              onChange={handleChange}
            />
            <label htmlFor="rent">Rent</label>
          </div>
          <label htmlFor="bedrooms">Number of bedrooms:</label>
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            required
            className="border p-2"
          />
          <label htmlFor="bathrooms">Number of bathrooms:</label>
          <input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            required
            className="border p-2"
          />
          <label htmlFor="regularPrice">Regular price:</label>
          <input
            type="number"
            id="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
            placeholder="Regular Price"
            required
            className="border p-2"
          />
          <label htmlFor="discountPrice">Discount price (if any):</label>
          <input
            type="number"
            id="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            className="border p-2"
          />
          <label>Additional features:</label>
          <div className="flex gap-4">
            <input
              type="checkbox"
              id="offer"
              checked={formData.offer}
              onChange={handleChange}
            />
            <label htmlFor="offer">Offer</label>
            <input
              type="checkbox"
              id="parking"
              checked={formData.parking}
              onChange={handleChange}
            />
            <label htmlFor="parking">Parking</label>
            <input
              type="checkbox"
              id="furnished"
              checked={formData.furnished}
              onChange={handleChange}
            />
            <label htmlFor="furnished">Furnished</label>
          </div>
          <label htmlFor="files">Upload images of the property:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles([...e.target.files])}
            className="border p-2"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="bg-blue-500 text-white p-2"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white p-2"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;