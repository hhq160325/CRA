import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    
    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">MORENT</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {t('footerVision')}
                        </p>
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('about')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('howItWorks')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('featured')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('partnership')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('businessRelation')}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Community Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('community')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('events')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('blog')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('podcast')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('inviteFriend')}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('socials')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('discord')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('instagram')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('twitter')}
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    {t('facebook')}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm">
                            {t('allRightsReserved')}
                        </p>
                        <div className="flex space-x-8 mt-4 md:mt-0">
                            <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                {t('privacyPolicy')}
                            </button>
                            <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                {t('termsCondition')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;