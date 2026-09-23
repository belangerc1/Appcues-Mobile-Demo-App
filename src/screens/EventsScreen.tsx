import React, {useCallback, useState} from 'react';
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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Events'>;
  route: RouteProp<RootStackParamList, 'Events'>;
};

const PRESET_EVENTS = {
  Onboarding: [
    'Started Onboarding',
    'Completed Onboarding',
    'Skipped Onboarding',
    'Viewed Welcome Screen',
  ],
  Engagement: [
    'Clicked CTA',
    'Viewed Dashboard',
    'Opened Settings',
    'Used Search',
  ],
  'Feature Usage': [
    'Created Item',
    'Deleted Item',
    'Exported Data',
    'Shared Content',
  ],
  Conversion: [
    'Started Trial',
    'Upgraded Plan',
    'Invited Team Member',
    'Connected Integration',
  ],
};

export default function EventsScreen({navigation, route}: Props) {
  const {userId} = route.params;
  const [customEvent, setCustomEvent] = useState('');
  const [lastFired, setLastFired] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    Appcues.screen('Events');
  }, []));

  const fireEvent = async (eventName: string) => {
    if (!eventName.trim()) return;
    try {
      await Appcues.track(eventName.trim());
      setLastFired(eventName.trim());
      setTimeout(() => setLastFired(null), 2000);
    } catch (error) {
      Alert.alert('Error', `Could not track event: ${eventName}`);
      console.error('Track error:', error);
    }
  };

  const fireCustomEvent = () => {
    if (!customEvent.trim()) {
      Alert.alert('Event name required', 'Please enter a custom event name.');
      return;
    }
    fireEvent(customEvent.trim());
    setCustomEvent('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="events-back-button"
          onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title} testID="events-title">Events</Text>
      <Text style={styles.subtitle}>
        Tap any event to fire it via Appcues.track(). Use these as triggers
        when building flows in Studio.
      </Text>

      {lastFired && (
        <View style={styles.successBanner} testID="events-success-banner">
          <Text style={styles.successText}>Fired: "{lastFired}"</Text>
        </View>
      )}

      <View style={styles.card} testID="events-custom-card">
        <Text style={styles.sectionLabel}>CUSTOM EVENT</Text>
        <View style={styles.customRow}>
          <TextInput
            testID="events-custom-input"
            style={styles.customInput}
            value={customEvent}
            onChangeText={setCustomEvent}
            placeholder="Type any event name..."
            returnKeyType="send"
            onSubmitEditing={fireCustomEvent}
          />
          <TouchableOpacity
            testID="events-fire-button"
            style={styles.fireButton}
            onPress={fireCustomEvent}>
            <Text style={styles.fireButtonText}>Fire</Text>
          </TouchableOpacity>
        </View>
      </View>

      {Object.entries(PRESET_EVENTS).map(([category, events]) => (
        <View key={category} style={styles.card} testID={`events-category-${category.toLowerCase().replace(/ /g, '-')}`}>
          <Text style={styles.sectionLabel}>{category.toUpperCase()}</Text>
          {events.map(event => (
            <TouchableOpacity
              key={event}
              testID={`events-preset-${event.toLowerCase().replace(/ /g, '-')}`}
              style={styles.eventRow}
              onPress={() => fireEvent(event)}>
              <Text style={styles.eventName}>{event}</Text>
              <Text style={styles.eventArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scroll: {padding: 20, paddingTop: 56, paddingBottom: 40},
  headerRow: {marginBottom: 16},
  back: {fontSize: 17, color: '#5C5CE0'},
  title: {fontSize: 26, fontWeight: '700', color: '#1A1A2E', marginBottom: 6},
  subtitle: {fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20},
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  successText: {fontSize: 14, color: '#065F46', fontWeight: '500'},
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
  sectionLabel: {fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1, marginBottom: 12},
  customRow: {flexDirection: 'row', gap: 10},
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1A1A2E',
    backgroundColor: '#F9FAFB',
  },
  fireButton: {
    backgroundColor: '#5C5CE0',
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  fireButtonText: {color: '#FFFFFF', fontSize: 15, fontWeight: '600'},
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventName: {fontSize: 15, color: '#1A1A2E'},
  eventArrow: {fontSize: 18, color: '#9CA3AF'},
});