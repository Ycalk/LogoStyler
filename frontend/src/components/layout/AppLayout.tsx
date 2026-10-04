import { Outlet } from "react-router";
import AppHeader from "@/components/layout/AppHeader";

/**
 * Базовый лейаут: шапка + контейнер под рабочую область.
 *
 * Контейнер рассчитан на экраны шириной от 1280 px (§8 ТЗ); мобильной версии нет,
 * поэтому на узких экранах появляется горизонтальная прокрутка, а не сжатие рабочих панелей.
 */
function AppLayout() {
	return (
		<div className="flex min-h-dvh min-w-[1280px] flex-col bg-muted/40">
			<AppHeader />
			<main className="mx-auto w-full max-w-[1600px] grow px-8 py-6">
				<Outlet />
			</main>
		</div>
	);
}

export default AppLayout;
