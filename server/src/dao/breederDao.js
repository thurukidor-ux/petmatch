
import { UserModel } from '../models/User.js';

export const breederDao = {
  
  async getByEmail(email) {
    return await UserModel.findOne({ email });
  },

  
  async create(data) {
    return await UserModel.create(data);
  },


  async listPending() {
    return await UserModel.find({
      isVerified: false,
      kennelName: { $ne: '' },
    });
  },

  
  async updateVerification(id, { isVerified, role }) {
    return await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isVerified,
          role,
        },
      },
      { new: true }
    );
  },
};