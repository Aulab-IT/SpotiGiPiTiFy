import os , spotipy
from spotipy.oauth2 import SpotifyOAuth

class Spotify():
    def __init__(self):
        scope = """
            playlist-modify-public 
            playlist-modify-private 
            playlist-read-private 
            playlist-read-collaborative 
            user-library-read
            user-read-recently-played
            user-top-read
        """

        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            scope=scope,
            client_id=os.environ['SPOTIFY_CLIENT_ID'],
            client_secret=os.environ['SPOTIFY_CLIENT_SECRET'],
            redirect_uri=os.environ['SPOTIFY_REDIRECT_URI'],
        ))

    def get_current_user_saved_tracks(self):
        results = self.sp.current_user_saved_tracks()

        return results;

    def get_user_playlists(self):
        user = self.sp.current_user()
        playlists = self.sp.user_playlists(user['id'])

        return playlists['items']
    
    def save_playlist(self, name, playlist):
        """Saves the created playlist under user account

        Args:
            name (str, optional): Name of the playlist. Uses the name created by ChatGPT or
                default name when not specified
        """
        try:
            user_id = self.sp.current_user().get('id')

            create_playlist_result = self.sp.user_playlist_create(user=user_id, name=name, public=True)

            p_id = create_playlist_result['id']

            tracks = [track['uri'] for track in playlist if 'uri' in track]

            self.sp.user_playlist_add_tracks(user=user_id, playlist_id=p_id, tracks=tracks)

            return {"success": True}
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return {"error": str(e)}
