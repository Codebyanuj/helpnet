import React from 'react';
import user from '../components/Icons/user.png';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b to-gray-900 to 50% from-lime-900  text-white rounded-lg">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-cyan-500 p-2 rounded-full">
                            <span className="text-white text-2xl font-extrabold font-mono">H</span>
                        </div>
                        <span className="text-white text-2xl font-extrabold font-mono">Helpnet</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Resources</h2>
                            <ul className="text-gray-400">
                                <li className="mb-4">
                                    <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="/terms" className="hover:underline">Terms & Conditions</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Company</h2>
                            <ul className="text-gray-400">
                                <li className="mb-4">
                                    <a href="/about" className="hover:underline">About Us</a>
                                </li>
                                <li>
                                    <a href="/contact" className="hover:underline">Contact</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase">Connect</h2>
                            <ul className="text-gray-400">
                                <li className="mb-4">
                                    <a href="/facebook" className="hover:underline">Facebook</a>
                                </li>
                                <li>
                                    <a href="/twitter" className="hover:underline">Twitter</a>
                                </li>
                                <li>
                                    <a href="/linkedin" className="hover:underline">LinkedIn</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-400 sm:text-center">© 2024 HelpNet. All Rights Reserved.</span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <a href="/facebook" className="text-gray-400 hover:text-white mx-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h10v-9h-3v-3h3V8c0-2.8 2.2-5 5-5h3v3h-3c-.6 0-1 .4-1 1v2h4l-1 3h-3v9h5c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
                            </svg>
                        </a>
                        <a href="/twitter" className="text-gray-400 hover:text-white mx-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.6c-.9.4-1.8.7-2.8.8 1-.6 1.8-1.6 2.2-2.7-.9.6-1.9 1-3 1.2-.9-.9-2.1-1.5-3.5-1.5-2.6 0-4.6 2.1-4.6 4.6 0 .4 0 .9.1 1.3-3.8-.2-7.2-2-9.4-4.8-.4.7-.6 1.6-.6 2.4 0 1.6.8 3 2 3.8-.7 0-1.4-.2-2-.5v.1c0 2.2 1.6 4 3.7 4.4-.4.1-.8.1-1.2.1-.3 0-.6 0-.8-.1.6 1.8 2.2 3.1 4.1 3.1-1.5 1.2-3.4 1.8-5.4 1.8H3.5c1.9 1.2 4.3 1.9 6.8 1.9 8.2 0 12.7-6.8 12.7-12.7 0-.2 0-.4 0-.6.8-.6 1.6-1.4 2.2-2.3z" />
                            </svg>
                        </a>
                        <a href="/linkedin" className="text-gray-400 hover:text-white mx-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.45 0H3.55C1.58 0 0 1.58 0 3.55v16.91C0 22.42 1.58 24 3.55 24h16.9c1.97 0 3.55-1.58 3.55-3.55V3.55C24 1.58 22.42 0 20.45 0zM8.84 20.41H5.47V9h3.37v11.41zM7.15 7.62c-1.08 0-1.96-.88-1.96-1.96s.88-1.96 1.96-1.96 1.96.88 1.96 1.96-.88 1.96-1.96 1.96zM20.41 20.41h-3.37v-5.61c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.95v5.72h-3.37V9h3.23v1.56h.05c.45-.85 1.55-1.76 3.19-1.76 3.41 0 4.04 2.24 4.04 5.14v6.47z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
