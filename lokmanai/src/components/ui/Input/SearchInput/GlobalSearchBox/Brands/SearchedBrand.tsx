import { GlobalSearchResponse } from '@/@interfaces/models/home';
import Skeleton from '@/components/ui/Loading/Skeleton/Skeleton';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import SearchHeader from '../SearchHeader/SearchHeader';
import _ from 'lodash';

const SearchedBrand = ({
    brands,
    isLoading,
    handleCloseSearch,
}: {
    brands: GlobalSearchResponse['brands'];
    isLoading: boolean;
    handleCloseSearch: () => void;
}) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    return (
        <div className="flex flex-col gap-4">
            <SearchHeader name="MARKALAR" />
            <div className="scrollbar-custom flex max-h-[200px] flex-col gap-1 overflow-y-scroll 3xl:max-h-[288px]">
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-6 w-full"
                            />
                        ))}
                    </div>
                ) : brands.length > 0 ? (
                    brands.map(
                        (brand: GlobalSearchResponse['brands'][number]) => (
                            <Link
                                href={`/ara?m=${brand.brandId}`}
                                key={brand.brandId}
                                onMouseEnter={() => setHoveredId(brand.brandId)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={handleCloseSearch}
                                className="flex flex-row gap-2 px-1 py-2 transition-all duration-100 ease-in-out hover:bg-primary-50"
                            >
                                <div className="whitespace-nowrap font-narrow text-button-light text-primary-700">
                                    {_.truncate(brand.brandName, {
                                        length: 20,
                                    })}
                                </div>
                                <div
                                    className={classNames(
                                        'rounded bg-primary-50 px-2 font-narrow text-label text-primary-300',
                                        hoveredId === brand.brandId &&
                                            '!bg-neutral-0'
                                    )}
                                >
                                    {brand.productCount}
                                </div>
                            </Link>
                        )
                    )
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="font-narrow text-input-label text-neutral-700">
                            Marka bulunamadı
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchedBrand;
