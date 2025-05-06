import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

export function LoadingSpinner() {
    return (
        <ThemedView style={styles.container}>
            <ActivityIndicator size="large" />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 