
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
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    How it works
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Featured
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Partnership
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Business Relation
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Community Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Events
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Podcast
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Invite a friend
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Socials</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Discord
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Facebook
                                </a>
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
                            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Privacy & Policy
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Terms & Condition
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;