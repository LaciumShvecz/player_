import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

export interface ILyricsLine {
	id?: number
	time: number
	text: string
}

export interface ILyrics {
	trackName: string
	lines: ILyricsLine[]
}

export const useLyrics = (trackName: string) => {
	const [lyrics, setLyrics] = useState<ILyricsLine[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLyrics = async () => {
			if (!trackName) return;

			setIsLoading(true);
			try {
				const tracks = await apiService.getTracks();

				const track = tracks.find(t => t.name === trackName);

				if (track?.lyrics) {
					setLyrics(track.lyrics);
					console.log(`✅ Found ${track.lyrics.length} lyrics for track:`, trackName);
				} else {
					console.log('ℹ️ No lyrics for track:', trackName);
					setLyrics([]);
				}
			} catch (err) {
				console.error('Error fetching lyrics:', err);
				setError('Failed to load lyrics');
			} finally {
				setIsLoading(false);
			}
		};

		fetchLyrics();
	}, [trackName]);

	return { lyrics, isLoading, error };
};

export const useAllLyrics = () => {
	const [allLyrics, setAllLyrics] = useState<ILyrics[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAllLyrics = async () => {
			setIsLoading(true);
			try {
				const tracks = await apiService.getTracks();
				const lyricsData = tracks
					.filter(t => t.lyrics && t.lyrics.length > 0)
					.map(t => ({
						trackName: t.name,
						lines: t.lyrics!
					}));
				setAllLyrics(lyricsData);
				setError(null);
			} catch (err) {
				setError('Failed to load lyrics');
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllLyrics();
	}, []);

	return { allLyrics, isLoading, error };
};

export const LYRICS: ILyrics[] = [];