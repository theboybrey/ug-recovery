import { InputAdornment, TextField } from "@mui/material";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FC } from "react";
import _ from "lodash";

interface TextInputProps {
    id: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    type?: "number" | "text" | "email" | "date" | "password";
    values: any;
    handleChange: any;
    handleBlur: any;
    errors?: any;
    touched?: any;
    step?: number;
    min?: number | string;
    max?: number | string;
    labelHidden?: boolean;
    maxLength?: number;
    minLength?: number;
    postText?: string;
    variant?: "outlined" | "filled" | "standard";
    rows?: number;
}

const TextInput: FC<TextInputProps> = ({
    id,
    type,
    step,
    values,
    handleChange,
    handleBlur,
    placeholder,
    label,
    errors,
    touched,
    required,
    maxLength,
    minLength,
    disabled,
    min,
    max,
    labelHidden,
    postText,
    variant = "outlined",
    rows = 1,
}) => {
    return (
        <>
            {!labelHidden && (
                <label htmlFor={id} className=" block text-sm font-medium text-text">
                    {label} {required ? <span className="text-red-500">*</span> : ""}
                </label>
            )}
            <TextField
                id={id}
                name={id}
                type={type ?? "text"}
                value={_.get(values, id)}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder ?? ""}
                disabled={disabled}
                required={required}
                variant={variant}
                rows={rows}
                inputProps={{
                    step,
                    min,
                    max,
                    maxLength,
                    minLength,
                }}
                error={Boolean(_.get(errors, id) && _.get(touched, id))}
                helperText={_.get(errors, id) && _.get(touched, id) ? _.get(errors, id) : ""}
                InputProps={{
                    endAdornment: postText ? (
                        <InputAdornment position="end">
                            <span className="text-gray-500 sm:text-sm">{postText}</span>
                        </InputAdornment>
                    ) : (
                        _.get(errors, id) &&
                        _.get(touched, id) && (
                            <InputAdornment position="end">
                                <AiOutlineExclamationCircle className="text-red-500" />
                            </InputAdornment>
                        )
                    ),
                    sx: {
                        paddingY: "0px", // Adjust the vertical padding
                        paddingX: "5px",
                        borderRadius: "10px", // Adjust the border radius
                        height: "3rem"
                    },
                }}
            InputLabelProps={{
                sx: {
                    fontSize: "0.875rem", // Adjust the label font size if needed
                },
            }}
            fullWidth
            className="mt"
            />
        </>
    );
};

export default TextInput;
