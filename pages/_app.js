/**
 * External dependencies
 */
import React from 'react';
import { ThemeProvider } from 'next-themes';

/**
 * Internal dependencies
 */
import '@/styles/global.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function reportWebVitals(metric) {
	console.log(metric);
}

export default function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider attribute="class">
			<Header />
			<main className="pt-16">
				<Component {...pageProps} />
			</main>
			<Footer />
		</ThemeProvider>
	);
}
