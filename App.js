import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  TextInput, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import Video from 'react-native-video';

const localVideoSource = require('./assets/background.mp4');

const App = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const askOllama = async () => {
    if (!inputText.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      Keyboard.dismiss();

      // 替换为您的实际IP（模拟器用10.0.2.2，真机用局域网IP）
      const OLLAMA_URL = 'http://10.0.2.2:11434/api/generate';
      
      const res = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:8b',
          prompt: inputText,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`API请求失败: ${res.status}`);
      
      const data = await res.json();
      setResponse(data.response);
      setInputText('');
    } catch (err) {
      setError(err.message);
      console.error('API调用错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* 视频背景 */}
      <Video
        ref={videoRef}
        source={localVideoSource}
        style={styles.backgroundVideo}
        repeat
        resizeMode="cover"
        muted
        paused={false}
        onError={(e) => console.log('视频错误:', e)}
      />

      {/* 内容层 */}
      <View style={styles.content}>
        {/* 结果显示区域 */}
        {response ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : error ? (
          <View style={[styles.responseBox, styles.errorBox]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* 输入区域 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="今天想吃什么？"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={askOllama}
            returnKeyType="send"
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={askOllama}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>发送</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#333',
    fontSize: 16,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderRadius: 25,
    height: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  responseText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 16,
  },
});

export default App;