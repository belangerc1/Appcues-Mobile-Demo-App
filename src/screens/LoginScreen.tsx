import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import * as Appcues from '@appcues/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, UserProps} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APPCUES_ACCOUNT_ID, APPCUES_APPLICATION_ID, DEFAULT_USER, DEFAULT_GROUP, STORAGE_KEY_ACCOUNT_ID, STORAGE_KEY_APP_ID} from '../config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({navigation, route}: Props) {
  const [accountId, setAccountId] = useState(
    route.params?.accountId ?? APPCUES_ACCOUNT_ID,
  );
  const [applicationId, setApplicationId] = useState(
    route.params?.applicationId ?? APPCUES_APPLICATION_ID,
  );

  // On first load, check if a non-default account was previously saved
  useEffect(() => {
    if (!route.params?.accountId) {
      const loadSavedCredentials = async () => {
        try {
          const savedAccountId = await AsyncStorage.getItem(STORAGE_KEY_ACCOUNT_ID);
          const savedAppId = await AsyncStorage.getItem(STORAGE_KEY_APP_ID);
          if (savedAccountId) setAccountId(savedAccountId);
          if (savedAppId) setApplicationId(savedAppId);
        } catch (e) {
          console.warn('Failed to load saved credentials:', e);
        }
      };
      loadSavedCredentials();
    }
  }, []);

  const isNonDefault =
    accountId !== APPCUES_ACCOUNT_ID || applicationId !== APPCUES_APPLICATION_ID;

  const [userId, setUserId] = useState(DEFAULT_USER.userId);
  const [email, setEmail] = useState(DEFAULT_USER.email);
  const [role, setRole] = useState(DEFAULT_USER.role);
  const [company, setCompany] = useState(DEFAULT_USER.company);
  const [plan, setPlan] = useState(DEFAULT_USER.plan);
  const [industry, setIndustry] = useState(DEFAULT_USER.industry);
  const [language, setLanguage] = useState(DEFAULT_USER.language);

  const [groupId, setGroupId] = useState(DEFAULT_GROUP.groupId);
  const [groupName, setGroupName] = useState(DEFAULT_GROUP.groupName);
  const [groupPlan, setGroupPlan] = useState(DEFAULT_GROUP.groupPlan);
  const [groupSeats, setGroupSeats] = useState(DEFAULT_GROUP.groupSeats);
  const [groupRegion, setGroupRegion] = useState(DEFAULT_GROUP.groupRegion);
  const [groupMrr, setGroupMrr] = useState(DEFAULT_GROUP.groupMrr);
  const [groupOnboardingComplete, setGroupOnboardingComplete] = useState(DEFAULT_GROUP.groupOnboardingComplete);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId.trim()) {
      Alert.alert('User ID required', 'Please enter a user ID to continue.');
      return;
    }

    setLoading(true);

    const userProps: UserProps = {
      email,
      role,
      company,
      plan,
      industry,
      language,
    };

    try {
      await Appcues.setup(accountId, applicationId);

      await Appcues.identify(userId.trim(), {
        email,
        role,
        company,
        plan,
        industry,
        language,
      });

      if (groupId.trim()) {
        await Appcues.group(groupId.trim(), {
          name: groupName,
          plan: groupPlan,
          seats: groupSeats ? Number(groupSeats) : undefined,
          region: groupRegion,
          mrr: groupMrr ? Number(groupMrr) : undefined,
          onboardingComplete: groupOnboardingComplete,
        });
      }

      await Appcues.track('User Logged In');
      await Appcues.screen('Home');

      navigation.navigate('Home', {
        userId: userId.trim(),
        userProps,
        accountId,
        applicationId,
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Check the console for details.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header} testID="login-header">
          <Text style={styles.title} testID="login-title">Appcues Test App</Text>
          <Text style={styles.subtitle} testID="login-subtitle">
            Sign in to start testing mobile experiences
          </Text>
        </View>

        {isNonDefault && (
          <View style={styles.warningBanner} testID="login-warning-banner">
            <Text style={styles.warningText}>
              ⚠️ Using a non-default account ({accountId})
            </Text>
          </View>
        )}

        <View style={styles.card} testID="login-identity-card">
          <Text style={styles.sectionLabel}>USER IDENTITY</Text>
          <Text style={styles.label}>User ID</Text>
          <TextInput
            testID="login-userid-input"
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="e.g. rjb-test-user"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            testID="login-email-input"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.card} testID="login-properties-card">
          <Text style={styles.sectionLabel}>USER PROPERTIES</Text>
          <Text style={styles.label}>Role</Text>
          <TextInput
            testID="login-role-input"
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="e.g. Support Specialist"
          />
          <Text style={styles.label}>Company</Text>
          <TextInput
            testID="login-company-input"
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder="e.g. Appcues"
          />
          <Text style={styles.label}>Plan</Text>
          <TextInput
            testID="login-plan-input"
            style={styles.input}
            value={plan}
            onChangeText={setPlan}
            placeholder="e.g. growth, essentials, enterprise"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Industry</Text>
          <TextInput
            testID="login-industry-input"
            style={styles.input}
            value={industry}
            onChangeText={setIndustry}
            placeholder="e.g. SaaS"
          />
          <Text style={styles.label}>Language</Text>
          <TextInput
            testID="login-language-input"
            style={styles.input}
            value={language}
            onChangeText={setLanguage}
            placeholder="e.g. en, es, fr"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.card} testID="login-group-card">
          <Text style={styles.sectionLabel}>GROUP PROPERTIES</Text>
          <Text style={styles.groupHint}>
            Associates this user with an account via Appcues.group() on login.
          </Text>
          <Text style={styles.label}>Group ID</Text>
          <TextInput
            testID="login-groupid-input"
            style={styles.input}
            value={groupId}
            onChangeText={setGroupId}
            placeholder="e.g. acme-corp"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            testID="login-groupname-input"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="e.g. Acme Corp"
          />
          <Text style={styles.label}>Plan</Text>
          <TextInput
            testID="login-groupplan-input"
            style={styles.input}
            value={groupPlan}
            onChangeText={setGroupPlan}
            placeholder="e.g. essentials, growth, enterprise"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Seats</Text>
          <TextInput
            testID="login-groupseats-input"
            style={styles.input}
            value={groupSeats}
            onChangeText={setGroupSeats}
            placeholder="e.g. 25"
            keyboardType="number-pad"
          />
          <Text style={styles.label}>Region</Text>
          <TextInput
            testID="login-groupregion-input"
            style={styles.input}
            value={groupRegion}
            onChangeText={setGroupRegion}
            placeholder="e.g. US, EMEA, APAC"
            autoCapitalize="characters"
          />
          <Text style={styles.label}>MRR ($)</Text>
          <TextInput
            testID="login-groupmrr-input"
            style={styles.input}
            value={groupMrr}
            onChangeText={setGroupMrr}
            placeholder="e.g. 2000"
            keyboardType="number-pad"
          />
          <View style={styles.toggleRow} testID="login-group-onboarding-row">
            <View>
              <Text style={styles.label}>Onboarding Complete</Text>
              <Text style={styles.toggleHint}>true / false</Text>
            </View>
            <Switch
              testID="login-group-onboarding-toggle"
              value={groupOnboardingComplete}
              onValueChange={setGroupOnboardingComplete}
              trackColor={{false: '#E5E7EB', true: '#A5A5F0'}}
              thumbColor={groupOnboardingComplete ? '#5C5CE0' : '#9CA3AF'}
            />
          </View>
        </View>

        <TouchableOpacity
          testID="login-signin-button"
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing in...' : 'Sign In & Identify'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Calls Appcues.identify() with user properties and Appcues.group() with group properties.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scroll: {padding: 24, paddingTop: 60},
  header: {marginBottom: 24},
  title: {fontSize: 28, fontWeight: '700', color: '#1A1A2E', marginBottom: 6},
  subtitle: {fontSize: 15, color: '#6B7280'},
  warningBanner: {
    backgroundColor: '#FFF9EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningText: {fontSize: 13, color: '#92400E', fontWeight: '500'},
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleHint: {fontSize: 12, color: '#9CA3AF', marginTop: 2},
  loginButton: {backgroundColor: '#5C5CE0', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8},
  loginButtonDisabled: {backgroundColor: '#A5A5F0'},
  loginButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  hint: {fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12, marginBottom: 40},
});
