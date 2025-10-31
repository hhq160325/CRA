
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">MORENT</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Our vision is to provide convenience and help increase your sales business.
                        </p>
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    How it works
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Featured
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Partnership
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Business Relation
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Community Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Events
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Blog
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Podcast
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Invite a friend
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Socials</h3>
                        <ul className="space-y-3">
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Discord
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Instagram
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Twitter
                                </button>
                            </li>
                            <li>
                                <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Facebook
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm">
                            ©2022 MORENT. All rights reserved
                        </p>
                        <div className="flex space-x-8 mt-4 md:mt-0">
                            <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Privacy & Policy
                            </button>
                            <button type="button" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Terms & Condition
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;