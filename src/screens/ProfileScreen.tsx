import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import * as Appcues from '@appcues/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList, UserProps} from '../../App';
import {DEFAULT_GROUP} from '../config';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};

type PropType = 'text' | 'number' | 'boolean';

type CustomProp = {
  id: string;
  key: string;
  value: string | number | boolean;
  type: PropType;
};

// Reusable component for adding custom properties
function CustomPropsEditor({
  props,
  onAdd,
  onRemove,
  testPrefix,
}: {
  props: CustomProp[];
  onAdd: (prop: CustomProp) => void;
  onRemove: (id: string) => void;
  testPrefix: string;
}) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [boolValue, setBoolValue] = useState(false);
  const [type, setType] = useState<PropType>('text');
  const [keyError, setKeyError] = useState('');
  const [valueError, setValueError] = useState('');

  const handleAdd = () => {
    setKeyError('');
    setValueError('');

    if (!key.trim()) {
      setKeyError('Property name is required.');
      return;
    }

    if (type === 'number') {
      if (value.trim() === '' || isNaN(Number(value))) {
        setValueError('Value must be a number.');
        return;
      }
    }

    if (type !== 'boolean' && value.trim() === '') {
      setValueError('Value is required.');
      return;
    }

    const resolvedValue =
      type === 'boolean'
        ? boolValue
        : type === 'number'
        ? Number(value)
        : value.trim();

    onAdd({
      id: `${Date.now()}`,
      key: key.trim(),
      value: resolvedValue,
      type,
    });

    setKey('');
    setValue('');
    setBoolValue(false);
    setType('text');
  };

  return (
    <View>
      {/* Type selector */}
      <View style={styles.typeRow}>
        {(['text', 'number', 'boolean'] as PropType[]).map(t => (
          <TouchableOpacity
            key={t}
            testID={`${testPrefix}-type-${t}`}
            style={[styles.typeButton, type === t && styles.typeButtonActive]}
            onPress={() => {
              setType(t);
              setValueError('');
            }}>
            <Text
              style={[
                styles.typeButtonText,
                type === t && styles.typeButtonTextActive,
              ]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key input */}
      <TextInput
        testID={`${testPrefix}-key-input`}
        style={[styles.input, keyError ? styles.inputError : null]}
        value={key}
        onChangeText={t => {
          setKey(t);
          setKeyError('');
        }}
        placeholder="Property name"
        autoCapitalize="none"
      />
      {keyError ? <Text style={styles.errorText}>{keyError}</Text> : null}

      {/* Value input — switches based on type */}
      {type === 'boolean' ? (
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Value</Text>
          <Switch
            testID={`${testPrefix}-bool-toggle`}
            value={boolValue}
            onValueChange={setBoolValue}
            trackColor={{false: '#E5E7EB', true: '#A5A5F0'}}
            thumbColor={boolValue ? '#5C5CE0' : '#9CA3AF'}
          />
        </View>
      ) : (
        <>
          <TextInput
            testID={`${testPrefix}-value-input`}
            style={[
              styles.input,
              styles.inputMt,
              valueError ? styles.inputError : null,
            ]}
            value={value}
            onChangeText={t => {
              setValue(t);
              setValueError('');
            }}
            placeholder={type === 'number' ? 'e.g. 42' : 'Value'}
            keyboardType={type === 'number' ? 'decimal-pad' : 'default'}
            autoCapitalize="none"
          />
          {valueError ? (
            <Text style={styles.errorText}>{valueError}</Text>
          ) : null}
        </>
      )}

      <TouchableOpacity
        testID={`${testPrefix}-add-button`}
        style={styles.addButton}
        onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Add Property</Text>
      </TouchableOpacity>

      {/* Added properties list */}
      {props.length > 0 && (
        <View style={styles.propList} testID={`${testPrefix}-prop-list`}>
          {props.map(prop => (
            <View key={prop.id} style={styles.propRow} testID={`${testPrefix}-prop-${prop.key}`}>
              <View style={styles.propInfo}>
                <Text style={styles.propKey}>{prop.key}</Text>
                <Text style={styles.propValue}>
                  {String(prop.value)}
                  <Text style={styles.propType}> · {prop.type}</Text>
                </Text>
              </View>
              <TouchableOpacity
                testID={`${testPrefix}-remove-${prop.key}`}
                onPress={() => onRemove(prop.id)}
                style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ProfileScreen({navigation, route}: Props) {
  const {userId, userProps} = route.params;

  const [email, setEmail] = useState(userProps.email);
  const [role, setRole] = useState(userProps.role);
  const [company, setCompany] = useState(userProps.company);
  const [plan, setPlan] = useState(userProps.plan);
  const [industry, setIndustry] = useState(userProps.industry);
  const [language, setLanguage] = useState(userProps.language);
  const [saving, setSaving] = useState(false);
  const [customUserProps, setCustomUserProps] = useState<CustomProp[]>([]);

  // Group properties
  const [groupId, setGroupId] = useState(DEFAULT_GROUP.groupId);
  const [groupName, setGroupName] = useState(DEFAULT_GROUP.groupName);
  const [groupIndustry, setGroupIndustry] = useState('SaaS');
  const [groupPlan, setGroupPlan] = useState(DEFAULT_GROUP.groupPlan);
  const [groupSeats, setGroupSeats] = useState(DEFAULT_GROUP.groupSeats);
  const [groupRegion, setGroupRegion] = useState(DEFAULT_GROUP.groupRegion);
  const [groupMrr, setGroupMrr] = useState(DEFAULT_GROUP.groupMrr);
  const [groupOnboardingComplete, setGroupOnboardingComplete] = useState(DEFAULT_GROUP.groupOnboardingComplete);
  const [savingGroup, setSavingGroup] = useState(false);
  const [customGroupProps, setCustomGroupProps] = useState<CustomProp[]>([]);

  useFocusEffect(useCallback(() => {
    Appcues.screen('Profile');
  }, []));

  const addCustomUserProp = (prop: CustomProp) => {
    setCustomUserProps(prev => [...prev, prop]);
  };

  const removeCustomUserProp = (id: string) => {
    setCustomUserProps(prev => prev.filter(p => p.id !== id));
  };

  const addCustomGroupProp = (prop: CustomProp) => {
    setCustomGroupProps(prev => [...prev, prop]);
  };

  const removeCustomGroupProp = (id: string) => {
    setCustomGroupProps(prev => prev.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);

    const updatedProps: UserProps = {
      email,
      role,
      company,
      plan,
      industry,
      language,
    };

    // Merge custom user props
    const customPropsObj = customUserProps.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {} as Record<string, string | number | boolean>);

    try {
      await Appcues.identify(userId, {
        email,
        role,
        company,
        plan,
        industry,
        language,
        ...customPropsObj,
      });

      await Appcues.track('Updated Profile');

      Alert.alert(
        'Profile Updated',
        'Appcues.identify() was called with your updated properties.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Home', {userId, userProps: updatedProps}),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Could not update profile. Check the console.');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleGroupSave = async () => {
    if (!groupId.trim()) {
      Alert.alert('Group ID required', 'Please enter a group ID.');
      return;
    }

    setSavingGroup(true);

    // Merge custom group props
    const customGroupPropsObj = customGroupProps.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {} as Record<string, string | number | boolean>);

    try {
      await Appcues.group(groupId.trim(), {
        name: groupName,
        industry: groupIndustry,
        plan: groupPlan,
        seats: groupSeats ? Number(groupSeats) : undefined,
        region: groupRegion,
        mrr: groupMrr ? Number(groupMrr) : undefined,
        onboardingComplete: groupOnboardingComplete,
        ...customGroupPropsObj,
      });

      await Appcues.track('Updated Group');

      Alert.alert(
        'Group Updated',
        `Appcues.group("${groupId.trim()}") was called with group properties.`,
      );
    } catch (error) {
      Alert.alert('Error', 'Could not update group. Check the console.');
      console.error('Group update error:', error);
    } finally {
      setSavingGroup(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            testID="profile-back-button"
            onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title} testID="profile-title">Profile</Text>
        <Text style={styles.subtitle}>
          Changes here call Appcues.identify() with updated properties — useful
          for testing segment targeting.
        </Text>

        <View style={styles.userIdBadge} testID="profile-userid-badge">
          <Text style={styles.userIdLabel}>User ID</Text>
          <Text style={styles.userIdValue} testID="profile-userid-value">{userId}</Text>
        </View>

        {/* User Identity */}
        <View style={styles.card} testID="profile-identity-card">
          <Text style={styles.sectionLabel}>IDENTITY</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            testID="profile-email-input"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* User Properties */}
        <View style={styles.card} testID="profile-properties-card">
          <Text style={styles.sectionLabel}>USER PROPERTIES</Text>
          <Text style={styles.label}>Role</Text>
          <TextInput
            testID="profile-role-input"
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="e.g. Support Specialist"
          />
          <Text style={styles.label}>Company</Text>
          <TextInput
            testID="profile-company-input"
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder="e.g. Appcues"
          />
          <Text style={styles.label}>Plan</Text>
          <TextInput
            testID="profile-plan-input"
            style={styles.input}
            value={plan}
            onChangeText={setPlan}
            placeholder="e.g. growth, essentials, enterprise"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Industry</Text>
          <TextInput
            testID="profile-industry-input"
            style={styles.input}
            value={industry}
            onChangeText={setIndustry}
            placeholder="e.g. SaaS"
          />
          <Text style={styles.label}>Language</Text>
          <TextInput
            testID="profile-language-input"
            style={styles.input}
            value={language}
            onChangeText={setLanguage}
            placeholder="e.g. en, es, fr"
            autoCapitalize="none"
          />
        </View>

        {/* Custom User Properties */}
        <View style={styles.card} testID="profile-custom-user-card">
          <Text style={styles.sectionLabel}>CUSTOM USER PROPERTIES</Text>
          <Text style={styles.groupHint}>
            Add any extra properties to send with Appcues.identify().
          </Text>
          <CustomPropsEditor
            props={customUserProps}
            onAdd={addCustomUserProp}
            onRemove={removeCustomUserProp}
            testPrefix="profile-custom-user"
          />
        </View>

        <TouchableOpacity
          testID="profile-save-button"
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save & Re-identify'}
          </Text>
        </TouchableOpacity>

        {/* Group Properties */}
        <View style={styles.card} testID="profile-group-card">
          <Text style={styles.sectionLabel}>GROUP PROPERTIES</Text>
          <Text style={styles.groupHint}>
            Associates this user with a group via Appcues.group(). Useful for
            account-level targeting.
          </Text>

          <Text style={styles.label}>Group ID *</Text>
          <TextInput
            testID="profile-groupid-input"
            style={styles.input}
            value={groupId}
            onChangeText={setGroupId}
            placeholder="e.g. acme-corp"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            testID="profile-groupname-input"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="e.g. Acme Corp"
          />
          <Text style={styles.label}>Industry</Text>
          <TextInput
            testID="profile-groupindustry-input"
            style={styles.input}
            value={groupIndustry}
            onChangeText={setGroupIndustry}
            placeholder="e.g. SaaS, Fintech, Healthcare"
          />
          <Text style={styles.label}>Plan</Text>
          <TextInput
            testID="profile-groupplan-input"
            style={styles.input}
            value={groupPlan}
            onChangeText={setGroupPlan}
            placeholder="e.g. essentials, growth, enterprise"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Seats</Text>
          <TextInput
            testID="profile-groupseats-input"
            style={styles.input}
            value={groupSeats}
            onChangeText={setGroupSeats}
            placeholder="e.g. 25"
            keyboardType="number-pad"
          />
          <Text style={styles.label}>Region</Text>
          <TextInput
            testID="profile-groupregion-input"
            style={styles.input}
            value={groupRegion}
            onChangeText={setGroupRegion}
            placeholder="e.g. US, EMEA, APAC"
            autoCapitalize="characters"
          />
          <Text style={styles.label}>MRR ($)</Text>
          <TextInput
            testID="profile-groupmrr-input"
            style={styles.input}
            value={groupMrr}
            onChangeText={setGroupMrr}
            placeholder="e.g. 2000"
            keyboardType="number-pad"
          />
          <View style={styles.toggleRow} testID="profile-group-onboarding-row">
            <View>
              <Text style={styles.label}>Onboarding Complete</Text>
              <Text style={styles.toggleHint}>true / false</Text>
            </View>
            <Switch
              testID="profile-group-onboarding-toggle"
              value={groupOnboardingComplete}
              onValueChange={setGroupOnboardingComplete}
              trackColor={{false: '#E5E7EB', true: '#A5A5F0'}}
              thumbColor={groupOnboardingComplete ? '#5C5CE0' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Custom Group Properties */}
        <View style={styles.card} testID="profile-custom-group-card">
          <Text style={styles.sectionLabel}>CUSTOM GROUP PROPERTIES</Text>
          <Text style={styles.groupHint}>
            Add any extra properties to send with Appcues.group().
          </Text>
          <CustomPropsEditor
            props={customGroupProps}
            onAdd={addCustomGroupProp}
            onRemove={removeCustomGroupProp}
            testPrefix="profile-custom-group"
          />
        </View>

        <TouchableOpacity
          testID="profile-group-save-button"
          style={[styles.saveButton, styles.groupButton, savingGroup && styles.saveButtonDisabled]}
          onPress={handleGroupSave}
          disabled={savingGroup}>
          <Text style={styles.saveButtonText}>
            {savingGroup ? 'Saving...' : 'Save Group'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Calls Appcues.group("{groupId || 'group-id'}", {'{'} name, industry, plan, seats, region, mrr, onboardingComplete, ...custom {'}'})
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scroll: {padding: 20, paddingTop: 56, paddingBottom: 40},
  headerRow: {marginBottom: 16},
  back: {fontSize: 17, color: '#5C5CE0'},
  title: {fontSize: 26, fontWeight: '700', color: '#1A1A2E', marginBottom: 6},
  subtitle: {fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20},
  userIdBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userIdLabel: {fontSize: 12, color: '#5C5CE0', fontWeight: '600'},
  userIdValue: {fontSize: 14, color: '#3730A3', fontWeight: '500'},
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
  groupHint: {fontSize: 12, color: '#9CA3AF', marginBottom: 12, lineHeight: 16},
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
  inputMt: {marginTop: 8},
  inputError: {borderColor: '#EF4444'},
  errorText: {fontSize: 12, color: '#EF4444', marginTop: 4},
  typeRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  typeButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  typeButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#5C5CE0',
  },
  typeButtonText: {fontSize: 13, color: '#6B7280', fontWeight: '500'},
  typeButtonTextActive: {color: '#5C5CE0', fontWeight: '600'},
  addButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#5C5CE0',
    borderRadius: 8,
    padding: 11,
    alignItems: 'center',
  },
  addButtonText: {color: '#5C5CE0', fontSize: 14, fontWeight: '600'},
  propList: {marginTop: 12},
  propRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  propInfo: {flex: 1},
  propKey: {fontSize: 14, fontWeight: '600', color: '#1A1A2E'},
  propValue: {fontSize: 13, color: '#6B7280', marginTop: 1},
  propType: {fontSize: 12, color: '#9CA3AF'},
  removeButton: {padding: 6},
  removeButtonText: {fontSize: 14, color: '#9CA3AF'},
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleHint: {fontSize: 12, color: '#9CA3AF', marginTop: 2},
  saveButton: {
    backgroundColor: '#5C5CE0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  groupButton: {backgroundColor: '#0EA5E9'},
  saveButtonDisabled: {backgroundColor: '#A5A5F0'},
  saveButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  hint: {fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 4, lineHeight: 18, marginBottom: 20},
});
