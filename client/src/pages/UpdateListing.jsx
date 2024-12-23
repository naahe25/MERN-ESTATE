import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests

const UpdateListing = () => {
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
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      try {
        const urls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
      } catch (err) {
        setImageUploadError("Image upload failed.");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET"); // Replace with your Cloudinary upload preset

    const response = await axios.post("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", formData); // Replace with your Cloudinary cloud name
    return response.data.secure_url; // Return the secure URL of the uploaded image
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price cannot be higher than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border p-2"
          />
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border p-2"
          />
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required className="border p-2"
          />
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
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            required
            className="border p-2"
          />
          <input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            required
            className="border p-2"
          />
          <input
            type="number"
            id="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
            placeholder="Regular Price"
            required
            className="border p-2"
          />
          <input
            type="number"
            id="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            className="border p-2"
          />
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
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="border p-2"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            className="bg-blue-500 text-white p-2"
          >
            Upload Images
          </button>
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
          <button
            type="submit"
            className="bg-green-500 text-white p-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;