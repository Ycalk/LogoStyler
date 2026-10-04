import { useNavigate } from "react-router";
import FormField from "@/components/common/FormField";
import Hint from "@/components/common/Hint";
import PageHeader from "@/components/common/PageHeader";
import Panel from "@/components/common/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildEditorHref } from "@/lib/routes";
import {
	DEFAULT_BACKGROUND,
	DEFAULT_FORMAT,
	DEFAULT_PLATE,
	EXPORT_FORMATS,
	type TemplateParams,
} from "@/lib/templateParams";

/**
 * Пример шаблона для каркаса: форма ещё без логики, значения взяты из AC-01 —
 * плашка 400×220 px и охранные отступы 20 px.
 */
const EXAMPLE_TEMPLATE: TemplateParams = {
	width: DEFAULT_PLATE.width,
	height: DEFAULT_PLATE.height,
	background: DEFAULT_BACKGROUND,
	safeArea: {
		top: DEFAULT_PLATE.padding,
		right: DEFAULT_PLATE.padding,
		bottom: DEFAULT_PLATE.padding,
		left: DEFAULT_PLATE.padding,
	},
	format: DEFAULT_FORMAT,
};

const EXAMPLE_TEMPLATE_ID = "demo";

const PADDING_FIELDS = [
	{ id: "padding-top", label: "Сверху" },
	{ id: "padding-right", label: "Справа" },
	{ id: "padding-bottom", label: "Снизу" },
	{ id: "padding-left", label: "Слева" },
] as const;

const SELECT_CLASSES =
	"h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

/** Экран создания шаблона: поля размеров, фона и охранных отступов (F-01…F-03), пока без логики. */
function TemplateCreatePage() {
	const navigate = useNavigate();
	const exampleHref = buildEditorHref(EXAMPLE_TEMPLATE_ID, EXAMPLE_TEMPLATE);
	const exampleShareUrl =
		typeof window === "undefined"
			? exampleHref
			: new URL(exampleHref, window.location.origin).toString();

	return (
		<section className="flex flex-col gap-6">
			<PageHeader
				title="Создание шаблона"
				description="Ширина и высота плашки, фон и охранные отступы. После сохранения организатор передаёт отправителям ссылку на редактор."
			/>

			<div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
				<Panel
					title="Параметры плашки"
					description="Заготовка формы: кнопка сохранения и генерация ссылки ещё без логики (F-04)."
				>
					<div className="grid grid-cols-2 gap-4">
						<FormField
							id="width"
							label="Ширина, px"
							hint="Положительное целое число (F-01)."
						>
							<Input
								id="width"
								type="number"
								min={1}
								max={8192}
								defaultValue={DEFAULT_PLATE.width}
							/>
						</FormField>
						<FormField
							id="height"
							label="Высота, px"
							hint="Положительное целое число (F-01)."
						>
							<Input
								id="height"
								type="number"
								min={1}
								max={8192}
								defaultValue={DEFAULT_PLATE.height}
							/>
						</FormField>
						<FormField
							id="background-color"
							label="Цвет фона"
							hint="По умолчанию белый #FFFFFF (F-02)."
						>
							<Input
								id="background-color"
								type="color"
								defaultValue="#ffffff"
								className="h-9 w-24 p-1"
							/>
						</FormField>
						<FormField
							id="background-hex"
							label="Фон, HEX"
							hint="Значение для ссылки и экспорта."
						>
							<Input id="background-hex" defaultValue={DEFAULT_BACKGROUND} />
						</FormField>
						<FormField
							id="padding-uniform"
							label="Охранные отступы, px"
							hint="Единое значение для всех сторон (F-03)."
						>
							<Input
								id="padding-uniform"
								type="number"
								min={0}
								max={8192}
								defaultValue={DEFAULT_PLATE.padding}
							/>
						</FormField>
						<FormField
							id="export-format"
							label="Формат экспорта"
							hint="Формат итогового файла (F-19)."
						>
							<select
								id="export-format"
								className={SELECT_CLASSES}
								defaultValue={DEFAULT_FORMAT}
							>
								{EXPORT_FORMATS.map((format) => (
									<option key={format} value={format}>
										{format.toUpperCase()}
									</option>
								))}
							</select>
						</FormField>
					</div>

					<div className="flex flex-col gap-3 border-t pt-4">
						<h3 className="text-sm font-medium">
							Охранные отступы по сторонам
						</h3>
						<div className="grid grid-cols-4 gap-4">
							{PADDING_FIELDS.map(({ id, label }) => (
								<FormField key={id} id={id} label={label}>
									<Input
										id={id}
										type="number"
										min={0}
										max={8192}
										defaultValue={DEFAULT_PLATE.padding}
									/>
								</FormField>
							))}
						</div>
						<Hint>
							Единое значение применяется ко всем сторонам, отступы по сторонам
							его переопределяют. Охранная область — это плашка минус отступы,
							она видна только при редактировании (F-03).
						</Hint>
					</div>

					<div className="flex flex-wrap items-center gap-3 border-t pt-4">
						<Button type="button">Сохранить шаблон</Button>
						<Hint>
							Кнопка пока ничего не сохраняет: запись шаблона и уникальная
							ссылка появятся в F-04.
						</Hint>
					</div>
				</Panel>

				<Panel
					title="Ссылка на редактор"
					description="Формат ссылки уже зафиксирован, чтобы отправителю не пришлось менять привычки позже."
				>
					<FormField
						id="share-link"
						label="Пример ссылки"
						hint="Параметры шаблона передаются в query-строке (AC-01, AC-02)."
					>
						<Input id="share-link" readOnly value={exampleShareUrl} />
					</FormField>
					<Button
						type="button"
						variant="secondary"
						onClick={() => navigate(exampleHref)}
					>
						Открыть редактор
					</Button>
				</Panel>
			</div>
		</section>
	);
}

export default TemplateCreatePage;
