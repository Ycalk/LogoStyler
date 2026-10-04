import { useParams, useSearchParams } from "react-router";
import ErrorNotice from "@/components/common/ErrorNotice";
import Hint from "@/components/common/Hint";
import PageHeader from "@/components/common/PageHeader";
import Panel from "@/components/common/Panel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TEMPLATE_ID_PARAM } from "@/lib/routes";
import {
	DEFAULT_PLATE,
	parseTemplateParams,
	type SafeArea,
} from "@/lib/templateParams";

const TOOLBAR_ACTIONS = [
	{ id: "upload", label: "Загрузить логотип", variant: "default" },
	{ id: "auto-trim", label: "Автообрезка", variant: "secondary" },
	{ id: "center", label: "Центрировать", variant: "outline" },
	{ id: "reset", label: "Сбросить", variant: "outline" },
] as const;

const LABEL_CLASSES = "text-xs text-muted-foreground";

/** Проценты от стороны плашки — для позиционирования охранной области поверх рабочей области. */
function toPercent(value: number, total: number): string {
	return `${(value / total) * 100}%`;
}

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
			<dt className={LABEL_CLASSES}>{label}</dt>
			<dd className="text-right text-foreground">{value}</dd>
		</div>
	);
}

/**
 * Экран редактора, который отправитель открывает по ссылке (AC-02).
 * Область предпросмотра и панель инструментов — заготовки: загрузка файла, обрезка,
 * масштаб, направляющие и экспорт (F-05…F-19) ещё без логики.
 */
function LogoEditorPage() {
	const routeParams = useParams();
	const [searchParams] = useSearchParams();
	const templateId = routeParams[TEMPLATE_ID_PARAM] ?? "";
	const parsed = parseTemplateParams(searchParams);

	if (!parsed.ok) {
		return (
			<section className="flex flex-col gap-6">
				<PageHeader
					title="Редактор логотипа"
					description="Экран отправителя: загрузка логотипа, обрезка, масштаб и экспорт."
				/>
				<ErrorNotice
					title="Ссылка на шаблон некорректна"
					message={parsed.error}
					hint="Проверьте ссылку: размеры плашки задаются положительными целыми числами в пикселях, фон — в формате #RGB или #RRGGBB."
					className="max-w-3xl"
				/>
			</section>
		);
	}

	const { params: template, usedDefaults } = parsed;
	const { width, height, background, safeArea, format } = template;

	return (
		<section className="flex flex-col gap-6">
			<PageHeader
				title="Редактор логотипа"
				description={`Шаблон ${templateId} · плашка ${width}×${height} px · фон ${background} · экспорт ${format}`}
			/>

			{usedDefaults ? (
				<Hint className="max-w-3xl">
					В ссылке нет размеров плашки — показаны значения по умолчанию (
					{DEFAULT_PLATE.width}×{DEFAULT_PLATE.height} px, охранные отступы{" "}
					{DEFAULT_PLATE.padding} px).
				</Hint>
			) : null}

			<Panel
				title="Панель инструментов"
				description="Заготовка: действия отключены, пока не реализованы F-05…F-19."
			>
				<div className="flex flex-wrap items-center gap-2">
					{TOOLBAR_ACTIONS.map(({ id, label, variant }) => (
						<Button key={id} type="button" variant={variant} disabled>
							{label}
						</Button>
					))}
					<div className="ml-auto flex min-w-[260px] items-center gap-3">
						<span className={LABEL_CLASSES}>Масштаб</span>
						<Slider
							defaultValue={[100]}
							min={10}
							max={400}
							disabled
							aria-label="Масштаб логотипа"
						/>
					</div>
					<Button type="button" disabled>
						Скачать
					</Button>
				</div>
			</Panel>

			<div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
				<Panel
					title="Предпросмотр"
					description="Плашка в правильном соотношении сторон; пунктир — охранная область, в экспорт не попадает (6.1, AC-13)."
				>
					<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-8">
						<div
							className="relative w-[640px] max-w-full shadow-sm"
							style={{
								aspectRatio: `${width} / ${height}`,
								backgroundColor: background,
							}}
						>
							<div
								className="absolute border border-dashed border-ring/70"
								style={{
									top: toPercent(safeArea.top, height),
									right: toPercent(safeArea.right, width),
									bottom: toPercent(safeArea.bottom, height),
									left: toPercent(safeArea.left, width),
								}}
							/>
						</div>
						<Hint>
							Логотип не загружен — загрузка и редактирование появятся в
							F-05…F-19.
						</Hint>
					</div>
				</Panel>

				<Panel
					title="Параметры шаблона"
					description="Значения пришли из ссылки."
				>
					<dl className="flex flex-col gap-1.5 text-sm text-muted-foreground">
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
					<Hint>
						Экспорт получит точный размер плашки и заданный фон, служебные линии
						в файл не попадут (AC-12, AC-13).
					</Hint>
				</Panel>
			</div>
		</section>
	);
}

export default LogoEditorPage;
