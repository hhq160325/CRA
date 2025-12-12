import { getAllCars, uploadCarRegistrationDocuments } from '../../../ownerApi';

export const carRegisDocsService = {
  /* Fetch all cars belonging to the current user */
  async fetchUserCars(currentUserId) {
    const allCars = await getAllCars();
    return allCars.filter(car => car.owner?.id === currentUserId);
  },

  /* Upload car registration documents */
  async uploadDocuments(carId, userId, files) {
    return await uploadCarRegistrationDocuments(carId, userId, files);
  }
};