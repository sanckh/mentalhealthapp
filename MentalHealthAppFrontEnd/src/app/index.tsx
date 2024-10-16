import { Button } from '@/components';
import { useAuth } from '@/context/AuthProvider';
import { Redirect, router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const { isLoading, user } = useAuth();

  if (!isLoading && user) return <Redirect href='/home' />;

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.viewContainer}>
          <Text>App welcome screen</Text>
          <Button
            title='Continue with Email'
            handlePress={() => router.push('/login')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
    minHeight: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
