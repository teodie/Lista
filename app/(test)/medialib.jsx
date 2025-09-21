import { useState, useEffect } from 'react';
import { Button, Text, ScrollView, StyleSheet, Image, View, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
    const [albums, setAlbums] = useState(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    async function getAlbums() {
        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
            includeSmartAlbums: true,
        });
        setAlbums(fetchedAlbums);
    }

    return (
        <View style={styles.container}>
            <Button onPress={getAlbums} title="Get albums" />
            <ScrollView>
                {albums && albums.map((album) => <AlbumEntry album={album} key={album.id} />)}
            </ScrollView>
        </View>
    );
}

function AlbumEntry({ album }) {
    const [assets, setAssets] = useState([]);
    
    useEffect(() => {
        async function getAlbumAssets() {
            const albumAssets = await MediaLibrary.getAssetsAsync({ album });
            setAssets(albumAssets.assets);
        }
        getAlbumAssets();
    }, [album]);

    return (
        <View style={styles.albumContainer}>
            <Text>
                {album.title} - {album.assetCount ?? 'no'} assets
            </Text>
            <View style={styles.albumAssetsContainer}>
                {assets && assets.map((asset, index) => (
                    <Image key={index} source={{ uri: asset.uri }} width={50} height={50} />
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        flex: 1,
        gap: 8,
        justifyContent: 'center',
    },
    albumContainer: {
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 4,
    },
    albumAssetsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

