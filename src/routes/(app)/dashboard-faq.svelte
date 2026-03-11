<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
    import { PUBLIC_SOCIETY_EMAIL } from '$env/static/public';

	const faqs = [
		{
			question: 'What happens after I submit my application?',
			answer:
				'Once submitted, your application will be reviewed by the executives. If shortlisted, you will be contacted for an interview. You can still edit your application until the interview stage.'
		},
		{
			question: 'Can I edit my application after submitting?',
			answer:
				'Yes! You can edit your application at any time before an interview is scheduled. If you save a draft in the meantime, make sure to re-submit when you are done.'
		},
		{
			question: 'How long does the review process take?',
			answer:
				'The review process varies by cycle. You will be notified by email when your application status changes. Check back here for real-time updates.'
		},
		{
			question: 'Who can I contact if I have questions?',
			answer:
				`Reach out to us on Discord or email us at ${PUBLIC_SOCIETY_EMAIL}. We are happy to help with any questions about the application process.`
		}
	];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Frequently Asked Questions</Card.Title>
	</Card.Header>
	<Card.Content>
		<Accordion.Root type="multiple">
			{#each faqs as faq, i}
				<Accordion.Item value="faq-{i}">
					<Accordion.Trigger>{faq.question}</Accordion.Trigger>
					<Accordion.Content>
						<p class="text-sm text-muted-foreground">{faq.answer}</p>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</Card.Content>
</Card.Root>
