import { useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Keyboard, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const webViewRef = useRef(null);

  const runFirst = `
    const metaProtection = setInterval(() => {
      let viewport = document.querySelector('meta[name="viewport"]');
      const desiredContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      
      if (viewport.content !== desiredContent) {
        viewport.setAttribute('content', desiredContent);
      }
    }, 1000); // Check every second, less aggressive

    const style = document.createElement('style');
    style.innerHTML = \`
      body { -webkit-text-size-adjust: none; touch-action: pan-x pan-y; }
      input, textarea, select { font-size: 16px !important; }
      input:focus, textarea:focus, select:focus { font-size: 16px !important; }
    \`;
    document.head.appendChild(style);

    true;
  `;

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          const meta = document.querySelector('meta[name="viewport"]');
          if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
          true;
        `);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="auto" />
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://ondina-ciclo.vercel.app/' }}
          style={styles.webview}
          injectedJavaScriptBeforeContentLoaded={runFirst}
          scalesPageToFit={false}
          textZoom={100}
          bounces={false}
          overScrollMode="never"
          builtInZoomControls={false}
          displayZoomControls={false}
          scrollEnabled={true}
          userAgent={
            Platform.OS === 'android'
              ? "Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
              : "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
          }
          javaScriptCanOpenWindowsAutomatically={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7FE',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
