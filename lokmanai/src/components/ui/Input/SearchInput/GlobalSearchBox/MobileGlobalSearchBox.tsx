import { GlobalSearchResponse } from '@/@interfaces/models/home';
import Icon from '@/components/ui/Icon';
import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import { useState } from 'react';
import MobileSearchedBrand from './Brands/MobileSearchedBrand';
import MobileSearchedProducts from './Products/MobileSearchedProducts';
import MobileSearchedUsers from './Users/MobileSearchedUsers';

type TabType = 'products' | 'users' | 'brands';

const MobileGlobalSearchBox = ({
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
    const [activeTab, setActiveTab] = useState<TabType>('products');

    const tabs = [
        {
            id: 'products' as TabType,
            label: 'Ürünler',
            count: data.products?.length || 0,
        },
        {
            id: 'users' as TabType,
            label: 'Kullanıcılar',
            count: data.users?.length || 0,
        },
        {
            id: 'brands' as TabType,
            label: 'Markalar',
            count: data.brands?.length || 0,
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <MobileSearchedProducts
                        products={data.products}
                        isLoading={isLoading}
                        handleCloseSearch={handleCloseSearch}
                        value={value}
                    />
                );
            case 'users':
                return (
                    <MobileSearchedUsers
                        users={data.users}
                        isLoading={isLoading}
                        handleCloseSearch={handleCloseSearch}
                    />
                );
            case 'brands':
                return (
                    <MobileSearchedBrand
                        brands={data.brands}
                        isLoading={isLoading}
                        handleCloseSearch={handleCloseSearch}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
            className={classNames(
                'relative flex h-[80vh] w-full flex-col border border-neutral-100 bg-neutral-0',
                BORDER_RADIUS_SM
            )}
            style={{
                zIndex: 1000,
                boxShadow: '0px 8px 24px 2px rgba(0, 33, 71, 0.12)',
            }}
        >
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
                <h3 className="text-heading-6 font-narrow text-neutral-900">
                    Arama Sonuçları
                </h3>
                <button
                    onClick={() => {
                        handleCloseSearch();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-50"
                >
                    <Icon
                        icon="x"
                        color="#546a84"
                        size={20}
                    />
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-neutral-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={classNames(
                            'flex flex-1 items-center justify-center gap-2 py-3 font-narrow text-button-light transition-colors',
                            activeTab === tab.id
                                ? 'bg-primary-25 border-b-2 border-primary-500 text-primary-700'
                                : 'hover:bg-neutral-25 text-neutral-600 hover:text-neutral-700'
                        )}
                    >
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <span
                                className={classNames(
                                    'rounded-full px-2 py-0.5 text-label',
                                    activeTab === tab.id
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-neutral-100 text-neutral-600'
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-4">{renderContent()}</div>
        </div>
    );
};

export default MobileGlobalSearchBox;
