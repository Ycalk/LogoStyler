import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildEditorHref } from "@/lib/routes";
import {
	DEFAULT_BACKGROUND,
	DEFAULT_FORMAT,
	DEFAULT_PLATE,
	type TemplateParams,
} from "@/lib/templateParams";

/**
 * Пример шаблона для каркаса: форма создания шаблона ещё не реализована (F-01…F-04),
 * а значения взяты из AC-01 — плашка 400×220 px и охранные отступы 20 px.
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

function TemplateCreatePage() {
	const navigate = useNavigate();
	const exampleHref = buildEditorHref(EXAMPLE_TEMPLATE_ID, EXAMPLE_TEMPLATE);
	const exampleShareUrl =
		typeof window === "undefined"
			? exampleHref
			: new URL(exampleHref, window.location.origin).toString();

	return (
		<section className="flex flex-col gap-6">
			<header className="flex flex-col gap-1">
				<h1 className="font-heading text-2xl font-semibold">
					Создание шаблона
				</h1>
				<p className="text-sm text-muted-foreground">
					Организатор задаёт размеры плашки, фон и охранные отступы, затем
					передаёт отправителям ссылку на редактор.
				</p>
			</header>

			<div className="flex max-w-3xl flex-col gap-4 rounded-lg border bg-card p-6">
				<p className="text-sm text-muted-foreground">
					Форма создания шаблона ещё не реализована: F-01 — размеры плашки, F-02
					— фон, F-03 — охранные отступы, F-04 — уникальная ссылка. Ниже показан
					зафиксированный формат ссылки на редактор.
				</p>
				<div className="flex flex-col gap-2">
					<Label htmlFor="share-link">Пример ссылки на редактор</Label>
					<Input id="share-link" readOnly value={exampleShareUrl} />
				</div>
				<Button className="self-start" onClick={() => navigate(exampleHref)}>
					Открыть редактор
				</Button>
			</div>
		</section>
	);
}

export default TemplateCreatePage;
