/**
 * External dependencies
 */
import {
	render,
	Mjml,
	MjmlHead,
	MjmlTitle,
	MjmlPreview,
	MjmlBody,
	MjmlSection,
	MjmlColumn,
	MjmlButton,
} from 'mjml-react';
import React from 'react';

/**
 * Internal dependencies
 */
import escape from '../../util/escape';
import text from './text';

export default function html({ url, host, email }) {
	const { html, errors } = render(
		<Mjml>
			<MjmlHead>
				<MjmlTitle>Email Verification</MjmlTitle>
				<MjmlPreview>Please Verify Your Email</MjmlPreview>
			</MjmlHead>
			<MjmlBody width={500}>
				<MjmlSection>
					<MjmlColumn>
						<MjmlButton padding="20px" backgroundColor="#346DB7" href={url}>
							Verify your email
						</MjmlButton>
					</MjmlColumn>
				</MjmlSection>
			</MjmlBody>
		</Mjml>,
		{ validationLevel: 'soft' }
	);

	if (errors.length) {
		console.log(errors);
		return text({ url, host });
	}

	return html;
}
