import React from 'react';
import { RadioGroupProps, RadioButtonProps } from '@/@interfaces/input';
import RadioButton from './RadioButton';
import InputLabel from '../shared/InputLabel';

const RadioGroup = ({
    label,
    options,
    value,
    onChange,
    isEvaluation = false,
}: RadioGroupProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <InputLabel>{label}</InputLabel>}
            <div className="flex gap-4">
                {options.map((option: RadioButtonProps) => (
                    <RadioButton
                        key={option.id}
                        id={option.id}
                        hasContainer={isEvaluation}
                        label={option.label}
                        value={option.value}
                        color={option.color}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
