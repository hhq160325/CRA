import { getUserLookupMap, getUserInfo } from '../api/inquiriesApi';

export class UserService {
  /* Fetch all users and create a lookup map */
  static async getUserLookupMap() {
    return getUserLookupMap();
  }

  /* Get user info by ID from the lookup map */
  static getUserInfo(userMap, userId) {
    return getUserInfo(userMap, userId);
  }
}