const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

(async () => {
	const prettierConfig = await prettier.resolveConfig('./prettier.config.js');
	const pages = await globby([
		'pages/*.js',
		'posts/**/*.mdx',
		'posts/**/*.md',
		'!pages/_*.js',
		'!pages/api',
	]);

	const sitemap = `
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${pages
				.map((page) => {
					const path = page
						.replace('pages/', '/')
						.replace('posts/', '/blog')
						.replace('public/', '/')
						.replace('.js', '')
						.replace('.mdx', '')
						.replace('.md', '')
						.replace('/index.xml', '');
					const route = path === '/index' ? '' : path;
					return `
							<url>
								<loc>${`${''}${route}`}</loc>
							</url>
						`;
				})
				.join('')}
		</urlset>
	`;

	const formatted = prettier.format(sitemap, {
		...prettierConfig,
		parser: 'html',
	});

	// eslint-disable-next-line no-sync
	fs.writeFileSync('./public/sitemap.xml', formatted);
})();
