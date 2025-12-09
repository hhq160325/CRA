import React from 'react';
import { useTranslation } from 'react-i18next';

const formatDateTime = (iso) => new Date(iso).toLocaleString();

const ChatLogHistory = ({
  isOpen,
  onClose,
  selectedMessage,
  chatHistory,
  loadingChatHistory,
  responseText,
  setResponseText,
  handleSendResponse,
  sendingResponse,
  currentUserId,
  getStatusBadge,
  getPriorityBadge
}) => {
  const { t } = useTranslation();

  if (!isOpen || !selectedMessage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('messageDetails') || 'Message Details'}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Message Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('messageInformation') || 'Message Information'}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('fromInbox') || 'From'}</p>
                <p className="font-medium text-gray-900">{selectedMessage.sender}</p>
                <p className="text-xs text-gray-500">{selectedMessage.senderEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('dateInbox') || 'Date'}</p>
                <p className="font-medium text-gray-900">{formatDateTime(selectedMessage.date)}</p>
              </div>
              {selectedMessage.carName && (
                <>
                  <div>
                    <p className="text-gray-600">{t('car') || 'Car'}</p>
                    <p className="font-medium text-gray-900">{selectedMessage.carName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('carId') || 'Car ID'}</p>
                    <p className="font-medium text-gray-900">{selectedMessage.carId}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chat History */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('conversationHistory') || 'Conversation History'}</h3>
            {loadingChatHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">{t('noConversationHistory') || 'No conversation history available'}</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {chatHistory.map((chat, index) => {
                  const isCurrentUser = chat.senderId === currentUserId;
                  return (
                    <div
                      key={index}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          isCurrentUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                            {isCurrentUser ? t('you') || 'You' : selectedMessage.sender}
                          </span>
                          <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'} ml-2`}>
                            {formatDateTime(chat.createDate)}
                          </span>
                        </div>
                        {chat.title 
                        && (
                          <p className={`text-sm font-semibold mb-1 ${isCurrentUser ? 'text-white' : 'text-gray-900'}`}>
                            {chat.title}
                          </p>
                        )}
                        <p className={`text-sm whitespace-pre-wrap break-words ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
                          {chat.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Response Form */}
          <div>
            <div className="bg-gray-100 rounded-lg p-3 flex items-end gap-3">
              {/* Image Upload Button */}
              <button
                type="button"
                className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Text Input */}
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none resize-none overflow-hidden min-h-[40px] max-h-[200px] py-2"
                placeholder="Aa"
                rows="1"
                style={{
                  height: 'auto',
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
              />

              {/* Send Button */}
              <button
                onClick={handleSendResponse}
                disabled={!responseText.trim() || sendingResponse}
                className="flex-shrink-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {sendingResponse ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ChatLogHistory;
