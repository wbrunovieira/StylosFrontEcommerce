'use client';

import Image from 'next/image';

import PriceFilter from './PriceFilter';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
    useColorStore,
    useLoadingStore,
    useSelectionStore,
} from '@/context/store';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SuspenseWrapper from './SuspenseWrapper';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
}

interface Brand {
    id: string;
    name: string;
    imageUrl: string;
}
interface Color {
    id: string;
    name: string;
    hex: string;
}
interface Size {
    id: string;
    name: string;
}

interface SidebarMobileProps {
    toggleMenu: () => void;
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ toggleMenu }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreSizes, setShowMoreSizes] = useState(false);
    const searchParams = useSearchParams();

    gsap.registerPlugin(useGSAP);

    const router = useRouter();
    const pathname = usePathname();

    const selectedCategory = useSelectionStore(
        (state) => state.selectedCategory
    );
    const selectedBrand = useSelectionStore((state) => state.selectedBrand);

    const selectedColor = useColorStore((state) => state.selectedColor);
    const selectedSize = useSelectionStore((state) => state.selectedSize);

    const setSelectedCategory = useSelectionStore(
        (state) => state.setSelectedCategory
    );
    const setSelectedBrand = useSelectionStore(
        (state) => state.setSelectedBrand
    );

    const setSelectedColor = useColorStore((state) => state.setSelectedColor);
    const setSelectedSize = useSelectionStore((state) => state.setSelectedSize);
    const setSelectedMinPrice = useSelectionStore(
        (state) => state.setSelectedMinPrice
    );
    const setSelectedMaxPrice = useSelectionStore(
        (state) => state.setSelectedMaxPrice
    );

    let isHome = pathname === '/' || pathname.includes('/product/');

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleCategoryClick = (categoryId: string) => {
        isHome = pathname === '/' || pathname.includes('/product/');
        if (isHome) {
            router.push(`/filtered?category=${categoryId}`);
            toggleMenu();
        } else {
            setSelectedCategory(
                categoryId === selectedCategory ? null : categoryId
            );
        }
    };

    const handleBrandClick = (brandId: string) => {
        isHome = pathname === '/' || pathname.includes('/product/');
        if (isHome) {
            router.push(`/filtered?brand=${brandId}`);
            toggleMenu();
        } else {
            setSelectedBrand(brandId === selectedBrand ? null : brandId);
        }
    };

    const handleColorClick = (color: Color) => {
        isHome = pathname === '/' || pathname.includes('/product/');
        if (isHome) {
            router.push(`/filtered?color=${color.id}`);
            toggleMenu();
        } else {
            setSelectedColor(selectedColor?.id === color.id ? null : color);
        }
    };
    const handleSizeClick = (size: Size) => {
        isHome = pathname === '/' || pathname.includes('/product/');
        if (isHome) {
            router.push(`/filtered?size=${size.id}}`);
            toggleMenu();
        } else {
            setSelectedSize(selectedSize?.id === size.id ? null : size);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/category/all?page=1&pageSize=50`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                const fetchedCategories = data.categories.map(
                    (category: any) => {
                        const imageUrl =
                            category.props.imageUrl?.replace(
                                'http://localhost:3000/public',
                                '/icons'
                            ) || '/icons/default-image.png';
                        return {
                            id: category._id.value,
                            name: category.props.name,
                            slug: category.props.slug || 'localhost',
                            imageUrl,
                        };
                    }
                );

                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        const fetchSizes = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/size/all?page=1&pageSize=30`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                const sizeOrderMap: { [key: string]: number } = {
                    pp: 1,
                    p: 2,
                    m: 3,
                    g: 4,
                    gg: 5,
                    xg: 6,
                    g1: 7,
                    g2: 8,
                    g3: 9,
                    g5: 10,
                    eg: 11,
                    xl: 12,
                    xgg: 13,
                    '36': 14,
                    '38': 15,
                    '40': 16,
                    '42': 17,
                    '44': 18,
                    '50': 19,
                    '52': 20,
                    '54': 21,
                    '56': 22,
                    '58': 23,
                    '60': 24,
                };

                const fetchedSizes = data.size.map((size: any) => ({
                    id: size._id.value,
                    name: size.props.name.toLowerCase(),
                }));

                fetchedSizes.sort((a: Size, b: Size) => {
                    return (
                        (sizeOrderMap[a.name] || 999) -
                        (sizeOrderMap[b.name] || 999)
                    );
                });

                setSizes(fetchedSizes);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setSizes([]);
            }
        };

        const fetchColors = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/colors/all?page=1&pageSize=10`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                const fetchedColors = data.colors.map((color: any) => ({
                    id: color._id.value,
                    name: color.props.name,
                    hex: color.props.hex || '#00000',
                }));

                setColors(fetchedColors);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setColors([]);
                [];
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/brands/all?page=1&pageSize=10`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                const fetchedBrands = data.brands.map((brand: any) => ({
                    id: brand._id.value,
                    name: brand.props.name,
                    imageUrl:
                        brand.props.imageUrl || '/default-brand-image.png',
                }));
                setBrands(fetchedBrands);
            } catch (error) {
                console.error('Error fetching brands:', error);
                setBrands([]);
            }
        };

        fetchCategories();
        fetchBrands();
        fetchColors();
        fetchSizes();
    }, [BASE_URL]);

    useEffect(() => {
        if (pathname === '/' || pathname.includes('/product/')) {
            setSelectedCategory(null);
            setSelectedBrand(null);
            setSelectedSize(null);
            setSelectedMinPrice(null);
            setSelectedMaxPrice(null);

            setSelectedColor(null);
        }
    }, [
        pathname,
        setSelectedCategory,
        setSelectedBrand,
        setSelectedSize,
        setSelectedMinPrice,
        setSelectedMaxPrice,
        setSelectedColor,
    ]);

    const containerRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (containerRef?.current) {
                const sections =
                    containerRef?.current.querySelectorAll('.sidebar-section');
                gsap.fromTo(
                    sections,
                    { x: -200, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        stagger: 0.5,
                        duration: 2,
                        ease: 'power3.out',
                    }
                );
            }
        },
        { scope: containerRef }
    );

    return (
        <SuspenseWrapper>
            <nav
                className="flex flex-col gap-2 mr-4 rounded"
                ref={containerRef as React.RefObject<HTMLDivElement>}
            >
                <div className="sidebar-section flex flex-col w-48 border border-light bg-primaryLight  rounded p-4 mt-2 z-10">
                    <h2 className="bg-primaryLight text-xs text-primaryDark font-bold  text-xs tracking-wider mb-2">
                        Categorias
                    </h2>

                    <hr className="border-0 h-[1px] bg-gradient-to-r from-primary to-primary-light mb-4" />
                    <div
                        className={`overflow-hidden ${
                            showMoreCategories ? '' : 'h-24'
                        } transition-height duration-300 ease-in-out`}
                    >
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className={`flex items-center py-1 border-b border-light cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out  ${
                                    selectedCategory === category.id
                                        ? 'bg-primaryDark text-primaryLight font-bold tracking-wider antialiased border rounded p-4 '
                                        : ''
                                }`}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className="flex items-center py-2 space-x-2">
                                    <Image
                                        src={category.imageUrl}
                                        width={10}
                                        height={10}
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            objectFit: 'cover',
                                        }}
                                        alt={category.name}
                                        className="mr-2"
                                    />
                                    <div className="text-[0.6rem]">
                                        {capitalizeFirstLetter(category.name)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-2 bg-primaryLight  hover:text-primary transition duration-300 ease-in-out text-xs"
                        onClick={() =>
                            setShowMoreCategories(!showMoreCategories)
                        }
                    >
                        {showMoreCategories ? 'Ver menos' : 'Ver mais'}
                        <span
                            className={`ml-2 ${
                                showMoreCategories ? 'rotate-180' : ''
                            } transition-transform duration-300`}
                        >
                            ↓
                        </span>
                    </button>

                    <hr className="border-0 h-[1px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />
                </div>

                <div className="sidebar-section flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight  rounded z-10">
                    <h2 className="bg-primaryLight text-primaryDark font-bold  text-base tracking-wider rounded mb-2 text-xs tracking-wider mb-2">
                        Marcas
                    </h2>
                    <hr className="border-0 h-[1px] bg-gradient-to-r from-primary to-primary-light mb-4 " />
                    <div
                        className={`overflow-hidden ${
                            showMoreCategories ? '' : 'h-24'
                        } transition-height duration-300 ease-in-out`}
                    >
                        {brands.map((brand) => (
                            <div
                                key={brand.id}
                                className={`flex items-center py-1 border-b border-light cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out ${
                                    selectedBrand === brand.id
                                        ? 'bg-primaryDark text-primaryLight border font-bold tracking-wider rounded p-4'
                                        : ''
                                }`}
                                onClick={() => handleBrandClick(brand.id)}
                            >
                                <div className="flex items-center py-2 space-x-2">
                                    <Image
                                        src={brand.imageUrl}
                                        width={10}
                                        height={10}
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            objectFit: 'cover',
                                        }}
                                        alt={brand.name}
                                        className="mr-2 "
                                    />
                                    <div className="text-[0.6rem]">
                                        {capitalizeFirstLetter(brand.name)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-2 bg-primaryLight  hover:text-primary transition duration-300 ease-in-out text-xs"
                        onClick={() => setShowMoreBrands(!showMoreBrands)}
                    >
                        {showMoreBrands ? 'Ver menos' : 'Ver mais'}
                        <span
                            className={`ml-2 ${
                                showMoreCategories ? 'rotate-180' : ''
                            } transition-transform duration-300`}
                        >
                            ↓
                        </span>
                    </button>
                    <hr className="border-0 h-[1px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />
                </div>

                <div className="sidebar-section flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight  rounded">
                    <h2 className="bg-primaryLight text-primaryDark font-bold text-xs bg-primaryLight  text-base tracking-wider rounded mb-2 ">
                        Cores
                    </h2>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
                    <div className="flex gap-2 flex-wrap">
                        {colors.map((color) => (
                            <div
                                key={color.id}
                                className={`w-3 h-3 rounded-full cursor-pointer p-2 transform hover:scale-110 hover:shadow-lg transition duration-300 ease-in-out ${
                                    selectedColor?.id === color.id
                                        ? ' border rounded p-4 w-8 h-8 '
                                        : ''
                                }`}
                                style={{
                                    backgroundColor: color.hex,
                                    border: '1px solid #ddd',
                                }}
                                onClick={() => handleColorClick(color)}
                                title={color.name}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-section flex flex-col w-48 border border-light p-4 mt-2 bg-primaryLight  rounded">
                    <h2 className="text-primaryDark font-bold text-xs bg-primaryLight   tracking-wider rounded mb-2 ">
                        Tamanhos
                    </h2>
                    <hr className="border-0 h-[1px] bg-gradient-to-r from-primary to-primary-light mb-4" />
                    <div
                        className={`overflow-hidden ${
                            showMoreSizes ? '' : 'h-24'
                        } transition-height duration-300 ease-in-out`}
                    >
                        {sizes.map((size, index) => (
                            <div
                                key={size.id}
                                className={`border border-light rounded p-1 text-center text-xs cursor-pointer rounded p-2 hover:bg-primary transition duration-300 ease-in-out mt-2 ${
                                    selectedSize?.id === size.id
                                        ? 'bg-primaryDark text-primaryLight font-bold tracking-wider border'
                                        : ''
                                }`}
                                onClick={() => handleSizeClick(size)}
                            >
                                {capitalizeFirstLetter(size.name)}
                            </div>
                        ))}
                    </div>
                    <button
                        className="mt-2 bg-primaryLight  hover:text-primary transition duration-300 ease-in-out text-xs"
                        onClick={() => setShowMoreSizes(!showMoreSizes)}
                    >
                        {showMoreSizes ? 'Ver menos' : 'Ver mais'}
                        <span
                            className={`ml-2 ${
                                showMoreCategories ? 'rotate-180' : ''
                            } transition-transform duration-300`}
                        >
                            ↓
                        </span>
                    </button>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4 z-10" />
                </div>

                <PriceFilter isHome={isHome} />
            </nav>
        </SuspenseWrapper>
    );
};

export default SidebarMobile;
