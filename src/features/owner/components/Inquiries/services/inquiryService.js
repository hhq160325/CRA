import { 
  getInquiries, 
  sendInquiryResponse, 
  closeInquiry 
} from '../api/inquiriesApi';

export class InquiryService {
  /* Fetch inquiries for a specific user */
  static async getInquiries(userId) {
    return getInquiries(userId);
  }

  /* Send a response to an inquiry */
  static async sendResponse(responseData) {
    return sendInquiryResponse(responseData);
  }

  /* Mark an inquiry as closed */
  static async closeInquiry(inquiryId) {
    return closeInquiry(inquiryId);
  }
}