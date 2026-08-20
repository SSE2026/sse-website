"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

/* ============================================
   Input Component - Swift Safe Energy
   ============================================ */

const inputVariants = cva(
  [
    "flex w-full rounded-lg border bg-[#0F172A]",
    "text-[#F9FAFB] placeholder:text-[#64748B]",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-[#334155]",
          "hover:border-[#475569]",
          "focus:border-[#F59E0B] focus:ring-[#F59E0B]/30",
        ].join(" "),

        error: [
          "border-[#EF4444]",
          "hover:border-[#EF4444]/80",
          "focus:border-[#EF4444] focus:ring-[#EF4444]/30",
        ].join(" "),

        success: [
          "border-[#10B981]",
          "hover:border-[#10B981]/80",
          "focus:border-[#10B981] focus:ring-[#10B981]/30",
        ].join(" "),

        ghost: [
          "border-transparent bg-transparent",
          "hover:bg-white/[0.05]",
          "focus:bg-[#0F172A] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30",
        ].join(" "),
      },

      inputSize: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",  // Default
        lg: "h-12 px-5 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={inputType}
            id={id}
            className={cn(
              inputVariants({ variant: hasError ? "error" : variant, inputSize }),
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-[#EF4444] flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-[#64748B]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ============================================
   Select Component
   ============================================ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, size = "md", id, ...props }, ref) => {
    const hasError = !!error;
    const sizeClasses = {
      sm: "h-8 pl-3 pr-8 text-sm",
      md: "h-10 pl-4 pr-10 text-sm",
      lg: "h-12 pl-5 pr-12 text-base",
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={id}
            className={cn(
              "flex w-full appearance-none rounded-lg border bg-[#0F172A]",
              "text-[#F9FAFB] transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              hasError
                ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30"
                : "border-[#334155] hover:border-[#475569] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30",
              "bg-no-repeat bg-[right_0.75rem_center]",
              "[&::-ms-expand]:hidden",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-[#EF4444] flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-[#64748B]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

/* ============================================
   Checkbox Component
   ============================================ */

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string | React.ReactNode;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, id, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={id}
            ref={innerRef}
            className={cn(
              "peer h-5 w-5 shrink-0 rounded border cursor-pointer",
              "appearance-none bg-[#0F172A]",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[#EF4444] focus:ring-[#EF4444]/30 peer-checked:bg-[#EF4444]"
                : "border-[#334155] hover:border-[#475569] focus:ring-[#3B82F6]/30 peer-checked:bg-[#3B82F6] peer-checked:border-[#3B82F6]",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />

          {/* Checkmark */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white pointer-events-none hidden peer-checked:block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          {/* Indeterminate */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-2.5 bg-white pointer-events-none hidden indeterminate:block" />
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {typeof label === "string" ? (
              <label htmlFor={id} className="text-sm font-medium text-[#E2E8F0] cursor-pointer">
                {label}
              </label>
            ) : (
              <div className="text-sm font-medium text-[#E2E8F0]">{label}</div>
            )}
            {description && (
              <p className="text-sm text-[#64748B]">{description}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-[#EF4444] flex items-center gap-1 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/* ============================================
   Radio Component
   ============================================ */

export interface RadioGroupProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
  required?: boolean;
}

const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ className, label, error, children, orientation = "vertical", required }, ref) => {
    return (
      <fieldset ref={ref} className={cn("w-full", className)}>
        {label && (
          <legend className="text-sm font-medium text-[#E2E8F0] mb-3">
            {label}
            {required && <span className="text-[#EF4444] ml-1">*</span>}
          </legend>
        )}
        <div
          className={cn(
            "space-y-3",
            orientation === "horizontal" && "flex flex-row flex-wrap gap-4"
          )}
        >
          {children}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string | React.ReactNode;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            id={id}
            ref={ref}
            className={cn(
              "peer h-5 w-5 shrink-0 rounded-full border cursor-pointer",
              "appearance-none bg-[#0F172A]",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "border-[#334155] hover:border-[#475569]",
              "focus:ring-[#3B82F6]/30",
              "peer-checked:bg-[#3B82F6] peer-checked:border-[#3B82F6]",
              className
            )}
            {...props}
          />

          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white pointer-events-none hidden peer-checked:block" />
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {typeof label === "string" ? (
              <label htmlFor={id} className="text-sm font-medium text-[#E2E8F0] cursor-pointer">
                {label}
              </label>
            ) : (
              <div className="text-sm font-medium text-[#E2E8F0]">{label}</div>
            )}
            {description && (
              <p className="text-sm text-[#64748B]">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

/* ============================================
   Switch Component
   ============================================ */

export interface SwitchProps {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, error, size = "md", id, checked, ...props }, ref) => {
    const sizeClasses = {
      sm: {
        track: "w-8 h-4",
        thumb: "h-3 w-3 peer-checked:translate-x-4",
      },
      md: {
        track: "w-11 h-6",
        thumb: "h-4 w-4 peer-checked:translate-x-6",
      },
      lg: {
        track: "w-14 h-7",
        thumb: "h-5 w-5 peer-checked:translate-x-7",
      },
    };

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            role="switch"
            id={id}
            ref={ref}
            checked={checked}
            className="peer sr-only"
            aria-invalid={!!error}
            {...props}
          />

          {/* Track */}
          <div
            className={cn(
              "shrink-0 rounded-full bg-[#334155] cursor-pointer",
              "transition-colors duration-200",
              "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-[#030712] peer-focus:ring-[#3B82F6]/30",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "peer-checked:bg-[#3B82F6]",
              sizeClasses[size].track,
              className
            )}
          />

          {/* Thumb */}
          <div
            className={cn(
              "absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md",
              "transition-all duration-200",
              "pointer-events-none",
              sizeClasses[size].thumb
            )}
          />
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-[#E2E8F0] cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-[#64748B]">{description}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-[#EF4444] flex items-center gap-1 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

/* ============================================
   Form Field - Wrapper for form components
   ============================================ */

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({
  className,
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#E2E8F0] mb-1.5">
          {label}
          {required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1.5 text-sm text-[#EF4444] flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-[#64748B]">{hint}</p>
      )}
    </div>
  );
};
FormField.displayName = "FormField";

/* ============================================
   Exports
   ============================================ */

export {
  Input,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  FormField,
  inputVariants,
};
