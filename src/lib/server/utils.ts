import { ADMIN_ZIDS } from '$env/static/private';

function getAdminZids() {
	return ADMIN_ZIDS.split(',').map((s) => s.trim());
}

export const zidIsAdmin = (zid: string): boolean => {
	return getAdminZids().includes(zid);
};
