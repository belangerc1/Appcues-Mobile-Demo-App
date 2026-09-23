import React, {useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Appcues from '@appcues/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Explore'>;
  route: RouteProp<RootStackParamList, 'Explore'>;
};

const ITEMS = [
  {id: '1', title: 'Getting Started Guide', category: 'Onboarding', icon: '🚀'},
  {id: '2', title: 'Dashboard Overview', category: 'Analytics', icon: '📊'},
  {id: '3', title: 'Team Settings', category: 'Settings', icon: '⚙️'},
  {id: '4', title: 'Integrations', category: 'Settings', icon: '🔌'},
  {id: '5', title: 'Reports', category: 'Analytics', icon: '📈'},
  {id: '6', title: 'Notifications', category: 'Settings', icon: '🔔'},
];

export default function ExploreScreen({navigation, route}: Props) {
  const {userId} = route.params;

  useFocusEffect(useCallback(() => {
    Appcues.screen('Explore');
  }, []));

  const handleItemPress = (item: (typeof ITEMS)[0]) => {
    Appcues.track('Tapped Explore Item', {
      itemId: item.id,
      itemTitle: item.title,
      category: item.category,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="explore-back-button"
          onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title} testID="explore-title">Explore</Text>
      <Text style={styles.subtitle}>
        This screen calls Appcues.screen("Explore") on load. Target flows to
        this screen in Studio using the Screen condition.
      </Text>

      <View style={styles.infoBanner} testID="explore-info-banner">
        <Text style={styles.infoText}>
          Screen tracked: <Text style={styles.infoHighlight}>"Explore"</Text>
        </Text>
      </View>

      <View style={styles.card} testID="explore-content-card">
        <Text style={styles.sectionLabel}>CONTENT</Text>
        <Text style={styles.sectionHint}>
          Tapping items fires Appcues.track("Tapped Explore Item") with properties
        </Text>
        {ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            testID={`explore-item-${item.id}`}
            style={[
              styles.itemRow,
              index === ITEMS.length - 1 && styles.itemRowLast,
            ]}
            onPress={() => handleItemPress(item)}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={styles.itemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card} testID="explore-howto-card">
        <Text style={styles.sectionLabel}>HOW TO USE THIS SCREEN</Text>
        <Text style={styles.tipText}>
          1. In Appcues Studio, create a new flow{'\n'}
          2. Under Targeting, add a condition: Screen = "Explore"{'\n'}
          3. Publish the flow{'\n'}
          4. Navigate to this screen in the app{'\n'}
          5. The flow should appear automatically
        </Text>
      </View>
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
  infoBanner: {backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12, marginBottom: 16},
  infoText: {fontSize: 14, color: '#4338CA'},
  infoHighlight: {fontWeight: '600'},
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
  sectionLabel: {fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1, marginBottom: 4},
  sectionHint: {fontSize: 12, color: '#9CA3AF', marginBottom: 12, lineHeight: 16},
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemRowLast: {borderBottomWidth: 0},
  itemIcon: {fontSize: 22, marginRight: 12},
  itemContent: {flex: 1},
  itemTitle: {fontSize: 15, color: '#1A1A2E', fontWeight: '500'},
  itemCategory: {fontSize: 12, color: '#9CA3AF', marginTop: 1},
  itemArrow: {fontSize: 18, color: '#9CA3AF'},
  tipText: {fontSize: 14, color: '#374151', lineHeight: 24},
});