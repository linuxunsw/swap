import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	const zid = event.locals.user?.zid ?? null;
	return { zid };
});
