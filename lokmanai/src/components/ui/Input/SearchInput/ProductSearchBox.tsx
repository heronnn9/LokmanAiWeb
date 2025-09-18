import { ProductSearch } from '@/@interfaces/models/product';
import clsx from 'classnames';
import Icon from '../../Icon';
import ImageWithFallback from '../../ImageWithFallback';
import Skeleton from '../../Loading/Skeleton/Skeleton';
import Checkbox from '../Checkbox/Checkbox';

interface ProductSearchBoxProps {
    results: Partial<ProductSearch>[];
    searchText?: string;
    isLoading?: boolean;
    onSelectProduct: (product: ProductSearch) => void;
    onAddProduct?: () => void;
    isMultiSelect?: boolean;
    selectedProducts?: ProductSearch[];
    isNameTaken?: boolean;
}

const ProductSearchBox = ({
    results,
    searchText,
    isLoading,
    onSelectProduct,
    onAddProduct,
    isMultiSelect = false,
    selectedProducts = [],
    isNameTaken,
}: ProductSearchBoxProps) => {
    const isResultsValid = results.length > 0;
    const isProductSelected = (productId?: string | number | null) => {
        if (!productId) return false;
        return selectedProducts.some((p) => p.productId === productId);
    };

    return (
        <div
            className={clsx(
                'bg-neutral-0 absolute top-16 z-20 max-h-[320px] w-[368px] overflow-y-auto rounded-[4px] border border-neutral-100'
            )}
        >
            {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                          className="flex items-center gap-2 p-2"
                          key={index}
                      >
                          <Skeleton className="h-12 w-14 rounded-md" />
                          <Skeleton className="h-12 w-full" />
                      </div>
                  ))
                : isResultsValid &&
                  results.map((result) => (
                      <button
                          key={result.productId}
                          className="hover:bg-primary-50 flex w-full flex-row items-center gap-2 border-b border-neutral-100 px-2 py-2 text-left transition-all duration-100 ease-in-out"
                          onClick={() =>
                              onSelectProduct(result as ProductSearch)
                          }
                      >
                          {isMultiSelect && (
                              <Checkbox
                                  id={`${result.productId}-checkbox`}
                                  checked={isProductSelected(result.productId)}
                                  onChange={() => {}}
                              />
                          )}
                          <ImageWithFallback
                              src={result.thumbnailImage as string}
                              alt={result.productName || 'ürün resmi'}
                              width={48}
                              height={48}
                          />
                          <p className="text-product-price-text leading-[130%] text-neutral-700">
                              {result.productName}
                          </p>
                      </button>
                  ))}
            {searchText && onAddProduct && !isNameTaken && (
                <button
                    className="text-body text-primary-700 hover:bg-primary-50 inline-flex w-full items-center gap-4 px-2 py-2 text-left"
                    onClick={onAddProduct}
                >
                    <div className="flex h-12 w-12 items-center justify-center">
                        <Icon
                            icon="plus"
                            className="dark:brightness-0 dark:invert"
                            color="#001732"
                            size={20}
                        />
                    </div>
                    &quot;{searchText}&quot; adıyla yeni ürün ekle
                </button>
            )}
        </div>
    );
};

export default ProductSearchBox;
