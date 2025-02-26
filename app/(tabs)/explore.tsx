import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '../../src/components/ui/Collapsible';
import { ExternalLink } from '../../src/components/ui/ExternalLink';
import { ParallaxScrollView } from '../../src/components/ui/ParallaxScrollView';
import { ThemedText } from '../../src/components/ui/ThemedText';
import { ThemedView } from '../../src/components/ui/ThemedView';
import { IconSymbol } from '../../src/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="h1">Explore</ThemedText>
      </ThemedView>
      <ThemedText type="body">This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText type="body">
          This app has two screens:{' '}
          <ThemedText type="h4">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="h4">app/(tabs)/explore.tsx</ThemedText>. Learn more about{' '}
          <ExternalLink href="https://docs.expo.dev/router/reference/file-conventions/">
            <ThemedText type="link">file-based routing</ThemedText>
          </ExternalLink>
          .
        </ThemedText>
        <ThemedText type="body">
          The layout file in <ThemedText type="h4">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText type="body">
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="h4">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText type="body">
          For static images, you can use the <ThemedText type="h4">@2x</ThemedText> and{' '}
          <ThemedText type="h4">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText type="body">
          Open <ThemedText type="h4">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText type="body">
          This template has light and dark mode support. The{' '}
          <ThemedText type="h4">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText type="body">
          This template includes an example of an animated component. The{' '}
          <ThemedText type="h4">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="h4">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText type="body">
              The <ThemedText type="h4">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
