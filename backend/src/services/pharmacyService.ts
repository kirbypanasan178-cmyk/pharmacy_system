import mongoose from "mongoose";
import Pharmacy from "../models/pharmacyModel";
import { geocodeAddress } from "../utils/geocode";

export const createPharmacyService = async (data: {
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
}) => {
  try {
    const location = await geocodeAddress(data.address);

    const pharmacy = await Pharmacy.create({
      name: data.name,
      address: data.address,
      phone: data.phone,
      isOpen: data.isOpen,
      location,
    });

    return pharmacy;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create pharmacy",
    );
  }
};

export const getPharmacyByIdService = async (pharmacyId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      throw new Error("Invalid pharmacy ID");
    }
    const pharmacy = await Pharmacy.findById(pharmacyId);

    return pharmacy;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get all pharmacy by Id",
    );
  }
};

export const getAllPharmaciesService = async () => {
  try {
    const pharmacies = await Pharmacy.find();

    return pharmacies;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get all pharmacies",
    );
  }
};

export const updatePharmacyService = async (
  pharmacyId: string,
  data: {
    name?: string;
    address?: string;
    phone?: string;
    isOpen?: boolean;
  },
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      throw new Error("Invalid pharmacy ID");
    }
    if (!pharmacyId) {
      throw new Error("Pharmacy ID is required");
    }

    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.isOpen !== undefined) updateData.isOpen = data.isOpen;

    if (data.address) {
      const location = await geocodeAddress(data.address);
      updateData.address = data.address;
      updateData.location = location;
    }

    const updated = await Pharmacy.findByIdAndUpdate(pharmacyId, updateData, {
      returnDocument: "after",
    });

    return updated;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update pharmacy",
    );
  }
};

export const deletePharmacyService = async (pharmacyId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      throw new Error("Invalid pharmacy ID");
    }
    const pharmacy = await Pharmacy.findByIdAndDelete(pharmacyId);

    if (!pharmacy) {
      throw new Error("Pharmacy not found");
    }

    return { message: "Pharmacy successfully deleted" };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete pharmacy",
    );
  }
};
