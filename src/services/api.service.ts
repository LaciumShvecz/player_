// src/services/api.service.ts
import axios from 'axios';
import { type ITrack } from '../types/track.types';
import { type IArtist } from '../types/artist.types';
import { type IAlbum } from '../types/album.types';

const API_URL = 'http://localhost:5000/api';

interface BackendTrack {
    id: number;
    name: string;
    file: string;
    cover: string;
    duration: number;
    artistId: number;
    artist?: BackendArtist;
    lyrics?: BackendLyrics[];
    albumId?: number;
    album?: BackendAlbum;
}

interface BackendArtist {
    id: number;
    name: string;
    image: string;
    bio?: string;
    listenersCount: number;
    tracks?: BackendTrack[];
    albums?: BackendAlbum[];
}

interface BackendLyrics {
    id: number;
    time: number;
    text: string;
}

interface BackendAlbum {
    id: number;
    name: string;
    cover?: string;
    releaseDate?: string;
    artistId: number;
    artist: BackendArtist;
    tracks?: BackendTrack[];
}

class ApiService {
    private instance = axios.create({
        baseURL: API_URL,
        timeout: 5000,
    });

    // Преобразование трека (без рекурсии на артиста)
    private transformTrack(track: BackendTrack, artist?: IArtist): ITrack {
        // Если артист передан, используем его, иначе создаем базового
        const trackArtist: IArtist = artist || (track.artist ? {
            id: track.artist.id,
            name: track.artist.name,
            image: track.artist.image || '',
            listenersCount: track.artist.listenersCount || 0
        } : {
            id: 0,
            name: 'Unknown Artist',
            image: '',
            listenersCount: 0
        });

        const sortedLyrics = track.lyrics
            ? [...track.lyrics].sort((a, b) => a.time - b.time)
            : undefined;

        return {
            id: track.id,
            name: track.name,
            file: track.file,
            cover: track.cover,
            duration: track.duration,
            artistId: track.artistId,
            artist: trackArtist,
            lyrics: sortedLyrics?.map(l => ({
                id: l.id,
                time: l.time,
                text: l.text
            }))
        };
    }

    // Преобразование артиста (без рекурсии на треки)
    private transformArtist(artist: BackendArtist): IArtist {
        return {
            id: artist.id,
            name: artist.name,
            image: artist.image || '',
            bio: artist.bio || '',
            listenersCount: artist.listenersCount || 0
        }
    }

    // Преобразование альбома
    private transformAlbum(album: BackendAlbum): IAlbum {
        const tracks = album.tracks?.map(track => {
            const tempArtist = album.artist ? {
                id: album.artist.id,
                name: album.artist.name,
                image: album.artist.image || '',
                listenersCount: album.artist.listenersCount || 0,
                tracks: []
            } : undefined;

            return this.transformTrack(track, tempArtist);
        }) || [];

        // Вычисляем общую длительность
        const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0);

