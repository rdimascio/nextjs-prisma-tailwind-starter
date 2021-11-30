/**
 *
 * @param {string} html
 * @return {string}
 */
export default function escape(html) {
	return `${html.replace(/\./g, '&#8203;.')}`;
}
