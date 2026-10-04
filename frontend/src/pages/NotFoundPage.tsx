import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<section className="flex flex-col items-start gap-4">
			<h1 className="font-heading text-2xl font-semibold">
				Страница не найдена
			</h1>
			<p className="text-sm text-muted-foreground">
				Проверьте ссылку: редактор открывается по адресу{" "}
				<code>/t/&lt;идентификатор шаблона&gt;</code>.
			</p>
			<Button onClick={() => navigate(ROUTES.templateCreate)}>
				К созданию шаблона
			</Button>
		</section>
	);
}

export default NotFoundPage;
