// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
export default function text({ url, host }) {
	return `Sign in to ${host}\n${url}\n\n`;
}
