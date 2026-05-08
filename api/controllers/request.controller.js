import Listing from "../models/listing.model.js";
import BuyerRequest from "../models/request.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createRequest = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    if (!listingId) {
      return next(errorHandler(400, "Listing is required"));
    }

    if (!message || !message.trim()) {
      return next(errorHandler(400, "Message is required"));
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.user.id === listing.userRef) {
      return next(errorHandler(400, "You cannot send a request for your own listing"));
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer) {
      return next(errorHandler(404, "Buyer not found"));
    }

    const request = await BuyerRequest.create({
      listingRef: listing._id.toString(),
      sellerRef: listing.userRef,
      buyerRef: req.user.id,
      buyerName: buyer.username,
      buyerEmail: buyer.email,
      listingName: listing.name,
      listingType: listing.type,
      listingPrice: listing.offer ? listing.discountPrice : listing.regularPrice,
      message: message.trim(),
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getSellerRequests = async (req, res, next) => {
  try {
    const requests = await BuyerRequest.find({ sellerRef: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const markRequestRead = async (req, res, next) => {
  try {
    const request = await BuyerRequest.findById(req.params.id);
    if (!request) {
      return next(errorHandler(404, "Request not found"));
    }

    if (request.sellerRef !== req.user.id) {
      return next(errorHandler(403, "You can only update your own requests"));
    }

    request.status = "read";
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};
