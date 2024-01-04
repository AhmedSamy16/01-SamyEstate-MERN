import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    regularPrice: {
        type: Number,
        required: [true, "Regular Price is required"]
    },
    discountPrice: {
        type: Number,
        required: [true, "Discount Price is required"]
    },
    bathrooms: {
        type: Number,
        required: [true, "Bathrooms number is required"]
    },
    bedrooms: {
        type: Number,
        required: [true, "Bedrooms number is required"]
    },
    furnished: {
        type: Boolean,
        required: [true, "Furnished is required"],
        default: false
    },
    parking: {
        type: Boolean,
        required: [true, "Parking is required"],
        default: false
    },
    type: {
        type: String,
        required: [true, "Type is required"]
    },
    offer: {
        type: Boolean,
        required: true,
        default: false
    },
    imageUrls: {
        type: [String],
        default: []
    },
    userRef: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required"]
    }
}, {
    timestamps: true
})

const Listing = mongoose.model<IListing>("Listing", listingSchema)

export default Listing