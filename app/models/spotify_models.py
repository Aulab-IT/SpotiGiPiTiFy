from pydantic import BaseModel , Field

class SpotifyTrack(BaseModel):
    uri : str = Field(description="URI of the track")
    name : str = Field(description="Name of the track")
    artist : str = Field(description="Name of the artist")
    album : str = Field(description="Name of the album")
    spotify_external_url : str = Field(description="External URL of the track on Spotify")
    album_image : str = Field(description="URL of the album image")


class Track(BaseModel):
    name: str
    artist: str
class Playlist(BaseModel):
    name: str
    tracks: list[SpotifyTrack]
