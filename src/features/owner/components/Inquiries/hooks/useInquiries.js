import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tokenUtils } from '../../../../auth/utils';
import { InquiryService, UserService } from '../services';
import { transformInquiriesData } from '../utils';

export const useInquiries = () => {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = tokenUtils.getUserId();

  const fetchInquiriesAndUsers = async () => {
    if (!currentUserId) {
      setError(t('inquiries.userNotLoggedIn'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch both inquiries and users in parallel using services
      const [inquiriesData, userMap] = await Promise.all([
        InquiryService.getInquiries(currentUserId),
        UserService.getUserLookupMap()
      ]);

      // Transform API data to match component structure
      const transformedData = transformInquiriesData(inquiriesData, userMap, t);
      setInquiries(transformedData);
    } catch (err) {
      console.error(t('inquiries.responseError'), err);
      setError(err.message || t('inquiries.cannotLoadInquiries'));
    } finally {
      setLoading(false);
    }
  };

  const updateInquiry = (updatedInquiry) => {
    setInquiries(prevInquiries =>
      prevInquiries.map(inq =>
        inq.id === updatedInquiry.id ? updatedInquiry : inq
      )
    );
  };

  useEffect(() => {
    fetchInquiriesAndUsers();
  }, [currentUserId]);

  return {
    inquiries,
    loading,
    error,
    updateInquiry,
    refetch: fetchInquiriesAndUsers
  };
};