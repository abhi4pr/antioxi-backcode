import Medicine from "../models/Medicine.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addMedicine = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !price) {
    throw new AppError("Required fields are missing", 400);
  }

  const imagePaths = req.fileUrls || [];

  const medicine = await Medicine.create({
    name,
    description,
    price,
    category,
    images: imagePaths,
  });

  res.status(201).json({
    message: "Medicine added successfully",
    medicine,
  });
});

// Get all medicines
export const getAllMedicines = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const medicines = await Medicine.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalMedicines = await Medicine.countDocuments();

  res.status(200).json({
    count: medicines.length,
    total: totalMedicines,
    page,
    totalPages: Math.ceil(totalMedicines / limit),
    medicines,
  });
});

// Get medicine by ID
export const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) throw new AppError("Medicine not found", 404);

  res.status(200).json({ medicine });
});

// Delete medicine
export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);

  if (!medicine) throw new AppError("Medicine not found", 404);

  res.status(200).json({
    message: "Medicine deleted successfully",
  });
});

// Update medicine
export const updateMedicine = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.files && req.files.length > 0) {
    updates.images = req.fileUrls || [];
  }

  const updatedMedicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedMedicine) throw new AppError("Medicine not found", 404);

  res.status(200).json({
    message: "Medicine updated successfully",
    medicine: updatedMedicine,
  });
});
