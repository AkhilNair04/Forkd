import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '@/constants/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer'; // <-- Add this import
import { v4 as uuidv4 } from 'uuid';

const EditProfile = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing profile data when the page loads
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      const user = data?.user;

      if (!user) {
        console.error("No user logged in");
        return;
      }

      // Set email directly from Supabase Auth user
      setEmail(user.email || '');

      // Fetch the user profile from the database using the user_id (same as user.id)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }

      // Set the user profile state
      if (profileData) {
        setFullName(profileData.full_name || '');
        setPhone(profileData.phone || ''); // Default empty string if no phone
        setBio(profileData.bio || '');
        setProfilePic(profileData.avatar_url || ''); // Set profile pic if available
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    // Update profile in the database (without the email column)
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const user = data?.user;

      // Check if the user profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        Alert.alert("Error", "Failed to fetch existing profile");
        console.error("Error fetching profile:", profileError);
        return;
      }

      if (existingProfile) {
        // If the profile exists, update it
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            full_name: fullName,
            phone: phone || null,  // Update phone only if a value is provided
            bio: bio,
            avatar_url: profilePic, // Update avatar if a new one is selected
          })
          .eq('user_id', user.id);

        if (error) {
          Alert.alert("Error", "Failed to update profile");
          console.error("Error saving profile:", error);
        } else {
          Alert.alert("Success", "Profile updated successfully");
          router.push("/profile"); // Navigate back to the profile page
        }
      } else {
        // If the profile doesn't exist, create a new one
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: user.id,
            full_name: fullName,
            phone: phone || null,  // Update phone only if a value is provided
            bio: bio,
            avatar_url: profilePic, // Add avatar_url if a profile picture is provided
          }]);

        if (error) {
          Alert.alert("Error", "Failed to create profile");
          console.error("Error saving profile:", error);
        } else {
          Alert.alert("Success", "Profile created successfully");
          router.push("/profile"); // Navigate back to the profile page
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImageAndUpload = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "You need to grant permission to select an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const uri = asset.uri;
      const ext = uri.split('.').pop() ?? "jpg"; // Get file extension
      const fileName = uuidv4() + `.${ext}`;  // Unique file name

      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const buffer = decode(base64Data);  // Convert base64 to buffer

      const { error: uploadError } = await supabase.storage
        .from('avatars')  // Upload to the 'avatars' bucket
        .upload(fileName, buffer, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (uploadError) {
        Alert.alert("Upload Failed", uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setProfilePic(urlData.publicUrl);  // Set the uploaded image URL in the state

    } catch (err: any) {
      console.error("Error uploading image:", err);
      Alert.alert("Upload failed", err.message ?? JSON.stringify(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false}  // Disable editing of email, since it comes from Supabase Auth
          placeholder="Enter your email"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Enter a short bio"
          multiline
        />

        <Text style={styles.label}>Profile Picture</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImageAndUpload}>
          <Text style={styles.uploadButtonText}>Select Image</Text>
        </TouchableOpacity>

        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
        ) : (
          <Text style={styles.noImageText}>No image selected</Text>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  form: {
    marginTop: 20,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#1A1200',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FF9100',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  noImageText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default EditProfile;
