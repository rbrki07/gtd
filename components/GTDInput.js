// @ts-check
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import _ from "lodash";

/**
 * @param {Object} params
 * @param {string} [params.placeholder]
 *
 * @returns {Object} React component
 */
const GTDInput = ({ placeholder }) => {
  const inputRef = useRef(null);
  const [cameraPermissions, setCameraPermissions] = useState({
    canAskAgain: false,
    granted: false,
  });
  const [mediaLibraryPermissions, setMediaLibraryPermissions] = useState({
    canAskAgain: false,
    granted: false,
  });

  useEffect(() => {
    const getPermissions = async () => {
      const {
        canAskAgain: cameraPermissionCanAskAgain,
        granted: cameraPermissionGranted,
      } = await ImagePicker.getCameraPermissionsAsync();
      setCameraPermissions({
        canAskAgain: cameraPermissionCanAskAgain,
        granted: cameraPermissionGranted,
      });
      const {
        canAskAgain: mediaLibraryPermissionCanAskAgain,
        granted: mediaLibraryPermissionGranted,
      } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setMediaLibraryPermissions({
        canAskAgain: mediaLibraryPermissionCanAskAgain,
        granted: mediaLibraryPermissionGranted,
      });
    };
    getPermissions();
  }, []);

  const launchOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  };

  const launchCamera = async () => {
    // @ts-ignore
    const selectedImage = await ImagePicker.launchCameraAsync(launchOptions);
    console.log("selectedImage", selectedImage);
  };

  const openCamera = async () => {
    if (cameraPermissions.granted === true) {
      await launchCamera();
    } else if (
      cameraPermissions.granted === false &&
      cameraPermissions.canAskAgain === true
    ) {
      const { canAskAgain, granted } =
        await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermissions({
        canAskAgain,
        granted,
      });
      if (granted === true) {
        await launchCamera();
      }
    } else {
      Alert.alert(
        "Permission required",
        "Please go to your system settings and allow GTD to access your camera."
      );
    }
  };

  const launchMediaLibrary = async () => {
    const selectedImage = await ImagePicker.launchImageLibraryAsync(
      // @ts-ignore
      launchOptions
    );
    console.log("selectedImage", selectedImage);
  };

  const openMediaLibrary = async () => {
    if (mediaLibraryPermissions.granted === true) {
      await launchMediaLibrary();
    } else if (
      mediaLibraryPermissions.granted === false &&
      mediaLibraryPermissions.canAskAgain === true
    ) {
      const { canAskAgain, granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaLibraryPermissions({
        canAskAgain,
        granted,
      });
      if (granted === true) {
        await launchMediaLibrary();
      }
    } else {
      Alert.alert(
        "Permission required",
        "Please go to your system settings and allow GTD to access your photos."
      );
    }
  };

  return (
    <>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        blurOnSubmit={false}
        onSubmitEditing={(e) => {
          try {
            e.persist();
            const text = e?.nativeEvent?.text;
            if (!_.isNil(text) && text.trim().length > 0) {
              console.log("text", text);
              inputRef?.current?.clear();
            } else {
              inputRef?.current?.blur();
            }
          } catch (e) {
            console.log(e);
          }
        }}
        returnKeyType={"done"}
        clearButtonMode={"never"}
        style={styles.input}
      />
      <View style={styles.icons}>
        <TouchableOpacity onPress={openCamera}>
          <Ionicons name={"camera"} size={32} color={"#457b9d"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openMediaLibrary}>
          <Ionicons name={"image"} size={32} color={"#457b9d"} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    backgroundColor: "#f1faee",
    margin: 12,
    paddingLeft: 8,
    paddingRight: 85,
    borderRadius: 8,
    fontSize: 22,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1,
  },
  icons: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 8,
    right: 8,
    height: 48,
    width: 70,
    margin: 12,
  },
});

GTDInput.propTypes = {
  placeholder: PropTypes.string,
};

GTDInput.defaultProps = {
  placeholder: "What needs to be done?",
};

export { GTDInput };