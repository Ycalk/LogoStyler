import { cn } from "cn";
import type * as React from "react";
import Hint from "@/components/common/Hint";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
	id: string;
	label: string;
	hint?: string;
	className?: string;
	children: React.ReactNode;
};

/** Поле ввода: подпись, связанная с контролом по id, и необязательная подсказка под ним. */
function FormField({ id, label, hint, className, children }: FormFieldProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Label htmlFor={id}>{label}</Label>
			{children}
			{hint ? <Hint>{hint}</Hint> : null}
		</div>
	);
}

export default FormField;
