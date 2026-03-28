'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const location = useLocation();

	const isActive = (path: string) =>
		path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'Materials', href: '/materials' },
		{ label: 'About', href: '/about' },
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 w-full transition-all duration-300 ease-out bg-white/70 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.01)]',
			)}
		>
			<nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8 relative">
				
				{/* LEFT: LOGO */}
				<Link 
					to="/" 
					onClick={() => setOpen(false)} 
					className="flex items-center gap-[6px] group active:scale-[0.96] transition-transform duration-200 ease-out z-10"
				>
					<div className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-gray-100 text-gray-800 group-hover:bg-gray-200/80 transition-colors duration-200">
			        	<BookOpen className="h-[18px] w-[18px]" strokeWidth={2.25} />
					</div>
			        <span className="font-medium text-gray-900 tracking-tight text-[15px]">
						JNTUK Library
					</span>
		        </Link>
				
				{/* CENTER: NAV (Desktop) */}
				<div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full z-0">
					{links.map((link, i) => {
						const active = isActive(link.href);
						return (
							<Link 
								key={i} 
								to={link.href}
								className={cn(
									"relative flex h-full items-center text-sm transition-colors duration-200 ease-out active:scale-[0.96]",
									active ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900 font-normal"
								)}
							>
								{link.label}
								{active && (
									<span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full" />
								)}
							</Link>
						);
					})}
				</div>

				{/* RIGHT: AUTH & MOBILE TOGGLE */}
				<div className="flex items-center z-10">
					{/* Desktop Auth Container */}
					<div className="hidden md:flex items-center gap-2 rounded-full px-2 py-1">
						<Link 
							to="/login/student"
							className="px-4 py-1.5 text-[13px] font-medium text-white bg-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out hover:bg-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:scale-[0.96] rounded-full"
						>
							Student Login
						</Link>
					</div>

					{/* Mobile Visibles: Student Button & Menu Toggle */}
					<div className="flex md:hidden items-center gap-3">
						<Link 
							to="/login/student"
							className="px-4 py-1.5 text-[13px] font-medium text-white bg-gray-900 shadow-sm transition-all duration-200 ease-out active:scale-[0.96] rounded-full"
						>
							Student Login
						</Link>
						<button 
							onClick={() => setOpen(!open)} 
							className="active:scale-[0.96] transition-transform duration-200 ease-out p-1 text-gray-600 focus:outline-none"
							aria-label="Toggle menu"
						>
							<MenuToggleIcon open={open} className="size-5" duration={300} />
						</button>
					</div>
				</div>
			</nav>

			{/* MOBILE MENU */}
			<div
				className={cn(
					'fixed top-16 right-0 bottom-0 left-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100/50 md:hidden transition-all duration-300',
					open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
				)}
			>
				<div
					className={cn(
						'flex h-full w-full flex-col p-6',
						open ? 'translate-y-0' : '-translate-y-2'
					)}
					style={{ transition: 'transform 0.3s ease-out' }}
				>
					<div className="flex flex-col gap-1">
						{links.map((link) => {
							const active = isActive(link.href);
							return (
								<Link
									key={link.label}
									className={cn(
										"py-3 text-[15px] transition-colors duration-200 active:scale-[0.98]",
										active ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900 font-normal"
									)}
									to={link.href}
									onClick={() => setOpen(false)}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
					<div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-100 pb-[10vh]">
						{/* Admin Login hidden per request */}
					</div>
				</div>
			</div>
		</header>
	);
}

