/* Transform raw inquiry data from API to component-friendly format */
export const transformInquiriesData = (inquiriesData, userMap, t) => {
  return inquiriesData.map(inquiry => {
    // Get sender info from user map
    const senderInfo = userMap[inquiry.senderId] || {
      name: t('inquiries.unknown'),
      email: t('inquiries.noData'),
      phone: t('inquiries.noData')
    };

    return {
      id: inquiry.id,
      inquiryId: `INQ${String(inquiry.id).padStart(3, '0')}`,
      senderId: inquiry.senderId,
      customer: senderInfo.name,
      customerEmail: senderInfo.email,
      customerPhone: senderInfo.phone,
      subject: inquiry.title,
      message: inquiry.content,
      carName: inquiry.carName || t('inquiries.noData'),
      carId: inquiry.carId || t('inquiries.noData'),
      date: new Date(inquiry.createDate).toLocaleString(t('locale'), {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: inquiry.status || 'pending',
      priority: inquiry.priority || 'medium',
      response: inquiry.response || null,
      responseDate: inquiry.responseDate ? new Date(inquiry.responseDate).toLocaleString() : null,
      mediaUrls: inquiry.mediaUrls || []
    };
  });
};