        return {
            id: album.id,
            name: album.name,
            cover: album.cover,
            releaseDate: album.releaseDate,
            artistId: album.artistId,
            artist: album.artist ? {
                id: album.artist.id,
                name: album.artist.name,
                image: album.artist.image || '',
                listenersCount: album.artist.listenersCount || 0,
            } : {
                id: 0,
                name: 'Unknown Artist',
                image: '',
                listenersCount: 0,
            },
            tracks: tracks,
            trackCount: tracks.length,
            totalDuration: totalDuration
        };
    }

    async getTracks(search?: string): Promise<ITrack[]> {
        try {
            const params = search ? { search } : {};
            const { data } = await this.instance.get<BackendTrack[]>('/tracks', { params });
            console.log('Tracks from backend:', data);

            // Для треков создаем временных артистов без треков
            return data.map(track => {
                const tempArtist: IArtist | undefined = track.artist ? {
                    id: track.artist.id,
                    name: track.artist.name,
                    image: track.artist.image || '',
                    listenersCount: track.artist.listenersCount || 0
                } : undefined;

                return this.transformTrack(track, tempArtist);
            });
        } catch (error) {
            console.error('Error fetching tracks:', error);
            return [];
        }
    }

    async getArtists(): Promise<IArtist[]> {
        try {
            const { data } = await this.instance.get<BackendArtist[]>('/artists');
            console.log('Artists from backend:', data);

            if (!Array.isArray(data)) {
                console.error('Artists data is not an array:', data);
                return [];
            }

            return data.map(artist => this.transformArtist(artist));
        } catch (error) {
            console.error('Error fetching artists:', error);
            return [];
        }
    }

    async getArtist(name: string): Promise<IArtist> {
        try {
            const { data } = await this.instance.get<BackendArtist & { tracks: BackendTrack[] }>(`/artists/${encodeURIComponent(name)}`);
            return this.transformArtist(data);
        } catch (error) {
            console.error('Error fetching artist:', error);
            throw error;
        }
    }

    async getArtistById(id: number): Promise<IArtist & { tracks: ITrack[] }> {
        try {
            const { data } = await this.instance.get(`/artists/id/${id}`)
            console.log('🔍 Raw artist data from API:', data)

            // Проверяем, есть ли tracks в ответе
            console.log('🎵 Tracks from API:', data.tracks)

            return {
                ...this.transformArtist(data),
                tracks: data.tracks?.map((track: any) => {
                    console.log('🎼 Transforming track:', track)
                    return this.transformTrack(track)
                }) || []
            }
        } catch (error) {
            console.error('Error fetching artist by id:', error)
            throw error
        }
    }

    async getTrack(id: number): Promise<ITrack | null> {
        try {
            const { data } = await this.instance.get<BackendTrack>(`/tracks/${id}`);

            const tempArtist: IArtist | undefined = data.artist ? {
                id: data.artist.id,
                name: data.artist.name,
                image: data.artist.image || '',
                listenersCount: data.artist.listenersCount || 0
            } : undefined;

            return this.transformTrack(data, tempArtist);
        } catch (error) {
            console.error('Error fetching track:', error);
            return null;
        }
    }

    // НОВЫЕ МЕТОДЫ ДЛЯ АЛЬБОМОВ
    async getAlbums(): Promise<IAlbum[]> {
        try {
            const { data } = await this.instance.get<BackendAlbum[]>('/albums');
            console.log('Albums from backend:', data);
            return data.map(album => this.transformAlbum(album));
        } catch (error) {
            console.error('Error fetching albums:', error);
            return [];
        }
    }

    async getAlbumById(id: number): Promise<IAlbum> {
        try {
            const { data } = await this.instance.get<BackendAlbum>(`/albums/${id}`);
            return this.transformAlbum(data);
        } catch (error) {
            console.error('Error fetching album:', error);
            throw error;
        }
    }

    async getAlbumsByArtist(artistId: number): Promise<IAlbum[]> {
        try {
            const { data } = await this.instance.get<BackendAlbum[]>(`/artists/${artistId}/albums`);
            return data.map(album => this.transformAlbum(album));
        } catch (error) {
            console.error('Error fetching artist albums:', error);
            return [];
        }
    }

    async getMyPlaylists(): Promise<any[]> {
        try {
            const token = localStorage.getItem('token')
            const { data } = await this.instance.get('/playlists/my', {
                headers: { Authorization: `Bearer ${token}` }
            })
            return data
        } catch (error) {
            console.error('Error fetching playlists:', error)
            return []
        }
    }

    async createPlaylist(data: { name: string; description?: string }): Promise<any> {
        try {
            const token = localStorage.getItem('token')
            const response = await this.instance.post('/playlists', data, {
                headers: { Authorization: `Bearer ${token}` }
            })
            return response.data
        } catch (error) {
            console.error('Error creating playlist:', error)
            throw error
        }
    }

    async addToPlaylist(playlistId: string, trackId: number): Promise<void> {
        try {
            const token = localStorage.getItem('token')
            await this.instance.post(`/playlists/${playlistId}/tracks/${trackId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            console.error('Error adding to playlist:', error)
            throw error
        }
    }

    async removeFromPlaylist(playlistId: string, trackId: number): Promise<void> {
        try {
            const token = localStorage.getItem('token')
            await this.instance.delete(`/playlists/${playlistId}/tracks/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            console.error('Error removing from playlist:', error)
            throw error
        }
    }
}

export const apiService = new ApiService();