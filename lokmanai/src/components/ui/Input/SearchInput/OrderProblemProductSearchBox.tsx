import { IOrderSP } from '@/@interfaces/models/orderProblem';
import classNames from 'classnames';
import ImageWithFallback from '../../ImageWithFallback';
import Spinner from '../../Loading/Spinner/Spinner';

const OrderProblemProductSearchBox = ({
    results = [],
    searchText,
    isLoading,
    onSelectProduct,
}: {
    results: Partial<IOrderSP>[];
    searchText: string;
    isLoading: boolean;
    onSelectProduct: (product: IOrderSP) => void;
}) => {
    return (
        <div
            className={classNames(
                'absolute left-0 top-16 z-50 flex max-h-[320px] w-full flex-col overflow-y-auto rounded-md border border-neutral-200 bg-neutral-0 shadow-lg'
            )}
        >
            {isLoading ? (
                <div className="flex h-32 w-full items-center justify-center">
                    <Spinner />
                </div>
            ) : results?.length > 0 ? (
                <div>
                    {results.map((product, index) => {
                        return (
                            <div
                                key={product.productId}
                                className={classNames(
                                    'flex cursor-pointer items-center justify-between p-2 hover:bg-neutral-50',
                                    {
                                        'border-b border-neutral-200':
                                            index < results.length - 1,
                                    }
                                )}
                                onMouseDown={() =>
                                    onSelectProduct(product as IOrderSP)
                                }
                            >
                                <div className="flex items-center gap-3 pl-2">
                                    <ImageWithFallback
                                        src={product.thumbnailImage || ''}
                                        alt={product.productName || ''}
                                        width={40}
                                        height={40}
                                        className="rounded-md"
                                    />
                                    <p className="text-sm text-neutral-700">
                                        {product.productName}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex h-32 w-full flex-col items-center justify-center gap-2">
                    <p className="text-button-md text-primary-500">
                        &quot;{searchText}&quot; için sonuç bulunamadı
                    </p>
                </div>
            )}
        </div>
    );
};

export default OrderProblemProductSearchBox;
