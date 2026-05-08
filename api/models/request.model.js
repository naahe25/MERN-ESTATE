import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    listingRef: {
      type: String,
      required: true,
    },
    sellerRef: {
      type: String,
      required: true,
    },
    buyerRef: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    listingName: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    listingPrice: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
  },
  { timestamps: true },
);

const BuyerRequest = mongoose.model("BuyerRequest", requestSchema);

export default BuyerRequest;
