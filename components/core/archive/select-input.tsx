import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FC } from "react";
import { MdOutlineDoNotDisturb } from "react-icons/md"; // Import an icon for "No Data"
import _ from "lodash";
import { classNames } from "@/utils";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    id: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    values: any;
    handleChange: any;
    handleBlur: any;
    errors?: any;
    touched?: any;
    options: SelectOption[];
    labelHidden?: boolean;
    variant?: "outlined" | "filled" | "standard";
    errorIcon?: React.ComponentType;
    emptyIcon?: React.ComponentType;  // Optional prop for custom "No Data" icon
}

const SelectInput: FC<SelectInputProps> = ({
    id,
    values,
    handleChange,
    handleBlur,
    placeholder,
    label,
    errors,
    touched,
    required,
    disabled,
    options,
    labelHidden,
    variant = "outlined",
    errorIcon: ErrorIcon = AiOutlineExclamationCircle,
    emptyIcon: EmptyIcon = MdOutlineDoNotDisturb,
}) => {
    const isOptionsEmpty = options.length === 0;
    const selectedValue = _.get(values, id, ""); // Default to empty string if not set

    return (
        <FormControl
            fullWidth
            variant={variant}
            error={Boolean(_.get(errors, id) && _.get(touched, id))}
            disabled={disabled || isOptionsEmpty}
        >
            {!labelHidden && (
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Select
                labelId={`${id}-label`}
                id={id}
                value={selectedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                displayEmpty
                inputProps={{
                    "aria-label": label,
                    "placeholder": placeholder,
                }}
                variant={variant}
                MenuProps={{
                    PaperProps: {
                        className: classNames(
                            disabled || isOptionsEmpty ? "cursor-not-allowed bg-gray-100" : "bg-white text-black",
                        ),
                    },
                }}
                sx={{
                    paddingY: "0px", // Adjust the vertical padding
                    paddingX: "5px",
                    borderRadius: "10px", // Adjust the border radius
                    height: "3rem",
                }}
            >
                <MenuItem value="" disabled>
                    {`--- ${placeholder || "Select an option"} ---`}
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {_.get(errors, id) && _.get(touched, id) && (
                <>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ErrorIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                    <FormHelperText>
                        {_.get(errors, id)}
                    </FormHelperText>
                </>
            )}
        </FormControl>
    );
};

export default SelectInput;
