'use client';
import React, { useState } from 'react';
import SearchHeader from '../SearchHeader/SearchHeader';
import Link from 'next/link';
import classNames from 'classnames';
import { GlobalSearchResponse } from '@/@interfaces/models/home';
import _ from 'lodash';
import Skeleton from '@/components/ui/Loading/Skeleton/Skeleton';
import Icon from '@/components/ui/Icon';

const SearchedUsers = ({
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
        <div className="flex flex-col gap-4">
            <SearchHeader name="KULLANICILAR" />
            <div className="scrollbar-custom 3xl:max-h-[318px] flex max-h-[200px] flex-col gap-1 overflow-x-hidden overflow-y-scroll">
                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-6 w-full"
                            />
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
                            className="hover:bg-primary-50 flex flex-row items-center gap-2 px-1 py-2 transition-all duration-100 ease-in-out"
                        >
                            <div className="flex flex-row items-center gap-1">
                                {user.hasNegativeExperience && (
                                    <Icon
                                        className="dark:brightness-0 dark:invert"
                                        icon="warning"
                                        color="#ff2b2b"
                                        size={16}
                                    />
                                )}
                                <div
                                    className={classNames(
                                        'font-narrow text-button-light whitespace-nowrap',
                                        user.hasNegativeExperience
                                            ? 'text-danger-500'
                                            : 'text-primary-700'
                                    )}
                                >
                                    {_.truncate(user.nickName, {
                                        length: user.hasNegativeExperience
                                            ? 12
                                            : 14,
                                    })}
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    'bg-primary-50 font-narrow text-label text-primary-300 rounded px-2',
                                    hoveredId === user.customerId &&
                                        '!bg-neutral-0'
                                )}
                            >
                                {user.totalCount}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="font-narrow text-input-label text-neutral-700">
                            Kullanıcı bulunamadı
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchedUsers;
