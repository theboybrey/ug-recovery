import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FC } from "react";
import _ from "lodash";
import { classNames } from "@/utils";

interface TextareaInputProps {
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
    rows?: number;
    maxLength?: number;
    minLength?: number;
    labelHidden?: boolean;
}

const TextareaInput: FC<TextareaInputProps> = ({
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
    rows = 4,
    maxLength,
    minLength,
    labelHidden
}) => {

    return (
        <>
            {!labelHidden && (
                <label htmlFor={id} className="block text-sm font-medium text-text">
                    {label} {required ? <span className="text-red-500">*</span> : ""}
                </label>
            )}
            <div className={classNames(
                labelHidden ? "" : "mt-1",
                "relative"
            )}>
                <textarea
                    name={id}
                    id={id}
                    value={_.get(values, id)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder ?? ""}
                    rows={rows}
                    maxLength={maxLength}
                    minLength={minLength}
                    className={classNames(
                        _.get(errors, id) && _.get(touched, id) ? "text-red-500 focus:ring-red-500 focus:border-red-500 border-red-600" : "focus:ring-secondary  border-gray focus:border-secondary text-primary",
                        disabled ? "cursor-not-allowed bg-gray-100" : "",
                        "shadow-sm block w-full sm:text-sm rounded placeholder:font-light placeholder:text-xs border border-gray pl-3 pr-3 pt-2 pb-2 text-lg outline-none resize-none"
                    )}
                />
                {_.get(errors, id) && _.get(touched, id) ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AiOutlineExclamationCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>) : null
                }
            </div>
            {_.get(errors, id) && _.get(touched, id) ? (
                <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
                    {_.get(errors, id)}
                </p>) : null
            }
        </>
    )
}

export default TextareaInput;
