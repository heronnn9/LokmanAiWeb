import { GlobalSearchResponse } from '@/@interfaces/models/home';
import React from 'react';
import ProductListItemSkeleton from '@/components/shared/ui/cards/ProductListItem/ProductListItemSkeleton';
import ProductListItem from '@/components/shared/ui/cards/ProductListItem/ProductListItem';
import Link from 'next/link';
import GhostButton from '@/components/shared/ui/Button/GhostButton';
import Icon from '@/components/ui/Icon';

const MobileSearchedProducts = ({
    products,
    isLoading,
    handleCloseSearch,
    value,
}: {
    products: GlobalSearchResponse['products'];
    isLoading: boolean;
    handleCloseSearch: () => void;
    value: string;
}) => {
    return (
        <div className="h-full w-full">
            <div className="scrollbar-custom flex h-full w-full flex-col gap-3 overflow-y-auto">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <ProductListItemSkeleton
                            key={index}
                            size="search"
                        />
                    ))
                ) : products && products.length > 0 ? (
                    <>
                        {products
                            .slice(0, 10)
                            .map(
                                (
                                    item: GlobalSearchResponse['products'][number],
                                    index: number
                                ) => (
                                    <ProductListItem
                                        isFavorite={item.isFavorite}
                                        size="search"
                                        href={`/urun-ilanlari?pId=${item.productId}`}
                                        key={item.productId + '-' + index}
                                        product={item}
                                        handleCloseSearch={handleCloseSearch}
                                    />
                                )
                            )}
                        {products.length > 10 && (
                            <div className="bg-gradient-to-t sticky bottom-0 mx-auto flex w-fit justify-center rounded-lg bg-primary-50 from-neutral-0 via-neutral-0 to-transparent p-2">
                                <Link href={`/ara?q=${value}`}>
                                    <GhostButton
                                        hasArrowIcon
                                        variant="secondary"
                                        onClick={handleCloseSearch}
                                        className="w-full"
                                        size="xs"
                                    >
                                        {products.length - 10} Ürün Daha Gör
                                    </GhostButton>
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 font-narrow text-button-light text-neutral-700">
                        <Icon
                            icon="placeholder"
                            color="#546a84"
                            size={48}
                        />
                        <div className="text-center">
                            <div className="text-heading-6 text-neutral-900">
                                Ürün bulunamadı
                            </div>
                            <div className="mt-1 text-input-label text-neutral-600">
                                Farklı anahtar kelimeler deneyebilirsiniz
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {products && products.length > 0 && products.length <= 10 && (
                <div className="bg-gradient-to-t sticky bottom-0 mt-4 flex w-full justify-center from-neutral-0 via-neutral-0 to-transparent pt-6">
                    <Link href={`/ara?q=${value}`}>
                        <GhostButton
                            hasArrowIcon
                            variant="secondary"
                            onClick={handleCloseSearch}
                            className="w-full"
                        >
                            Tüm Ürünleri Gör
                        </GhostButton>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MobileSearchedProducts;
