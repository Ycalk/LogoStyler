import { cn } from "cn";
import type * as React from "react";

type PanelProps = {
	title?: string;
	description?: string;
	className?: string;
	children: React.ReactNode;
};

/** Блок интерфейса с рамкой: секция формы, панель инструментов, область предпросмотра. */
function Panel({ title, description, className, children }: PanelProps) {
	return (
		<section
			className={cn(
				"flex flex-col gap-4 rounded-lg border bg-card p-5",
				className,
			)}
		>
			{title ? (
				<div className="flex flex-col gap-1">
					<h2 className="font-heading text-base font-medium">{title}</h2>
					{description ? (
						<p className="text-xs text-muted-foreground">{description}</p>
					) : null}
				</div>
			) : null}
			{children}
		</section>
	);
}

export default Panel;
