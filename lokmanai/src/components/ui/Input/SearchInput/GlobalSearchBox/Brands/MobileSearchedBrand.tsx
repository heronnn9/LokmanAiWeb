import { GlobalSearchResponse } from '@/@interfaces/models/home';
import Skeleton from '@/components/ui/Loading/Skeleton/Skeleton';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import _ from 'lodash';
import Icon from '@/components/ui/Icon';

const MobileSearchedBrand = ({
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
        <div className="h-full w-full">
            <div className="scrollbar-custom flex h-full flex-col gap-2 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3"
                            >
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-8" />
                            </div>
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
                                className="flex flex-row items-center justify-between rounded-lg p-3 transition-all duration-100 ease-in-out hover:bg-primary-50 active:bg-primary-100"
                            >
                                <div className="font-narrow text-button-light text-primary-700">
                                    {_.truncate(brand.brandName, {
                                        length: 25,
                                    })}
                                </div>
                                <div
                                    className={classNames(
                                        'rounded-full bg-primary-50 px-3 py-1 font-narrow text-label text-primary-700',
                                        hoveredId === brand.brandId &&
                                            '!bg-primary-100'
                                    )}
                                >
                                    {brand.productCount}
                                </div>
                            </Link>
                        )
                    )
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 font-narrow text-button-light text-neutral-700">
                        <Icon
                            icon="placeholder"
                            color="#546a84"
                            size={48}
                        />
                        <div className="text-center">
                            <div className="text-heading-6 text-neutral-900">
                                Marka bulunamadı
                            </div>
                            <div className="mt-1 text-input-label text-neutral-600">
                                Farklı anahtar kelimeler deneyebilirsiniz
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileSearchedBrand;
