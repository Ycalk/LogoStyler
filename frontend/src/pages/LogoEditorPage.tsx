import { useParams, useSearchParams } from "react-router";
import { TEMPLATE_ID_PARAM } from "@/lib/routes";
import {
	DEFAULT_PLATE,
	parseTemplateParams,
	type SafeArea,
} from "@/lib/templateParams";

function formatSafeArea(safeArea: SafeArea): string {
	const { top, right, bottom, left } = safeArea;
	if (top === right && right === bottom && bottom === left) {
		return `${top} px со всех сторон`;
	}
	return `сверху ${top} · справа ${right} · снизу ${bottom} · слева ${left} px`;
}

function ParameterRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between gap-4">
			<dt>{label}</dt>
			<dd className="text-right text-foreground">{value}</dd>
		</div>
	);
}

/**
 * Редактор логотипа, который отправитель открывает по ссылке (AC-02).
 * Каркас отображает параметры шаблона и заглушку рабочей области; загрузка файла,
 * обрезка, масштаб, направляющие и экспорт (F-05…F-19) ещё не реализованы.
 */
function LogoEditorPage() {
	const routeParams = useParams();
	const [searchParams] = useSearchParams();
	const templateId = routeParams[TEMPLATE_ID_PARAM] ?? "";
	const parsed = parseTemplateParams(searchParams);

	if (!parsed.ok) {
		return (
			<section className="flex flex-col gap-4">
				<h1 className="font-heading text-2xl font-semibold">
					Редактор логотипа
				</h1>
				<div
					role="alert"
					className="max-w-3xl rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm"
				>
					<p className="font-medium">Ссылка на шаблон некорректна</p>
					<p className="mt-1 text-muted-foreground">{parsed.error}</p>
					<p className="mt-1 text-muted-foreground">
						Проверьте ссылку: размеры плашки задаются положительными целыми в
						пикселях.
					</p>
				</div>
			</section>
		);
	}

	const { params: template, usedDefaults } = parsed;
	const { width, height, background, safeArea, format } = template;

	return (
		<section className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="font-heading text-2xl font-semibold">
					Редактор логотипа
				</h1>
				<p className="text-sm text-muted-foreground">
					Шаблон <code>{templateId}</code> · плашка {width}×{height} px · фон{" "}
					{background} · экспорт {format}
				</p>
				{usedDefaults ? (
					<p className="text-sm text-muted-foreground">
						В ссылке нет размеров плашки — показаны значения по умолчанию (
						{DEFAULT_PLATE.width}×{DEFAULT_PLATE.height} px, отступы{" "}
						{DEFAULT_PLATE.padding} px).
					</p>
				) : null}
			</header>

			<div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
				<div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-8">
					<div
						className="w-[640px] max-w-full border border-dashed"
						style={{
							aspectRatio: `${width} / ${height}`,
							backgroundColor: background,
						}}
					/>
					<p className="text-xs text-muted-foreground">
						Рабочая область плашки — заглушка каркаса, логотип ещё не
						загружается.
					</p>
				</div>

				<aside className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm">
					<h2 className="font-heading font-medium">Параметры шаблона</h2>
					<dl className="flex flex-col gap-1 text-muted-foreground">
						<ParameterRow label="Плашка" value={`${width} × ${height} px`} />
						<ParameterRow
							label="Охранные отступы"
							value={formatSafeArea(safeArea)}
						/>
						<ParameterRow
							label="Охранная область"
							value={`${width - safeArea.left - safeArea.right} × ${height - safeArea.top - safeArea.bottom} px`}
						/>
						<ParameterRow label="Фон" value={background} />
						<ParameterRow label="Формат экспорта" value={format} />
					</dl>
					<p className="mt-auto text-muted-foreground">
						Загрузка логотипа, автообрезка, масштаб, направляющие и экспорт
						(F-05…F-19) ещё не реализованы.
					</p>
				</aside>
			</div>
		</section>
	);
}

export default LogoEditorPage;
