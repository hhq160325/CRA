import { useTranslation } from 'react-i18next';
import { getStatusBadgeConfig } from '../utils/statusUtils';

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const config = getStatusBadgeConfig(status, t);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;