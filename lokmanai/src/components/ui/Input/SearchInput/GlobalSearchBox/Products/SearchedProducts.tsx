import { GlobalSearchResponse } from '@/@interfaces/models/home';
import React from 'react';
import SearchHeader from '../SearchHeader/SearchHeader';
import ProductListItemSkeleton from '@/components/shared/ui/cards/ProductListItem/ProductListItemSkeleton';
import ProductListItem from '@/components/shared/ui/cards/ProductListItem/ProductListItem';
import Link from 'next/link';
import GhostButton from '@/components/shared/ui/Button/GhostButton';
import Icon from '@/components/ui/Icon';

const SearchedProducts = ({
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
            <div className="pb-6">
                <SearchHeader name="ÜRÜNLER" />
            </div>
            <div className="scrollbar-custom flex max-h-[480px] w-full flex-col gap-4 overflow-y-scroll pr-2 [overflow-clip-margin:12px] 3xl:max-h-[664px]">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <ProductListItemSkeleton
                            key={index}
                            size="search"
                        />
                    ))
                ) : products && products.length > 0 ? (
                    products.map(
                        (
                            item: GlobalSearchResponse['products'][number],
                            index: number
                        ) => (
                            <Link
                                href={`/urun-ilanlari?pId=${item.productId}`}
                                key={item.productId + '-' + index}
                                onClick={handleCloseSearch}
                            >
                                <ProductListItem
                                    isFavorite={item.isFavorite}
                                    size="search"
                                    product={item}
                                    href={`/urun-ilanlari?pId=${item.productId}`}
                                    handleCloseSearch={handleCloseSearch}
                                />
                            </Link>
                        )
                    )
                ) : (
                    <div className="flex h-[60dvh] flex-col items-center justify-center gap-4 font-narrow text-button-light text-neutral-700">
                        <Icon
                            icon="placeholder"
                            color="#546a84"
                            size={57}
                        />
                        Ürün bulunamadı
                    </div>
                )}
            </div>
            {products && products.length > 0 && (
                <div className="mt-8 flex w-full justify-end">
                    <Link href={`/ara?q=${value}`}>
                        <GhostButton
                            hasArrowIcon
                            variant="secondary"
                            onClick={handleCloseSearch}
                        >
                            Tüm Ürünleri Gör
                        </GhostButton>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SearchedProducts;
