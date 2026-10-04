import { cn } from "cn";
import { Link, NavLink } from "react-router";
import { ROUTES } from "@/lib/routes";

function AppHeader() {
	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
			<div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-6 px-8">
				<Link
					to={ROUTES.templateCreate}
					className="font-heading text-base font-semibold"
				>
					Сервис подготовки логотипов
				</Link>
				<nav aria-label="Основная навигация">
					<NavLink
						to={ROUTES.templateCreate}
						className={({ isActive }) =>
							cn(
								"rounded-md px-2 py-1 text-sm transition-colors",
								isActive
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)
						}
					>
						Создать шаблон
					</NavLink>
				</nav>
			</div>
		</header>
	);
}

export default AppHeader;
