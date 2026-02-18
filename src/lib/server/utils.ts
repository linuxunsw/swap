import { env } from '$env/dynamic/private';

export const ZID_REGEX = /^z\d{7}$/;

function getAdminZids() {
	const allowlist = env.ADMIN_ZIDS ?? '';
	return allowlist?.split(',').map((s) => s.trim());
}

export const zidIsAdmin = (zid: string): boolean => {
	return getAdminZids().includes(zid);
};
