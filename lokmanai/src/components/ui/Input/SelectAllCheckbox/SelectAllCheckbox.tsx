import Checkbox from '../Checkbox/Checkbox';

interface SelectAllCheckboxProps {
    isAllSelected: boolean;
    selectedCount: number;
    onSelectAll: () => void;
    className?: string;
    id?: string;
    name?: string;
    /**
     * Custom labels for different states
     */
    labels?: {
        selectAll?: string;
        clearSelection?: string;
    };
    /**
     * Whether to show the checkbox at all
     * Useful for conditional rendering based on status/permissions
     */
    visible?: boolean;
}

const SelectAllCheckbox = ({
    isAllSelected,
    selectedCount,
    onSelectAll,
    className,
    id = 'select-all-checkbox',
    name = 'select-all',
    labels = {
        selectAll: 'Hepsi',
        clearSelection: 'Seçimi Kaldır',
    },
    visible = true,
}: SelectAllCheckboxProps) => {
    if (!visible) return null;

    const getLabel = () => {
        if (selectedCount > 0) {
            return labels.clearSelection || 'Seçimi Kaldır';
        }
        return labels.selectAll || 'Hepsini Seç';
    };

    return (
        <div className={className}>
            <Checkbox
                checked={isAllSelected}
                onChange={onSelectAll}
                name={name}
                label={getLabel()}
                id={id}
            />
        </div>
    );
};

export default SelectAllCheckbox;
