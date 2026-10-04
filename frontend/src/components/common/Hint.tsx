import { cn } from "cn";
import type * as React from "react";

type HintProps = {
	className?: string;
	children: React.ReactNode;
};

/** Подсказка под полем или блоком: второстепенный текст, не мешает чтению основных значений. */
function Hint({ className, children }: HintProps) {
	return (
		<p className={cn("text-xs text-muted-foreground", className)}>{children}</p>
	);
}

export default Hint;
