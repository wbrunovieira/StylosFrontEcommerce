import Image from 'next/image';

interface SimilarProductsProps {
    title: string;
    image: string;

    price: number;
    slug: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
    title,
    image,
    price,
    slug,
}) => {
    return (
        <div className="flex flex-col h-auto w-auto">
            <div className="flex border border-light rounded p-4 shadow">
                <div>
                    <Image
                        className="border rounded-md "
                        src={image}
                        alt="liz1"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="flex flex-col ml-2 ">
                    <h3 className=" text-fontColor  font-semibold text-sm">
                        {title}
                    </h3>
                    <div className="flex justify-start items-center gap-2">
                        <Image
                            src="/icons/heart-icon.svg"
                            alt="Heart Icon"
                            width={16}
                            height={16}
                            style={{ width: '16px', height: '16px' }}
                        />
                        <p className="text-xs mt-2 mb-2">Lista de Desejos</p>
                    </div>
                    <p className="flex justify-start text-sm text-fontColor   font-semibold text-center">
                        R$ {price},00
                    </p>
                    <div className="flex justify-center items-center py-2 mt-2 border border-light rounded">
                        <Image
                            src="/icons/cart-mini.svg"
                            alt="Heart Icon"
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimilarProducts;
