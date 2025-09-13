import { FC, useState } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineExclamationCircle } from "react-icons/ai";
import { MdOutlineDoNotDisturb } from "react-icons/md"; // "No Data" icon
import { classNames } from "@/utils";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelecCustomInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  value: string | number;
  options: SelectOption[];
  onChange: (selector: string, value: string | number) => void;
  error?: string;
  emptyIcon?: React.ComponentType;
}

const SelecCustomInput: FC<SelecCustomInputProps> = ({
  id,
  label,
  placeholder = "Select an option",
  disabled,
  required,
  value,
  options,
  onChange,
  error,
  emptyIcon: EmptyIcon = MdOutlineDoNotDisturb,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string | number) => {
    onChange(id, optionValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find(option => option.value === value)?.label || "";

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={classNames(
        label ? "mt-1" : "",
        "relative"
      )}>
        <button
          id={id}
          type="button"
          onClick={toggleDropdown}
          className={classNames(
            "w-full bg-white border border-gray rounded-md  pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary sm:text-sm",
            disabled ? "bg-gray-light cursor-not-allowed" : "bg-white text-text",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          )}
          disabled={disabled}
        >
          <span className={classNames(selectedLabel ? "text-black" : "text-gray-light")}>
            {selectedLabel || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {
                !isOpen? <AiOutlineDown className="h-5 w-5 text-gray" aria-hidden="true" />:<AiOutlineUp className="h-5 w-5 text-gray" aria-hidden="true" />
            }
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options.length === 0 ? (
              <li className="text-gray flex flex-col items-center justify-center cursor-not-allowed select-none relative py-2 pl-3 pr-9">
                <EmptyIcon className="h-5 w-5 mr-2" />
                No Data
              </li>
            ) : (
              options.map(option => (
                <li
                  key={option.value}
                  className={classNames(
                    "cursor-pointer select-none relative py-2 pl-3 pr-9 my-1",
                    value === option.value ? "text-white bg-secondary" : "text-text",
                    "hover:bg-secondary hover:text-white"
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SelecCustomInput;
