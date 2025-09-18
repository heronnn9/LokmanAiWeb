// Loader view component
import React from 'react';
import Icon from '../../Icon';

const CheapestBasketLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex h-dvh w-dvw items-center justify-center bg-neutral-900/70">
            <div className="flex h-full flex-col items-center justify-center gap-11">
                <div className="animate-pulse">
                    <Icon
                        icon="fb-light"
                        size={60}
                    />
                </div>
                <p className="text-loader-mobile lg:text-loader text-center text-neutral-0">
                    Size en ucuz sepeti hazırlıyoruz, <br />
                    8.000 satıcının 240.000 ürünü taranıyor...
                </p>
            </div>
        </div>
    );
};

export default CheapestBasketLoader;
