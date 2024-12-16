from pydantic import BaseModel , Field

class SpotifyTrack(BaseModel):
    uri : str = Field(description="URI of the track provided by Spotify")
    name : str = Field(description="Name of the track provided by Spotify")
    artist : str = Field(description="Name of the artist provided by Spotify")
    album : str = Field(description="Name of the album provided by Spotify")
    spotify_external_url : str = Field(description="External URL of the track on Spotify")
    album_image : str = Field(description="URL of the album image provided by Spotify")

class Playlist(BaseModel):
    name: str
    tracks: list[SpotifyTrack]
