import { SelectOptionProps } from '@/@interfaces/input';
import classNames from 'classnames';
import React from 'react';

const Option: React.FC<SelectOptionProps> = ({
    value,
    name,
    updateValue,
    active,
    //isFilter,
}) => {
    return (
        <li
            className={classNames(
                'relative flex h-auto cursor-pointer select-none items-center border-b-[1px] border-neutral-100 px-4 py-2 text-primary-700 hover:bg-primary-50',
                { 'bg-primary-50': active }
            )}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                e.preventDefault();
                if (updateValue) {
                    updateValue(value, name);
                }
            }}
        >
            <span
                className={classNames(
                    'block whitespace-nowrap font-narrow text-input-placeholder text-primary-500'
                )}
            >
                {name}
            </span>
            {/* {active && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Icon
                        icon="check"
                        color="#002147"
                        size={24}
                    />
                </span>
            )} */}
        </li>
    );
};

export default Option;
