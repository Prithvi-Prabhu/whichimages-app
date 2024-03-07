// AddImage.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AddImage from '../frontend/src/components/AddImage/AddImage';

// Mock the necessary modules
jest.mock('axios');
jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
}));

describe('AddImage', () => {
  it('renders the component correctly', () => {
    const { getByText, getByTestId } = render(<AddImage />);
    
    // Assert that key UI elements are present
    expect(getByText('Add Image')).toBeDefined();
    expect(getByTestId('select-image-button')).toBeDefined();
    expect(getByTestId('upload-image-button')).toBeDefined();
  });

  it('uploads an image successfully', async () => {
    // Mock successful ImagePicker response
    jest.mock('react-native-image-crop-picker', () => ({
      openPicker: jest.fn().mockResolvedValue({
        path: 'fakeImagePath',
      }),
    }));

    // Mock successful RNFS.readFile response
    jest.mock('react-native-fs', () => ({
      readFile: jest.fn().mockResolvedValue('fakeBase64Data'),
    }));

    const { getByTestId } = render(<AddImage />);

    // Trigger select image button
    fireEvent.press(getByTestId('select-image-button'));

    // Wait for the image to be selected (you might need to adjust this depending on your actual implementation)
    await waitFor(() => expect(getByTestId('uploaded-image')).toBeDefined());

    // Trigger upload image button
    fireEvent.press(getByTestId('upload-image-button'));

    // Wait for the success alert
    await waitFor(() => expect(getByTestId('success-alert')).toBeDefined());

    // Assert that axios.post was called with the expected arguments
    expect(axios.post).toHaveBeenCalledWith(
      'http://192.168.57.43:8000/uploadfiles/',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  });

  // Add more test cases for error scenarios and edge cases as needed
});
