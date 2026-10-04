import { cn } from "cn";

type ErrorNoticeProps = {
	title: string;
	message: string;
	hint?: string;
	className?: string;
};

/** Блок ошибки: заметное сообщение о некорректных данных или файле (§8 ТЗ). */
function ErrorNotice({ title, message, hint, className }: ErrorNoticeProps) {
	return (
		<div
			role="alert"
			className={cn(
				"flex flex-col gap-1 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm",
				className,
			)}
		>
			<p className="font-medium">{title}</p>
			<p className="text-muted-foreground">{message}</p>
			{hint ? <p className="text-muted-foreground">{hint}</p> : null}
		</div>
	);
}

export default ErrorNotice;
