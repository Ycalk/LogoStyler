import { Route, Routes } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import { ROUTES } from "@/lib/routes";
import LogoEditorPage from "@/pages/LogoEditorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TemplateCreatePage from "@/pages/TemplateCreatePage";

/** Таблица маршрутов: два рабочих экрана MVP в общем лейауте (ТЗ §10). */
function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path={ROUTES.templateCreate} element={<TemplateCreatePage />} />
				<Route path={ROUTES.templateEditor} element={<LogoEditorPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}

export default App;
