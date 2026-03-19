import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';
import { type ITrack } from '../types/track.types';

export const TRACKS: ITrack[] = [];

export const useTracks = () => {
	const [tracks, setTracks] = useState<ITrack[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				setIsLoading(true);
				const data = await apiService.getTracks();
				setTracks(data);
			} catch (err) {
				setError('Failed to load tracks');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTracks();
	}, []);

	return { tracks, isLoading, error };
};