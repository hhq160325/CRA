import { getAllCars, getAllRegDocs, uploadCarRegistrationDocuments } from '../../../api/ownerApi';

export const carRegisDocsService = {
  /* Fetch all cars belonging to the current user with registration document status */
  async fetchUserCars(currentUserId) {
    try {
      // Fetch both cars and registration documents in parallel
      const [allCars, regDocsResponse] = await Promise.all([
        getAllCars(),
        getAllRegDocs()
      ]);

      console.log('RegDocs API Response:', regDocsResponse); // Debug log

      // Filter cars by current user
      const userCars = allCars.filter(car => car.owner?.id === currentUserId);

      // Extract registration documents array from response
      // The API response has a 'view' property containing the array
      const allRegDocs = regDocsResponse?.view || [];

      // Create a map of registration documents by carId for quick lookup
      const regDocsMap = new Map();
      if (Array.isArray(allRegDocs)) {
        allRegDocs.forEach(regDoc => {
          regDocsMap.set(regDoc.carId, regDoc);
        });
      }

      // Merge car data with registration document status
      const carsWithRegStatus = userCars.map(car => {
        const regDoc = regDocsMap.get(car.id);
        
        if (regDoc) {
          // Car has registration documents
          return {
            ...car,
            status: regDoc.status, // Use status from registration document (Approved, Denied, Pending)
            regDocCreateDate: regDoc.createDate,
            regDocUrls: regDoc.urls
          };
        } else {
          // Car has no registration documents uploaded
          return {
            ...car,
            status: 'No Upload', // Custom status for cars without registration documents
            regDocCreateDate: null,
            regDocUrls: null
          };
        }
      });

      return carsWithRegStatus;
    } catch (error) {
      console.error('Error fetching user cars with registration status:', error);
      throw error;
    }
  },

  /* Upload car registration documents */
  async uploadDocuments(carId, userId, files) {
    return await uploadCarRegistrationDocuments(carId, userId, files);
  }
};