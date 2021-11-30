const { writeFileSync, readFileSync, readdirSync } = require('fs');
const globby = require('globby');
const matter = require('gray-matter');
const path = require('path');
const RSS = require('rss');

(async function generate() {
	const {
		meta: { siteName, url },
	} = require('../package.json');

	const feed = new RSS({
		title: siteName,
		site_url: url,
		feed_url: `${url}/feed.xml`,
	});

	const posts = await globby(['posts/**/*.mdx', 'posts/**/*.md']);

	await Promise.all(
		posts.map(async (name) => {
			const content = readFileSync(path.join(__dirname, '..', 'posts', name));
			const frontmatter = matter(content);

			feed.item({
				title: frontmatter.data.title,
				url: `${url}/blog` + name.replace(/\.mdx?/, ''),
				date: frontmatter.data.publishedAt,
				description: frontmatter.data.summary,
			});
		})
	);

	writeFileSync('./public/feed.xml', feed.xml({ indent: true }));
})();
