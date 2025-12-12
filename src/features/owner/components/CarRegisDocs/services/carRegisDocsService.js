import { getAllCars, uploadCarRegistrationDocuments } from '../../../ownerApi';

export const carRegisDocsService = {
  /**
   * Fetch all cars belonging to the current user
   * @param {string} currentUserId - The current user's ID
   * @returns {Promise<Array>} Array of user's cars
   */
  async fetchUserCars(currentUserId) {
    const allCars = await getAllCars();
    return allCars.filter(car => car.owner?.id === currentUserId);
  },

  /**
   * Upload car registration documents
   * @param {string} carId - The car ID
   * @param {string} userId - The user ID
   * @param {FileList} files - The files to upload
   * @returns {Promise} Upload result
   */
  async uploadDocuments(carId, userId, files) {
    return await uploadCarRegistrationDocuments(carId, userId, files);
  }
};