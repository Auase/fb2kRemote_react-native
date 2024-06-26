import React, { useState } from 'react';
import { View, Modal, Dimensions, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import StyledText from '../customComponents/styledText';
import Header from '../customComponents/header';
import placeholderImg from '../assets/img/no-cover.jpeg';

const Playlists = ({
  handlePageChange,
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  selectedPlaylistSongs,
  playSong,
  playerPlaylist,
  currentSong
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedPlaylist(option);
    setIsOpen(false);
  };

  function isCurrentPlaylist () {
    if (playerPlaylist && selectedPlaylist.id === playerPlaylist.id) {
      return true;
    }
    return false;
  }

  return (
    <View style={styles.playlistsSection}>
      <Header
        handlePageChange={handlePageChange}
        title={ selectedPlaylist
          ? selectedPlaylist?.title
          : 'No playlist selected' }
        showHomeButton={ true }
        showExtraButton= {<TouchableWithoutFeedback onPress={toggleDropdown}>
          <View>
            <MaterialCommunityIcons name="playlist-music" size={24} color="#ebebeb" />
          </View>
        </TouchableWithoutFeedback>}
      />

      <Modal visible={isOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback  onPress={toggleDropdown}>
        <View style={styles.dropdownMenu}>
          {playlists.map((pl) => {
            if (pl.id !== selectedPlaylist.id) {
              return (
                <TouchableWithoutFeedback
                  key={pl.id}
                  style={styles.dropdownItem}
                  onPress={() => handleOptionClick(pl)}
                >
                  <View style={styles.dropdownItem}>
                    <StyledText big>{pl.title} <StyledText>({pl.itemCount} items)</StyledText></StyledText>
                  </View>
                </TouchableWithoutFeedback>
              );
            } else {
              return null;
            }
          })}
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      {(JSON.stringify(selectedPlaylistSongs) === "{}" &&
        <View style={styles.noData}>
          <StyledText style={{textAlign: 'center'}}>List is empty or is too large, please pick another</StyledText>
        </View>
      )}

      <ScrollView style={styles.playlistsContainer}>
        {Object.entries(selectedPlaylistSongs).map(([artist, albums]) => (
          <View key={artist}>
            {Object.entries(albums).map(([albumKey, albumData]) => {
              return (
                <View key={albumKey}>
                  <View style={styles.albumHeader}>
                    <View style={styles.cover}>
                      <Image 
                        source={albumData.coverArt._j ? {uri: albumData.coverArt._j} : placeholderImg} 
                        style={styles.coverImage} 
                        resizeMode='cover' />
                    </View>
                    <View style={styles.title}>
                      <StyledText h2 style={styles.artistName}>{artist}</StyledText>
                      <StyledText h1 style={styles.albumName}>{albumData.name} ({albumData.year})</StyledText>
                    </View>
                  </View>

                  <View style={styles.playlists}>
                    {Object.values(albumData.songs).map((song, index) => {
                      const songNumber = Object.values(song)[0];
                      const songName = Object.values(song)[1];
                      const songIndex = Object.values(song)[2];
                      const isCurrentSong = (isCurrentPlaylist() && currentSong.track === songIndex)
                      return (
                        <View key={index} style={[styles.track, (isCurrentSong) ? styles.isCurrentSong : '']}>
                          <TouchableWithoutFeedback onPress={() => playSong(songIndex, selectedPlaylist.id)}>
                            <View style={styles.trackName}>
                              <StyledText h2>{songNumber} - {songName}</StyledText>
                            </View>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback onPress={() => playSong(songIndex, selectedPlaylist.id)}>
                            <View style={styles.trackRemove}>
                              {(isCurrentSong) ?
                                <Ionicons name="md-volume-medium" size={24} color="#ebebeb" />
                              :
                                <Ionicons name="play" size={24} color="#ebebeb" />
                              }
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
        
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50,
  },
  dropdownMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  dropdownItem: {
    marginBottom: 14
  },
  playlistsContainer: {
    maxHeight: Dimensions.get('window').height - 74,
    paddingHorizontal: 12,
  },
  albumHeader: {
    flexDirection: 'row',
    marginTop: 26,
    marginBottom: 0,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#ebebeb',
    alignItems: 'center',
    maxWidth: '100%'
  },
  cover: {
    marginRight: 15,
    marginTop: 4
  },
  coverImage: {
    width: 45,
    height: 45
  },
  title: {
    width: Dimensions.get('window').width - 84 // 45 image + 15 margin image + 24 (paddingHorizontal 12)
  },
  track: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 48,
    justifyContent: 'space-between'
  },
  isCurrentSong: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  trackName: {
    flexGrow: 1,
  },
  trackRemove: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 8
  },
  noData: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    maxWidth: '80%'
  }
};

export default Playlists;
