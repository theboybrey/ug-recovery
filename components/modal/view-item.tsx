import { cn } from "@/lib/utils";
import _ from "lodash"

type Props = {
    label: string
    value?: string
    labelClasses?: string
    valueClasses?: string
    containerClasses?: string
    customValue?: React.ReactNode
}

export default function ModalViewItem({label, value, containerClasses,labelClasses, valueClasses, customValue }: Props) {
    return (
        <div className={cn("flex flex-col gap-1 w-full", containerClasses)}>
            <p className={cn("text-primary", labelClasses)}>{_.startCase(label || "")}</p>
            <p className={cn("text-neutral-600", valueClasses)}>{customValue ? customValue : (value || "")}</p>
        </div>
    )
}