import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Image, Platform, PermissionsAndroid, ScrollView } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import axios from 'axios';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from react-native-paper
import { Picker } from '@react-native-picker/picker';
import * as RNFS from 'react-native-fs';
import DropDown from '../../../../Components/DropDown/DropDown'; // Import the DropDown component

interface ImageData {
  name: string;
  data: string;
}

const StartTesting: React.FC = () => {
  // State variables
  const [selectedModel, setSelectedModel] = useState<string>('Choose Model');
  const [apiResults, setApiResults] = useState<any>({});
  const [feedback, setFeedback] = useState<boolean[]>([false, false]); // Initial state for two questions
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [question1Answer, setQuestion1Answer] = useState<string>(''); // State to store answer for Question 1
  const [question2Answer, setQuestion2Answer] = useState<string>(''); // State to store answer for Question 2

  // Function to handle image selection
  useEffect(() => {
    // Request camera and storage permissions when the component mounts
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera permission to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permissions granted');
        } else {
          console.log('Camera permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const selectImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        cropping: true,
      });
      setSelectedImages(images);

      const base64ImagesArray = await Promise.all(
        images.map(async (image) => {
          const filePath = Platform.OS === 'android' ? image.path.replace('file://', '') : image.path;
          return await RNFS.readFile(filePath, 'base64');
        })
      );
      setBase64Images(base64ImagesArray);
    } catch (error) {
      console.log('Image selection cancelled or failed.', error);
    }
  };

  // Function to handle submit button press
  const handleSubmit = async () => {
    try {
      if (!selectedImages) {
        Alert.alert('Error', 'Please select an image before submitting.');
        return;
      }

      // Call test-model API with selected image and model
      // Replace 'example.com/api/test-model' with your actual API endpoint
      const response = await axios.post('https://example.com/api/test-model', {
        image: selectedImages,
        model: selectedModel,
        feedback: [question1Answer === 'Yes', question2Answer === 'Yes'] // Include feedback in the request
      });

      // Update state with API results
      setApiResults(response.data);
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
    }
  };

  // Function to handle submitting feedback
  const submitFeedback = async () => {
    try {
      // Send feedback data to the API
      // Replace 'example.com/api/submit-feedback' with your actual API endpoint
      await axios.post('https://example.com/api/submit-feedback', { feedback });
      setIsFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* DropDown component */}
      <DropDown />

      {/* Choose image button */}
      <Button title="Choose Image" onPress={selectImages} />

      {/* Display selected images */}
      {selectedImages.map((image, index) => (
        <Image key={index} source={{ uri: image.path }} style={{ width: 200, height: 200, marginVertical: 10 }} />
      ))}

      {/* Submit button */}
      <Button title="Submit Test" onPress={handleSubmit} color="black" />

      {/* Table to display API results */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>API Results:</Text>
        <ScrollView horizontal>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Column One</Text>
              {Object.entries(apiResults).map(([key, value], index) => (
                <Text key={index} style={{ marginBottom: 5 }}>{key}</Text>
              ))}
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Column Two</Text>
              {Object.entries(apiResults).map(([key, value], index) => (
                <Text key={index} style={{ marginBottom: 5 }}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Scrollable section for questionnaire */}
      <ScrollView style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Feedback:</Text>
        <View>
          <Text>Question 1: Did the test result meet your expectations?</Text>
          <RadioButton.Group onValueChange={newValue => setQuestion1Answer(newValue)} value={question1Answer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton.Android value="Yes" />
              <Text>Yes</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton.Android value="No" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text>Question 2: Would you recommend this model for further testing?</Text>
          <RadioButton.Group onValueChange={newValue => setQuestion2Answer(newValue)} value={question2Answer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton.Android value="Yes" />
              <Text>Yes</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton.Android value="No" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>
        </View>
        <Button
          title="Submit Feedback"
          onPress={submitFeedback}
          disabled={!question1Answer || !question2Answer} // Disable button if any answer is not selected
          color="black"
        />
        {isFeedbackSubmitted && <Text style={{ color: 'green', marginTop: 10 }}>Feedback submitted successfully!</Text>}
      </ScrollView>
    </ScrollView>
  );
};

export default StartTesting;
