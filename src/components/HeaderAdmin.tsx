import Logo from '/public/images/LogoStylos.svg';

import Link from 'next/link';

const Header = () => {
    return (
        <header className="pt-2 pb-2 md:p-8 bg-primaryLight   flex justify-between items-center flex-col w-screen ">
            <div className='flex p-4 items-center justify-between w-full text-secondary "'>
                <div className="flex justify-start left w-32 ">
                    <Link href="/" passHref className="w-32 cursor-pointer">
                        <Logo />
                    </Link>
                </div>

                <div className="flex justify-center search"></div>
                <div className="flex justify-end gap-4 right"></div>
            </div>
        </header>
    );
};

export default Header;
