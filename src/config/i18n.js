import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ownerTranslations } from '../features/owner/components/CarRegisDocs/translate/carRegisDocsTranslate'
import { bookingManagementTranslations } from '../features/owner/components/BookingManagement/translate/bookingManagementTranslate'
import { rentalHistoryTranslate } from '../features/owner/components//RentalHistory/translate/rentalHistoryTranslate'
import { rentalHistoryTranslate as staffRentalHistoryTranslate } from '../features/staff/components/RentalMonitoring/translate/rentalHistoryTranslate'
import { maintenanceScheduleTranslate } from '../features/owner/components/MaintenanceSchedule/translate/maintenanceScheduleTranslate';
import { inquiriesTranslate } from '../features/owner/components/Inquiries/translate/inquiriesTranslate'
import { commonTranslate } from '../shared/translate/commonTranslate'
import { adminTranslate } from '../features/admin/translate/adminTranslate'
import { staffTranslate } from '../features/staff/translate/staffTranslate'
import { userTranslate } from '../features/user/translate/userTranslate'
import { ownerTranslate } from '../features/owner/translate/ownerTranslate'
import { carTranslate } from '../features/cars/translate/carTranslate'
import { paymentTranslate } from '../features/payment/translate/paymentTranslate'
import { usageTrackingTranslate } from '../features/owner/components/UsageTracking/translate/usageTrackingTranslate'
import { regDocsApprovedTranslate } from '../features/staff/components/RegDocsApproved/translate/regDocsApprovedTranslate'
import { driverLicenseApproveTranslate } from '../features/staff/components/DriverLicenseApprove/translate/driverLicenseApproveTranslate'
import { paymentOwnerTranslate } from '../features/owner/components/Payment/translate/paymentOwnerTranslate'
import { parkLotManagementTranslate } from '../features/owner/components/ParkLotManagement/translate/parkLotManagementTranslate'
const resources = {
  en: {
    translation: {
      // Locale
      locale: "en-US",

      //Common Translate
      ...commonTranslate.en.translation,

      // Admin Translate
      ...adminTranslate.en.translation,

      // Staff Translate
      ...staffTranslate.en.translation,

      //User Translate
      ...userTranslate.en.translation,

      //Owner Translate
      ...ownerTranslate.en.translation,

      // Maintenance Schedule Component
      ...maintenanceScheduleTranslate.en.translation,

      //Car Translate
      ...carTranslate.en.translation,

      //Payment Owner Translate
      ...paymentOwnerTranslate.en.translation,

      //Payment Translate
      ...paymentTranslate.en.translation,

      // Parklot Management Translate Component
      ...parkLotManagementTranslate.en.translation,

      // Usage Tracking Component
      ...usageTrackingTranslate.en.translation,

      // Rental History Component
      ...rentalHistoryTranslate.en.translation,

      // Staff Rental History Component
      ...staffRentalHistoryTranslate.en.translation,
      // Inquiries Component
      ...inquiriesTranslate.en.translation,
      // Booking Management Component
      ...bookingManagementTranslations.en.translation,

      // Payments Component
      ...paymentTranslate.en.translation,

      // Owner Translations
      ...ownerTranslations.en.translation,

      //Reg Docs Approved Translate
      ...regDocsApprovedTranslate.en.translation,

      //Driver License Approve Translate
      ...driverLicenseApproveTranslate.en.translation,
    }
  },
  vi: {
    translation: {
      // Locale
      locale: "vi-VN",

      //Common Translate
      ...commonTranslate.vi.translation,

      // Admin Translate
      ...adminTranslate.vi.translation,

      // Staff Translate
      ...staffTranslate.vi.translation,

      //User Translate
      ...userTranslate.vi.translation,

      //Owner Translate
      ...ownerTranslate.vi.translation,

      // Maintenance Schedule Component
      ...maintenanceScheduleTranslate.vi.translation,

      //Car Translate
      ...carTranslate.vi.translation,

      //Payment Translate
      ...paymentTranslate.vi.translation,

      // Parklot Management Translate Component
      ...parkLotManagementTranslate.vi.translation,

      // Usage Tracking Component
      ...usageTrackingTranslate.vi.translation,

      // Rental History Component
      ...rentalHistoryTranslate.vi.translation,

      // Staff Rental History Component
      ...staffRentalHistoryTranslate.vi.translation,

      // Inquiries Component
      ...inquiriesTranslate.vi.translation,

      // Booking Management Component
      ...bookingManagementTranslations.vi.translation,

      //Payment Owner Translate
      ...paymentOwnerTranslate.vi.translation,

      // Payments Component
      ...paymentTranslate.vi.translation,

      // Owner Translations
      ...ownerTranslations.vi.translation,

      //Reg Docs Approved Translate
      ...regDocsApprovedTranslate.vi.translation,

      //Driver License Approve Translate
      ...driverLicenseApproveTranslate.vi.translation,
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
export default i18n;
