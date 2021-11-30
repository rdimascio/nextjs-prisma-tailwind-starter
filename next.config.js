const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});
const DEV = process.env.NODE_ENV === 'development';

module.exports = withPlugins([[withBundleAnalyzer], [withPWA]], {
	pwa: {
		dest: 'public',
		runtimeCaching,
		disable: DEV,
	},
	experimental: {
		eslint: true,
		esmExternals: true,
	},
	reactStrictMode: true,
	pageExtensions: ['js', 'jsx', 'md', 'mdx'],
	webpack5: true,
	images: {
		domains: ['tailwindui.com', 'images.unsplash.com', 'media3.giphy.com'],
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: securityHeaders,
			},
		];
	},
	webpack: (config, { dev, isServer }) => {
		if (isServer) {
			require('./bin/generate-sitemap');
			require('./bin/generate-rss');
		}

		config.watchOptions = {
			ignored: ['./node_modules'],
		};

		config.module.rules.push({
			test: /\.(png|jpe?g|gif|mp4)$/i,
			use: [
				{
					loader: 'file-loader',
					options: {
						publicPath: '/_next',
						name: 'static/media/[name].[hash].[ext]',
					},
				},
			],
		});

		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});

		if (!dev && !isServer) {
			// Replace React with Preact only in client production build
			Object.assign(config.resolve.alias, {
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
			});
		}

		return config;
	},
});

// https://securityheaders.com
const ContentSecurityPolicy = `
	default-src 'self';
	script-src 'self' 'unsafe-eval' 'unsafe-inline';
	worker-src 'self';
	style-src 'self' 'unsafe-inline' fonts.googleapis.com;
	img-src * blob: data:;
	media-src 'none';
	connect-src *;
	font-src 'self' fonts.gstatic.com;
`;

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
	{
		key: 'Content-Security-Policy',
		value: ContentSecurityPolicy.replace(/\n/g, ''),
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: 'Referrer-Policy',
		value: 'origin-when-cross-origin',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: 'X-Frame-Options',
		value: 'DENY',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=31536000; includeSubDomains; preload',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	// Opt-out of Google FLoC: https://amifloced.org/
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
	},
];
