'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { GlobalSearchResponse } from '@/@interfaces/models/home';
import _ from 'lodash';
import Skeleton from '@/components/ui/Loading/Skeleton/Skeleton';
import Icon from '@/components/ui/Icon';

const MobileSearchedUsers = ({
    users,
    isLoading,
    handleCloseSearch,
}: {
    users: GlobalSearchResponse['users'];
    isLoading: boolean;
    handleCloseSearch: () => void;
}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

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
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </div>
                ) : users.length > 0 ? (
                    users.map((user: GlobalSearchResponse['users'][number]) => (
                        <Link
                            href={`/satici-magazasi?sId=${user.customerId}`}
                            key={user.customerId}
                            onMouseEnter={() => setHoveredId(user.customerId)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={handleCloseSearch}
                            className="flex flex-row items-center justify-between rounded-lg p-3 transition-all duration-100 ease-in-out hover:bg-primary-50 active:bg-primary-100"
                        >
                            <div className="flex flex-row items-center gap-2">
                                {user.hasNegativeExperience && (
                                    <Icon
                                        icon="warning"
                                        color="#ff2b2b"
                                        size={16}
                                    />
                                )}
                                <div
                                    className={classNames(
                                        'font-narrow text-button-light',
                                        user.hasNegativeExperience
                                            ? 'text-danger-500'
                                            : 'text-primary-700'
                                    )}
                                >
                                    {_.truncate(user.nickName, {
                                        length: 20,
                                    })}
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    'rounded-full bg-primary-50 px-3 py-1 font-narrow text-label text-primary-700',
                                    hoveredId === user.customerId &&
                                        '!bg-primary-100'
                                )}
                            >
                                {user.totalCount}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 font-narrow text-button-light text-neutral-700">
                        <Icon
                            icon="placeholder"
                            color="#546a84"
                            size={48}
                        />
                        <div className="text-center">
                            <div className="text-heading-6 text-neutral-900">
                                Kullanıcı bulunamadı
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

export default MobileSearchedUsers;
