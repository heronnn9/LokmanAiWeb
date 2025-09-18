import { BORDER_RADIUS_SM } from '@/constants/theme.constant';
import classNames from 'classnames';
import { formatDate } from 'date-fns';
import Spinner from '@/components/ui/Loading/Spinner/Spinner';

interface FarmaCommentProps {
    name?: string;
    comment?: string;
    date?: string;
    isSelf?: boolean;
    isRead?: boolean;
    isLoading?: boolean;
    error?: string;
}

const FarmaComment = ({
    name,
    comment,
    date,
    isSelf = false,
    isRead = false,
    isLoading = false,
    error,
}: FarmaCommentProps) => {
    if (!comment) return null;
    return (
        <div className="flex w-fit max-w-[600px] flex-col gap-2">
            <div
                className={classNames(
                    'text-input-label text-primary-700',
                    !isSelf ? 'self-start' : 'self-end'
                )}
            >
                {name}
            </div>
            <div
                className={classNames(
                    !isSelf
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-transparent text-neutral-900',
                    'border border-neutral-100 p-4 font-narrow text-input-placeholder',
                    BORDER_RADIUS_SM
                )}
            >
                {comment}
            </div>
            {/* Gotham 325 Yok date font-gotham-325 olmalı */}
            <div
                className={classNames(
                    'flex items-center gap-2 text-date text-primary-300',
                    !isSelf ? 'self-start' : 'self-end'
                )}
            >
                {!isLoading &&
                    (isRead ? (
                        <span className="text-date text-primary-300">
                            Okundu -{' '}
                        </span>
                    ) : (
                        <span className="text-date text-primary-300">
                            Gönderildi
                        </span>
                    ))}
                {date ? formatDate(date, 'dd.MM.yyyy HH:mm') : ''}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div
                    className={classNames(
                        'flex items-center gap-2 text-sm text-neutral-600',
                        !isSelf ? 'self-start' : 'self-end'
                    )}
                >
                    <Spinner size="sm" />
                    <span className="text-date text-primary-300">
                        Gönderiliyor...
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div
                    className={classNames(
                        'text-sm text-red-600',
                        !isSelf ? 'self-start' : 'self-end'
                    )}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default FarmaComment;
