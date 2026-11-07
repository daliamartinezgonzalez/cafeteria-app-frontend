import { ChevronDown } from 'lucide-react'
import './FilterSelect.css'

export default function FilterSelect({
    label,
    name,
    value,
    options = [],
    onChange,
    placeholder = 'Todos',
    disabled = false
}) {
    return (
        <div className="filter-select">
            <label className="filter-select__label" htmlFor={name}>
                {label}
            </label>

            <div className="filter-select__control-wrapper">
                <select
                    id={name}
                    name={name}
                    className="filter-select__control"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                >
                    <option value="">{placeholder}</option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="filter-select__icon" />
            </div>
        </div>
    )
}