# DateRangePicker Component

A flexible date picker component that supports both single day and date range selection with three size options.

## Features

- ✅ 3 size options: `sm`, `md`, `lg`
- ✅ Single day selection
- ✅ Date range selection
- ✅ Turkish locale support
- ✅ Customizable styling
- ✅ Error handling
- ✅ Disabled/readonly states
- ✅ Min/max date constraints

## Usage

### Basic Single Day Selection

```tsx
import DateRangePicker from '@/components/shared/ui/Input/DateRangePicker';

const [selectedDate, setSelectedDate] = useState<Date | null>(null);

<DateRangePicker
    startDate={selectedDate}
    onChange={(startDate, endDate) => setSelectedDate(startDate)}
    placeholder="Tarih Seçiniz"
    inputSize="md"
    isRange={false}
    selectsRange={false}
/>
```

### Date Range Selection

```tsx
import DateRangePicker from '@/components/shared/ui/Input/DateRangePicker';

const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);

<DateRangePicker
    startDate={startDate}
    endDate={endDate}
    onChange={(start, end) => {
        setStartDate(start);
        setEndDate(end);
    }}
    placeholder="Tarih Aralığı Seçiniz"
    inputSize="lg"
    isRange={true}
    selectsRange={true}
/>
```

### Small Size with Error State

```tsx
<DateRangePicker
    startDate={startDate}
    endDate={endDate}
    onChange={handleDateChange}
    inputSize="sm"
    isError={true}
    errorMessage="Lütfen geçerli bir tarih seçiniz"
    label="Tarih Aralığı"
    required={true}
/>
```

### With Min/Max Date Constraints

```tsx
<DateRangePicker
    startDate={startDate}
    endDate={endDate}
    onChange={handleDateChange}
    minDate={new Date('2024-01-01')}
    maxDate={new Date('2024-12-31')}
    inputSize="md"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startDate` | `Date \| null` | - | Start date for range or single date |
| `endDate` | `Date \| null` | - | End date for range |
| `onChange` | `(startDate: Date \| null, endDate: Date \| null) => void` | - | Change handler |
| `placeholder` | `string` | `'Tarih Seçiniz'` | Input placeholder |
| `inputSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `isRange` | `boolean` | `true` | Enable range selection |
| `selectsRange` | `boolean` | `true` | ReactDatePicker selectsRange prop |
| `selectsMultiple` | `boolean` | `false` | Allow multiple date selection |
| `selectsStart` | `boolean` | `false` | Select start date only |
| `selectsEnd` | `boolean` | `false` | Select end date only |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabled` | `boolean` | `false` | Disable the input |
| `readOnly` | `boolean` | `false` | Make input readonly |
| `required` | `boolean` | `false` | Mark as required |
| `name` | `string` | `'dateRange'` | Input name |
| `id` | `string` | `'dateRange'` | Input ID |
| `label` | `string` | `''` | Input label |
| `isError` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | `''` | Error message |

## Size Specifications

| Size | Height | Width | Font Size | Icon Size |
|------|--------|-------|-----------|-----------|
| `sm` | 40px | 200px | 0.875rem | 20px |
| `md` | 56px | 300px | 1rem | 24px |
| `lg` | 64px | 350px | 1.125rem | 28px |

## Styling

The component uses the same styling approach as the existing ExpireDateInput component with:
- Calendar icon on the right
- Turkish locale support
- Custom header with month/year navigation
- Range selection highlighting
- Responsive design
- Error state styling 