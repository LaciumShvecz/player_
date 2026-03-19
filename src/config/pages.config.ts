export class PagesConfig {
	static HOME = '/'
	static DISCOVER = '/discover'

	static RECENTLY_PLAYED = '/recently-played'
	static LIKED_SONGS = '/liked-songs'

	static PLAYLIST(id: string | number) {
		return `/playlist/${id}`
	}

	static ALBUMS(id?: string | number) {
		return '/albums' + (id ? `/${id}` : '')
	}

	static ARTISTS(id?: string | number) {
		return '/artists' + (id ? `/${id}` : '')
	}
}