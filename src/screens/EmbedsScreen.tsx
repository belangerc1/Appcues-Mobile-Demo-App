import React, {useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {AppcuesFrameView} from '@appcues/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import * as Appcues from '@appcues/react-native';
import {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Embeds'>;
  route: RouteProp<RootStackParamList, 'Embeds'>;
};

const FRAMES = [
  {
    id: 'frame-1',
    label: 'Frame 1',
    hint: 'Use frame ID "frame-1" when building this embed in Studio',
  },
  {
    id: 'frame-2',
    label: 'Frame 2',
    hint: 'Use frame ID "frame-2" when building this embed in Studio',
  },
  {
    id: 'frame-3',
    label: 'Frame 3',
    hint: 'Use frame ID "frame-3" when building this embed in Studio',
  },
];

export default function EmbedsScreen({navigation}: Props) {
  useFocusEffect(useCallback(() => {
    Appcues.screen('Embeds');
  }, []));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="embeds-back-button"
          onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title} testID="embeds-title">Embeds</Text>
      <Text style={styles.subtitle}>
        Each frame below is a slot where an Appcues embed will appear. Create
        an embed in Studio, set its Frame ID to match, and it will render here
        automatically.
      </Text>

      <View style={styles.infoBanner} testID="embeds-info-banner">
        <Text style={styles.infoText}>
          Screen tracked: <Text style={styles.infoHighlight}>"Embeds"</Text>
        </Text>
      </View>

      {FRAMES.map(frame => (
        <View key={frame.id} style={styles.frameCard} testID={`embeds-frame-card-${frame.id}`}>
          <View style={styles.frameHeader}>
            <Text style={styles.frameLabel}>{frame.label.toUpperCase()}</Text>
            <View style={styles.frameIdBadge}>
              <Text style={styles.frameIdText}>{frame.id}</Text>
            </View>
          </View>
          <Text style={styles.frameHint}>{frame.hint}</Text>
          <View style={styles.frameContainer} testID={`embeds-frame-${frame.id}`}>
            <AppcuesFrameView
              frameID={frame.id}
              style={styles.frameView}
            />
          </View>
        </View>
      ))}

      <View style={styles.howtoCard} testID="embeds-howto-card">
        <Text style={styles.howtoLabel}>HOW TO USE</Text>
        <Text style={styles.howtoText}>
          1. In Appcues Studio, create a new Embed experience{'\n'}
          2. Set the Frame ID to match one of the frames above{'\n'}
          3. Set targeting to this screen: Screen = "Embeds"{'\n'}
          4. Publish the embed{'\n'}
          5. Navigate to this screen — the embed appears in its frame
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
  infoBanner: {backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12, marginBottom: 20},
  infoText: {fontSize: 14, color: '#4338CA'},
  infoHighlight: {fontWeight: '600'},
  frameCard: {
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
  frameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  frameLabel: {fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1},
  frameIdBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  frameIdText: {fontSize: 12, color: '#5C5CE0', fontWeight: '600'},
  frameHint: {fontSize: 12, color: '#9CA3AF', marginBottom: 12, lineHeight: 16},
  frameContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 80,
  },
  frameView: {width: '100%'},
  howtoCard: {
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
  howtoLabel: {fontSize: 11, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8},
  howtoText: {fontSize: 14, color: '#374151', lineHeight: 24},
});
