import React, {useCallback} from 'react';
import {
  View,
  Text,
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
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({navigation, route}: Props) {
  const {userId, userProps, accountId, applicationId} = route.params;

  useFocusEffect(useCallback(() => {
    Appcues.screen('Home');
  }, []));

  const trackEvent = async (eventName: string) => {
    try {
      await Appcues.track(eventName);
      Alert.alert('Event Tracked', `"${eventName}" was sent to Appcues.`);
    } catch (error) {
      console.error('Track error:', error);
    }
  };

  const openDebugger = async () => {
    try {
      await Appcues.debug();
    } catch (error) {
      Alert.alert(
        'Debugger unavailable',
        'Make sure the URL scheme is configured in Xcode.',
      );
    }
  };

  const handleLogout = () => {
    Appcues.reset();
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header} testID="home-header">
        <View testID="home-user-info">
          <Text style={styles.greeting} testID="home-greeting">Welcome back</Text>
          <Text style={styles.userId} testID="home-userid">{userId}</Text>
          <Text style={styles.userMeta} testID="home-usermeta">
            {userProps.role} · {userProps.company}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            testID="home-settings-button"
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings', {currentAccountId: accountId, currentApplicationId: applicationId})}>
            <Text style={styles.iconButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="home-logout-button"
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section} testID="home-screens-section">
        <Text style={styles.sectionLabel}>SCREENS</Text>
        <Text style={styles.sectionHint}>
          Each screen calls Appcues.screen() for screen-based targeting
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            testID="home-profile-card"
            style={styles.navCard}
            onPress={() => navigation.navigate('Profile', {userId, userProps})}>
            <Text style={styles.navCardIcon}>👤</Text>
            <Text style={styles.navCardTitle}>Profile</Text>
            <Text style={styles.navCardSub}>Update user and group properties</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="home-events-card"
            style={styles.navCard}
            onPress={() => navigation.navigate('Events', {userId})}>
            <Text style={styles.navCardIcon}>⚡</Text>
            <Text style={styles.navCardTitle}>Events</Text>
            <Text style={styles.navCardSub}>Fire custom events</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            testID="home-explore-card"
            style={styles.navCard}
            onPress={() => navigation.navigate('Explore', {userId})}>
            <Text style={styles.navCardIcon}>🧭</Text>
            <Text style={styles.navCardTitle}>Explore</Text>
            <Text style={styles.navCardSub}>Test screen-based flows</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="home-embeds-card"
            style={styles.navCard}
            onPress={() => navigation.navigate('Embeds', {userId})}>
            <Text style={styles.navCardIcon}>🪟</Text>
            <Text style={styles.navCardTitle}>Embeds</Text>
            <Text style={styles.navCardSub}>Test embedded content</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section} testID="home-events-section">
        <Text style={styles.sectionLabel}>QUICK EVENTS</Text>
        <Text style={styles.sectionHint}>
          Tap to fire an event — use these as flow triggers in Studio
        </Text>
        {[
          'Clicked CTA',
          'Viewed Dashboard',
          'Started Onboarding',
          'Completed Step',
          'Upgraded Plan',
          'Invited Team Member',
        ].map(event => (
          <TouchableOpacity
            key={event}
            testID={`home-event-${event.toLowerCase().replace(/ /g, '-')}`}
            style={styles.eventButton}
            onPress={() => trackEvent(event)}>
            <Text style={styles.eventButtonText}>{event}</Text>
            <Text style={styles.eventArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section} testID="home-tools-section">
        <Text style={styles.sectionLabel}>APPCUES TOOLS</Text>
        <TouchableOpacity
          testID="home-debugger-button"
          style={styles.toolButton}
          onPress={openDebugger}>
          <Text style={styles.toolButtonText}>Open Appcues Debugger</Text>
          <Text style={styles.toolButtonSub}>Validate your SDK installation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="home-reidentify-button"
          style={[styles.toolButton, styles.toolButtonSecondary]}
          onPress={() => {
            Appcues.identify(userId, {
              email: userProps.email,
              role: userProps.role,
              company: userProps.company,
              plan: userProps.plan,
              industry: userProps.industry,
              language: userProps.language,
            });
            Alert.alert('Re-identified', `Appcues.identify() called for ${userId}`);
          }}>
          <Text style={styles.toolButtonTextSecondary}>Re-identify User</Text>
          <Text style={styles.toolButtonSubSecondary}>
            Re-sends current user properties
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F7FA'},
  scroll: {padding: 20, paddingTop: 60, paddingBottom: 40},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {fontSize: 13, color: '#9CA3AF', marginBottom: 2},
  userId: {fontSize: 22, fontWeight: '700', color: '#1A1A2E'},
  userMeta: {fontSize: 13, color: '#6B7280', marginTop: 2},
  headerActions: {flexDirection: 'row', alignItems: 'center', gap: 8},
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {fontSize: 16},
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  logoutText: {fontSize: 13, color: '#6B7280'},
  section: {marginBottom: 24},
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionHint: {fontSize: 12, color: '#9CA3AF', marginBottom: 12},
  row: {flexDirection: 'row', gap: 12, marginBottom: 12},
  navCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  navCardWide: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  navCardIcon: {fontSize: 24, marginBottom: 8},
  navCardTitle: {fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginBottom: 2},
  navCardSub: {fontSize: 12, color: '#9CA3AF'},
  eventButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  eventButtonText: {fontSize: 15, color: '#1A1A2E'},
  eventArrow: {fontSize: 18, color: '#9CA3AF'},
  toolButton: {
    backgroundColor: '#5C5CE0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  toolButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toolButtonText: {fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 2},
  toolButtonTextSecondary: {fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginBottom: 2},
  toolButtonSub: {fontSize: 12, color: '#A5A5F0'},
  toolButtonSubSecondary: {fontSize: 12, color: '#9CA3AF'},
});