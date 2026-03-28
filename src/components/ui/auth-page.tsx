'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { BookOpen, AtSignIcon, ChevronLeftIcon, KeyRoundIcon, Loader2, ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';
import { Input } from './input';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

type Mode = 'login' | 'signup';
type Step = 'email' | 'password' | 'otp' | 'set-password';

export function AuthPage() {
	const [mode, setMode] = useState<Mode>('login');
	const [step, setStep] = useState<Step>('email');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleGoogleLogin = async () => {
		try {
			setLoading(true);
			setError('');
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			routeUser(result.user);
		} catch (err: any) {
			console.error(err);
			setError(err.message || 'Google sign-in failed.');
		} finally {
			setLoading(false);
		}
	};

	const routeUser = (user: any) => {
		if (user.email === 'admin@email.com') {
			navigate('/admin');
		} else {
			navigate('/dashboard');
		}
	};

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		setError('');
		
		if (mode === 'login') {
			setStep('password');
		} else {
			// In a real app with a backend, we would trigger an email containing a 6-digit OTP here.
			// Firebase Client SDK does not natively support emailing a 6-digit OTP payload.
			// For demonstration of this flow, we simulate sending the OTP.
			alert("Firebase Auth doesn't natively send 6-digit email OTPs without a backend. For this demo, check your 'email' by using the code: 123456 to proceed.");
			setStep('otp');
		}
	};

	const handleOtpSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		
		// Simulated OTP check
		if (otp === '123456') {
			setStep('set-password');
		} else {
			setError('Invalid OTP code. For this demo, use 123456.');
		}
	};

	const handleLoginPasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password) return;
		setError('');
		setLoading(true);

		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			routeUser(credential.user);
		} catch (err: any) {
			console.error(err);
			setError('Invalid credentials or user not found.');
		} finally {
			setLoading(false);
		}
	};

	const handleSignupSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password || !confirmPassword) return;
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}
		if (password.length < 6) {
			setError('Password must be at least 6 characters.');
			return;
		}

		setError('');
		setLoading(true);

		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			routeUser(credential.user);
		} catch (err: any) {
			console.error(err);
			setError(err.message || 'Error creating account.');
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = () => {
		setMode(mode === 'login' ? 'signup' : 'login');
		setStep('email');
		setError('');
		setPassword('');
		setConfirmPassword('');
		setOtp('');
	};

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
				<div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center gap-2">
					<BookOpen className="size-6" />
					<p className="text-xl font-semibold">JNTUK Library</p>
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl">
							&ldquo;This platform has saved me hours of searching for previous year papers right before exams. It's incredibly fast.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold">
							~ Final Year ECE Student
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			
			<div className="relative flex min-h-screen flex-col justify-center p-4">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>
				<Button variant="ghost" className="absolute top-7 left-5" asChild>
					<a href="/">
						<ChevronLeftIcon className='size-4 me-2' />
						Home
					</a>
				</Button>
				
				<div className="mx-auto space-y-4 sm:w-sm w-full max-w-[400px]">
					<div className="flex items-center gap-2 lg:hidden">
						<BookOpen className="size-6" />
						<p className="text-xl font-semibold">JNTUK Library</p>
					</div>
					
					<div className="flex flex-col space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-wide">
							{mode === 'login' ? 'Welcome back' : 'Create an account'}
						</h1>
						<p className="text-muted-foreground text-sm">
							{mode === 'login' 
								? 'Sign in to access your JNTUK library account' 
								: 'Enter your email below to create your account'}
						</p>
					</div>

					{step === 'email' && (
						<div className="space-y-2 mt-4">
							<Button 
								type="button" 
								size="lg" 
								className="w-full bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] rounded-[0.5rem] shadow-sm"
								onClick={handleGoogleLogin}
								disabled={loading}
							>
								{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className='size-5 me-2' />}
								Continue with Google
							</Button>
						</div>
					)}

					{step === 'email' && <AuthSeparator />}

					{error && (
						<div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 font-medium">
							{error}
						</div>
					)}

					{mode === 'login' ? (
						<form className="space-y-4" onSubmit={handleLoginPasswordSubmit}>
							<div className="space-y-3">
								<div className="relative h-max">
									<Input
										placeholder="your.email@example.com"
										className="peer ps-9 h-11"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
										<AtSignIcon className="size-4" aria-hidden="true" />
									</div>
								</div>

								<div className="relative h-max">
									<Input
										placeholder="Password"
										className="peer ps-9 h-11"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
										<KeyRoundIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
							</div>

							<Button 
								type="submit" 
								className="w-full bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] rounded-[0.5rem] shadow-sm h-11 font-medium"
								disabled={loading}
							>
								{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Sign In</span>}
							</Button>
						</form>
					) : (
						<>
							{step === 'email' && (
								<form className="space-y-2" onSubmit={handleEmailSubmit}>
									<p className="text-muted-foreground text-start text-xs">
										Enter your email address to get started
									</p>
									<div className="relative h-max">
										<Input
											placeholder="your.email@example.com"
											className="peer ps-9 h-11"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
										<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
											<AtSignIcon className="size-4" aria-hidden="true" />
										</div>
									</div>

									<Button type="submit" className="w-full bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] rounded-[0.5rem] shadow-sm h-11 mt-2">
										<span>Continue With Email</span>
									</Button>
								</form>
							)}

					{step === 'otp' && (
						<form className="space-y-4" onSubmit={handleOtpSubmit}>
							<div className="space-y-1">
								<button 
									type="button" 
									onClick={() => { setStep('email'); setError(''); setOtp(''); }} 
									className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
								>
									<ArrowLeftIcon className="w-3 h-3 mr-1" />
									Back to email
								</button>
								<div className="text-sm font-medium pt-1 pb-2">We sent a verification code to <span className="text-foreground">{email}</span></div>
								<div className="relative h-max mt-2">
									<Input
										placeholder="Enter 6-digit OTP code"
										className="peer ps-9 h-11 tracking-widest"
										type="text"
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										required
										autoFocus
										maxLength={6}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
										<ShieldCheckIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
								<p className="text-xs text-muted-foreground pt-1">Hint: For this demo, check the alert message or use 123456.</p>
							</div>

							<Button type="submit" className="w-full bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] rounded-[0.5rem] shadow-sm h-11">
								Verify Code
							</Button>
						</form>
					)}

					{step === 'set-password' && (
						<form className="space-y-4" onSubmit={handleSignupSubmit}>
							<div className="space-y-1">
								<div className="text-sm font-medium pb-2 text-green-600 flex items-center gap-2">
									<ShieldCheckIcon className="size-4" />
									Email verified! Set a password for {email}
								</div>
								<div className="relative h-max mb-3">
									<Input
										placeholder="Set secure password"
										className="peer ps-9 h-11"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										autoFocus
										minLength={6}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
										<KeyRoundIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
								<div className="relative h-max">
									<Input
										placeholder="Retype password"
										className="peer ps-9 h-11"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										minLength={6}
									/>
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
										<KeyRoundIcon className="size-4" aria-hidden="true" />
									</div>
								</div>
							</div>

							<Button 
								type="submit" 
								className="w-full bg-[#09090b] hover:bg-[#27272a] text-[#fafafa] rounded-[0.5rem] shadow-sm h-11 mt-2"
								disabled={loading}
							>
								{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Create Account</span>}
							</Button>
						</form>
					)}
						</>
					)}
					
					{(mode === 'login' || step === 'email') && (
						<div className="text-center pt-2 mt-4">
							<button 
								type="button"
								onClick={toggleMode}
								className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
							>
								{mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
							</button>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center py-2">
			<div className="bg-border h-px w-full" />
			<span className="text-muted-foreground px-2 text-xs">OR</span>
			<div className="bg-border h-px w-full" />
		</div>
	);
};

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-slate-950 dark:text-white"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}


