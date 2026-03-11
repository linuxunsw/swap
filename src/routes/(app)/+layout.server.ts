export const load = async (event) => {
	const zid = event.locals.user?.zid ?? null;
	return { zid };
};
