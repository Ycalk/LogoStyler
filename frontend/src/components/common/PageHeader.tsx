import type * as React from "react";

type PageHeaderProps = {
	title: string;
	description: string;
	children?: React.ReactNode;
};

/** Заголовок экрана: название, пояснение и место под действия справа. */
function PageHeader({ title, description, children }: PageHeaderProps) {
	return (
		<header className="flex flex-wrap items-end justify-between gap-4">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-2xl font-semibold">{title}</h1>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			{children}
		</header>
	);
}

export default PageHeader;
