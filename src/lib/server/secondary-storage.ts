import { env } from '$env/dynamic/private';
import type { SecondaryStorage } from 'better-auth';
import { log } from '$lib/log';

// NOTE: binding name is defined in wrangler.jsonc
function getBinding(): KVNamespace | null {
	const binding = (env as Record<string, unknown>)['SECONDARY_STORAGE_KV'];
	if (!binding || typeof (binding as KVNamespace).getWithMetadata !== 'function') {
		return null;
	}
	return binding as KVNamespace;
}

export const getSecondaryStorage = (): SecondaryStorage | undefined => {
	const kv = getBinding();
	if (!kv) {
		log('warn', 'secondary_storage', 'unavailable', {
			binding: 'SECONDARY_STORAGE_KV',
			message: 'SECONDARY_STORAGE_KV binding unavailable, secondary storage disabled'
		});
		return undefined;
	}

	log('info', 'secondary_storage', 'initialised', {
		provider: 'cloudflare_kv',
		message: 'Using KV as secondary storage for auth'
	});

	return {
		get: async (key: string) => {
			log('debug', 'secondary_storage', 'get', { key });
			return kv.get(key);
		},
		set: async (key: string, value: string, ttl?: number) => {
			if (ttl !== undefined) {
				// Cloudflare KV requires TTL >= 60 seconds
				const minTtl = 60;
				let effectiveTtl = ttl;

				if (ttl < minTtl) {
					effectiveTtl = minTtl;
					log('warn', 'secondary_storage', 'ttl_adjusted', {
						key,
						requestedTtl: ttl,
						minTtl,
						effectiveTtl,
						message: 'Secondary Storage TTL is less than KV minimum. Adjusting to KV minimum.'
					});
				}

				log('debug', 'secondary_storage', 'set_with_ttl', {
					key,
					effectiveTtl,
					message: 'Setting secondary storage value with TTL'
				});
				return kv.put(key, value, { expirationTtl: effectiveTtl });
			}

			return kv.put(key, value);
		},
		delete: async (key: string) => {
			log('debug', 'secondary_storage', 'delete', { key });
			return kv.delete(key);
		}
	};
};
