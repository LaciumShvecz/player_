// src/store/tracks.store.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { apiService } from '../services/api.service';
import { type ITrack } from '../types/track.types';
import { type IArtist } from '../types/artist.types';

class TracksStore {
    tracks: ITrack[] = [];
    artist: IArtist | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchArtist(name: string) {
        this.isLoading = true;
        this.error = null;
        console.log('🔄 Fetching artist:', name);

        try {
            const artist = await apiService.getArtist(name);
            console.log('✅ Artist loaded:', artist);

            runInAction(() => {
                this.artist = artist;
                this.tracks = artist.tracks || [];
                this.isLoading = false;
                console.log('📀 Tracks loaded:', this.tracks.length);
            });
        } catch (error) {
            console.error('❌ Error in fetchArtist:', error);
            runInAction(() => {
                this.error = 'Failed to fetch artist';
                this.isLoading = false;
            });
        }
    }

    async fetchTracks(search?: string) {
        this.isLoading = true;
        this.error = null;

        try {
            const tracks = await apiService.getTracks(search);
            runInAction(() => {
                this.tracks = tracks;
                this.isLoading = false;
            });
        } catch (error) {
            console.error('Error fetching tracks:', error);
            runInAction(() => {
                this.error = 'Failed to fetch tracks';
                this.isLoading = false;
            });
        }
    }
}

export const tracksStore = new TracksStore();