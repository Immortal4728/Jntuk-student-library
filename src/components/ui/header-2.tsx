'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
		<>
			<header
				className={cn(
					'sticky top-0 z-40 w-full transition-all duration-300 ease-out bg-white/70 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.01)]',
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

						{/* Mobile Visibles: Just Menu Toggle */}
						<div className="flex md:hidden items-center gap-3">
							<button 
								onClick={() => setOpen(true)} 
								className="active:scale-[0.96] transition-transform duration-200 ease-out p-1 text-gray-800 focus:outline-none"
								aria-label="Open menu"
							>
								<Menu className="size-6" strokeWidth={2.25} />
							</button>
						</div>
					</div>
				</nav>
			</header>

			{/* MOBILE SLIDE PANEL */}
			<AnimatePresence>
				{open && (
					<div className="md:hidden fixed inset-0 z-[100] flex justify-end">
						{/* Backdrop overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setOpen(false)}
							className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px]"
							aria-hidden="true"
						/>

						{/* Slide-in Menu */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 24, stiffness: 200 }}
							className="relative w-[85%] max-w-[340px] h-full bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.08)] flex flex-col"
						>
							{/* Top Header */}
							<div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
								<span className="text-[1.125rem] font-bold text-gray-900 tracking-tight">
									JNTUK Library
								</span>
								<button
									onClick={() => setOpen(false)}
									className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-95 transition-all"
									aria-label="Close menu"
								>
									<X className="size-5" strokeWidth={2.5} />
								</button>
							</div>

							{/* Navigation Items */}
							<div className="flex-1 px-5 py-6 flex flex-col gap-1.5 overflow-y-auto w-full">
								{links.map((link) => {
									const active = isActive(link.href);
									return (
										<Link
											key={link.href}
											to={link.href}
											onClick={() => setOpen(false)}
											className={cn(
												"relative flex items-center w-full px-5 h-[56px] rounded-2xl text-[1.125rem] transition-all duration-200 active:scale-[0.98]",
												active
													? "bg-gray-50 text-gray-900 font-bold"
													: "text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-medium"
											)}
										>
											{active && (
												<motion.div
													layoutId="activeNavMobile2"
													className="absolute left-0 top-[20%] bottom-[20%] w-1.5 bg-gray-900 rounded-r-full"
													transition={{ type: "spring", stiffness: 300, damping: 30 }}
												/>
											)}
											{link.label}
										</Link>
									);
								})}
							</div>

							{/* CTA Section */}
							<div className="p-6 pb-8 border-t border-gray-100 bg-white">
								<Link
									to="/login/student"
									onClick={() => setOpen(false)}
									className="flex items-center justify-center w-full h-[56px] rounded-2xl bg-gray-900 text-white text-[1rem] font-bold active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(17,24,39,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
								>
									Student Login
								</Link>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

