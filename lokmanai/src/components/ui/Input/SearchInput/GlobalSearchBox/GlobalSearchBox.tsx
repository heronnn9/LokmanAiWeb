import { GlobalSearchResponse } from '@/@interfaces/models/home';
import Icon from '@/components/ui/Icon';
import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import SearchedBrand from './Brands/SearchedBrand';
import SearchedProducts from './Products/SearchedProducts';
import SearchedUsers from './Users/SearchedUsers';

const GlobalSearchBox = ({
    data,
    value,
    //setValue,
    isLoading,
    handleCloseSearch,
}: {
    data: GlobalSearchResponse;
    value: string;
    setValue: (value: string) => void;
    isLoading: boolean;
    handleCloseSearch: () => void;
}) => {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
            className={classNames(
                'relative flex flex-col-reverse gap-8 border border-neutral-100 bg-neutral-0 px-4 py-6 md:flex-row md:px-8',
                BORDER_RADIUS_SM,
                'w-[92vw] xl:w-[968px]'
            )}
            style={{
                zIndex: 1000,
                boxShadow: '0px 8px 24px 2px rgba(0, 33, 71, 0.12)',
            }}
        >
            <button
                onClick={() => {
                    handleCloseSearch();
                }}
                className="absolute right-4 top-4"
            >
                <Icon
                    icon="x"
                    color="#546a84"
                />
            </button>
            <div className="flex w-[200px] flex-col gap-8">
                <SearchedUsers
                    users={data.users}
                    isLoading={isLoading}
                    handleCloseSearch={handleCloseSearch}
                />
                <hr className="border-primary-50" />
                <SearchedBrand
                    brands={data.brands}
                    isLoading={isLoading}
                    handleCloseSearch={handleCloseSearch}
                />
            </div>

            <div className="h-auto w-full">
                <SearchedProducts
                    products={data.products}
                    isLoading={isLoading}
                    handleCloseSearch={handleCloseSearch}
                    value={value}
                />
            </div>
        </div>
    );
};

export default GlobalSearchBox;
