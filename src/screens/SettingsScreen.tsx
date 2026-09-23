import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as Appcues from '@appcues/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {APPCUES_ACCOUNT_ID, APPCUES_APPLICATION_ID, STORAGE_KEY_ACCOUNT_ID, STORAGE_KEY_APP_ID} from '../config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
  route: RouteProp<RootStackParamList, 'Settings'>;
};

export default function SettingsScreen({navigation, route}: Props) {
  const {currentAccountId, currentApplicationId} = route.params;

  const [accountId, setAccountId] = useState(currentAccountId);
  const [applicationId, setApplicationId] = useState(currentApplicationId);

  const isDefault =
    accountId.trim() === APPCUES_ACCOUNT_ID &&
    applicationId.trim() === APPCUES_APPLICATION_ID;

  const handleSave = () => {
    if (!accountId.trim() || !applicationId.trim()) {
      Alert.alert('Required', 'Both Account ID and Application ID are required.');
      return;
    }

    if (isDefault) {
      // No change — just go back
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Switch Account?',
      'Changing credentials will log you out. Debugger QR code and screen capture will only work with your own Account ID and App ID.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Switch & Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.setItem(STORAGE_KEY_ACCOUNT_ID, accountId.trim());
            await AsyncStorage.setItem(STORAGE_KEY_APP_ID, applicationId.trim());
            Appcues.reset();
            navigation.navigate('Login', {
              accountId: accountId.trim(),
              applicationId: applicationId.trim(),
            });
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Default?',
      'This will restore your personal Account ID and App ID and log you out.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset & Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEY_ACCOUNT_ID);
            await AsyncStorage.removeItem(STORAGE_KEY_APP_ID);
            Appcues.reset();
            navigation.navigate('Login', {
              accountId: APPCUES_ACCOUNT_ID,
              applicationId: APPCUES_APPLICATION_ID,
            });
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="settings-back-button"
          onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title} testID="settings-title">Settings</Text>
      <Text style={styles.subtitle}>
        Switch to a different Appcues account for testing. Use sparingly —
        some features only work with your own credentials.
      </Text>

      <View style={styles.warningCard} testID="settings-warning">
        <Text style={styles.warningTitle}>⚠️ Limitations when switching accounts</Text>
        <Text style={styles.warningText}>
          • Debugger QR code won't work{'\n'}
          • Screen capture in Studio won't work{'\n'}
          • These features require your personal App ID registered in Info.plist
        </Text>
      </View>

      <View style={styles.stepsCard} testID="settings-steps">
        <Text style={styles.stepsTitle}>📋 How to switch accounts</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Enter the new Account ID and Application ID below and tap <Text style={styles.stepBold}>Switch Account & Log Out</Text></Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>On the Login screen, <Text style={styles.stepBold}>force-quit the app</Text> — swipe up from the bottom of your screen, find this app, and swipe it up to close it</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}><Text style={styles.stepBold}>Reopen the app</Text> — the new credentials will be pre-filled on the Login screen</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Tap <Text style={styles.stepBold}>Sign In & Identify</Text> to connect to the new account</Text>
        </View>
      </View>

      <View style={styles.card} testID="settings-credentials-card">
        <Text style={styles.sectionLabel}>APPCUES CREDENTIALS</Text>
        <Text style={styles.groupHint}>
          Find these in Studio → Settings → Apps & Installation
        </Text>

        <Text style={styles.label}>Account ID</Text>
        <TextInput
          testID="settings-accountid-input"
          style={styles.input}
          value={accountId}
          onChangeText={setAccountId}
          placeholder="e.g. 101304"
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Application ID</Text>
        <TextInput
          testID="settings-appid-input"
          style={styles.input}
          value={applicationId}
          onChangeText={setApplicationId}
          placeholder="e.g. dc0aca0e-b73e-481a-8e2d-5a7f21f740f4"
          autoCapitalize="none"
        />

        {!isDefault && (
          <View style={styles.activeBadge} testID="settings-active-badge">
            <Text style={styles.activeBadgeText}>
              Using a non-default account
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        testID="settings-save-button"
        style={styles.saveButton}
        onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isDefault ? 'Save' : 'Switch Account & Log Out'}
        </Text>
      </TouchableOpacity>

      {!isDefault && (
        <TouchableOpacity
          testID="settings-reset-button"
          style={styles.resetButton}
          onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to My Account</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        Your default credentials are stored in src/config.ts
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scroll: {padding: 20, paddingTop: 56, paddingBottom: 40},
  headerRow: {marginBottom: 16},
  back: {fontSize: 17, color: '#5C5CE0'},
  title: {fontSize: 26, fontWeight: '700', color: '#1A1A2E', marginBottom: 6},
  subtitle: {fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 20},
  warningCard: {
    backgroundColor: '#FFF9EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningTitle: {fontSize: 14, fontWeight: '600', color: '#92400E', marginBottom: 8},
  warningText: {fontSize: 13, color: '#92400E', lineHeight: 22},
  stepsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  stepsTitle: {fontSize: 14, fontWeight: '600', color: '#166534', marginBottom: 12},
  step: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12},
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#166534',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    marginRight: 10,
    marginTop: 1,
  },
  stepText: {flex: 1, fontSize: 13, color: '#166534', lineHeight: 20},
  stepBold: {fontWeight: '700'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8},
  groupHint: {fontSize: 12, color: '#9CA3AF', marginBottom: 4, lineHeight: 16},
  label: {fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 10},
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1A1A2E',
    backgroundColor: '#F9FAFB',
  },
  activeBadge: {
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  activeBadgeText: {fontSize: 13, color: '#92400E', fontWeight: '500'},
  saveButton: {
    backgroundColor: '#5C5CE0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {color: '#EF4444', fontSize: 16, fontWeight: '600'},
  hint: {fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 4, lineHeight: 18},
});
