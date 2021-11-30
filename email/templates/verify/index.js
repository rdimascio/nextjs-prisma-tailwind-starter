/**
 * External dependencies
 */
import { createTransport } from 'nodemailer';

/**
 * Internal dependencies
 */
import text from './text';
import html from './html';

/**
 *
 * @param {Object} props
 * @param {string} props.email
 * @param {string} props.url
 * @param {string|Object} props.server
 * @param {string} props.from
 */
export default async function verify({ email, url, server, from }) {
	const { host } = new URL(url);
	const transport = createTransport(server);

	await transport.sendMail({
		to: email,
		from,
		subject: `Verify your email to sign in to ${host}`,
		text: text({ url, host }),
		html: html({ url, host, email }),
	});
}
