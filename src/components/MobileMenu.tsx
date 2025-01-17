'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import SideBarMobile from './SideBarMobile';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                className="text-primaryDark  p-2"
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <AiOutlineClose size={24} />
                ) : (
                    <AiOutlineMenu size={24} />
                )}
            </button>

            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 right-0 h-full w-2/3 bg-primaryLight  z-50 shadow-lg"
                >
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold text-primaryDark ">
                            Menu
                        </h2>
                        <button
                            className="text-primaryDark  p-2 z-50"
                            onClick={toggleMenu}
                            aria-label="Close menu"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                    <nav
                        className="flex flex-col gap-4 px-4 overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 64px)' }}
                    >
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-primaryDark  text-sm"
                                onClick={toggleMenu}
                            >
                                Home
                            </Link>
                            <Link
                                href="/cart"
                                className="text-primaryDark  text-sm"
                                onClick={toggleMenu}
                            >
                                Cart
                            </Link>
                            <Link
                                href="/login"
                                className="text-primaryDark  text-sm"
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                        </div>

                        <hr className="border-primaryDark " />

                        {/* Sidebar Options */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-lg font-bold text-primaryDark ">
                                Filtros
                            </h2>
                            <SideBarMobile toggleMenu={toggleMenu} />

                            <Link
                                href="/category/lingeries"
                                className="text-primaryDark  text-sm"
                            >
                                Lingeries
                            </Link>
                            <Link
                                href="/category/pijamas"
                                className="text-primaryDark  text-sm"
                            >
                                Pijamas
                            </Link>
                            <Link
                                href="/category/acessorios"
                                className="text-primaryDark  text-sm"
                            >
                                Acessórios
                            </Link>
                        </div>
                    </nav>
                </motion.div>
            )}
        </div>
    );
};

export default MobileMenu;
